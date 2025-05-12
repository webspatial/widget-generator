import { useEffect, useRef, useState } from "react";
import "./App.css"
import { painManager } from "@/lib/whiteboard/PainManager";
import ColorSelect from "./component/style-tool/color-select";
import { ColorProps, LineWidthProps } from "./types";
import EditTool from "./component/editTool";
import { WhiteboardConfig } from "./utils/config";

export default function App() {
    const [colors, setColors] = useState<ColorProps[]>([])
    const [widths, setWidths] = useState<LineWidthProps[]>([])
    const canvasEl = useRef<HTMLDivElement>(null);

    const onNewBoard = () => {
        console.log('new board')
    }
    

    useEffect(() => {
        if(canvasEl.current){
            WhiteboardConfig.mode = new URLSearchParams(window.location.search).get('selectedTemplate') === 'dark'? 'dark' : 'light'
            // #1A1A1A, #E9E9E9
            const backgroundColor = WhiteboardConfig[WhiteboardConfig.mode].background
            painManager.init(backgroundColor, canvasEl.current);

            const useColors:ColorProps[] = [
                {color: '#E25655', isSelected: true},
                {color: '#DAB447', isSelected: false},
                {color: '#457ACA', isSelected: false},
                {color: '#349B5D', isSelected: false},
                {color: backgroundColor === '#E9E9E9' ? '#1A1A1A' : '#E9E9E9', isSelected: false},
            ]

            const useWidths:LineWidthProps[] = [
                {width: WhiteboardConfig.lineWidths[0], isSelected: true},
                {width: WhiteboardConfig.lineWidths[1], isSelected: false},
                {width: WhiteboardConfig.lineWidths[2], isSelected: false},
            ]
            setWidths(useWidths)
            setColors(useColors)
        }
    }, [])

  return <div className="whiteboard">
        <div className="whiteboard-title">
            <div className="whiteboard-title-text">White Board</div>
            <div className="whiteboard-title-button" onClick={onNewBoard}>
                <img src='assets/pages/whiteboard/plus.png' />
            </div>
        </div>
        <div ref={canvasEl} className="board-container">
            <ColorSelect colors={colors} widths={widths} />
        </div>
        <EditTool />
  </div>
}