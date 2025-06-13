import { WhiteboardConfig } from '@/pages/whiteboard/utils/config';
import { Application, Graphics, Container } from 'pixi.js';
class PainManager {
    private app?: Application;
    private historyCommand: DrawCommand[] = [];
    private bufferCommand: DrawCommand[] = [];
    private isDrawing = false;
    private isActive = true;
    private lineWidth: number = 1;
    private lineColor: string = '0xffffff';
    public backgroundColor: string = '0xffffff';
    private drawType: string = 'draw'; // draw, erase
    public onDraw: () => void = () => {};
    private cursor?: Graphics;
    
    async init(background:string, parent: HTMLElement) {
        this.app = new Application()
        await this.app.init({
            background: background,
            antialias: true,
            autoDensity: true,
            resizeTo: parent,
        })
        this.backgroundColor = background;
        parent.appendChild(this.app.canvas)
        this.app.canvas.style.borderRadius = '16px';
        this.setupDrawing();
    }

    private setupDrawing() {
        if (!this.app) return;
    
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('pointerdown', this.startDrawing.bind(this));
        this.app.stage.on('pointermove', this.draw.bind(this));
        this.app.stage.on('pointerup', this.endDrawing.bind(this));
        this.app.stage.on('pointerupoutside', this.endDrawing.bind(this));
    }
    
    private startDrawing(event:any) {
        if(!this.isActive) return;
        this.isDrawing = true;
        this.bufferCommand = [];
        const graphics = new Graphics();
        const lineColor = this.drawType === 'erase' ? this.backgroundColor : this.lineColor
        graphics.setStrokeStyle({
            width: this.lineWidth,
            color: lineColor,
            cap: 'round',
            join: 'round'
        })
        this.app?.stage.addChild(graphics);
        this.historyCommand.push({
            type: this.drawType,
            data: [graphics]
        });
        graphics.moveTo(event.globalX, event.globalY);
        if(this.cursor){
            this.app?.stage.removeChild(this.cursor);
        }
        this.cursor = new Graphics();
        this.cursor.setStrokeStyle({
            width: this.lineWidth / 4,
            color: WhiteboardConfig[WhiteboardConfig.mode].cursor,
            cap: 'round',
            join: 'round'
        })
        this.cursor.circle(0,0,this.lineWidth / 2);
        this.cursor.fill({color:lineColor});
        this.cursor.stroke();
        this.cursor.position.set(event.globalX, event.globalY);
        this.app?.stage.addChild(this.cursor);
    }
    
    private draw(event:any) {
        if (!this.isDrawing || !this.isActive) return;
        const graphics = this.historyCommand[this.historyCommand.length-1].data[0] as Graphics;
        graphics.lineTo(event.globalX, event.globalY);
        graphics.stroke();
        this.cursor?.position.set(event.globalX, event.globalY);
    }
    
    private endDrawing() {
        this.isDrawing = false;
        this.onDraw();
        if(this.cursor){
            this.app?.stage.removeChild(this.cursor);
            // @ts-ignore
            this.cursor = undefined;
        }
    }

    public clear() {
        if(!this.isActive) return;
        if(this.app?.stage.children){
            console.log(this.app?.stage.children)
            const list = [...this.app?.stage.children]
            for(var i = 0; i < this.app?.stage.children.length; i++) {
                this.app?.stage.removeChild(this.app?.stage.children[i]);
                i--;
            }
            this.historyCommand.push({
                type: 'clear',
                data: list as Graphics[]
            })
        }
        this.bufferCommand = [];
    }

    public undo() {
        if(!this.isActive) return;
        if (this.historyCommand.length > 0) {
            const command = this.historyCommand.pop()!;
            this.bufferCommand.push(command);
            for(var i = 0; i < command.data.length; i++) {
                if(command.type == 'clear'){
                    this.app?.stage.addChild(command.data[i]);
                }
                else{
                    this.app?.stage.removeChild(command.data[i]);
                }
            }
        }
    }
    public redo() {
        if(!this.isActive) return;
        if (this.bufferCommand.length > 0) {
            const command = this.bufferCommand.pop()!;
            this.historyCommand.push(command);
            for(var i = 0; i < command.data.length; i++) {
                if(command.type == 'clear'){
                    this.app?.stage.removeChild(command.data[i]);
                }
                else{
                    this.app?.stage.addChild(command.data[i]);
                }
            }
        }
    }

    public canUndo() {
        return this.historyCommand.length > 0 && this.isActive;
    }

    public canRedo() {
        return this.bufferCommand.length > 0 && this.isActive;
    }

    public changeLineWidth(width: number) {
        this.lineWidth = width;
    }
    public changeLineColor(color: string) {
        this.lineColor = color;
    }

    public changeDrawType(type: string) {
        this.drawType = type;
    }

    public active(act:boolean = true) {
        this.isActive = act;

    }

}

interface DrawCommand{
    type: string;
    data: Array<Graphics | Container>;
}

export const painManager = new PainManager();