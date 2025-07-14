import { useEffect, useRef, useState } from "react";
import "./App.css"
import { painManager } from "@/lib/whiteboard/PainManager";
import ColorSelect from "./component/style-tool/color-select";
import { ColorProps, LineWidthProps } from "./types";
import EditTool from "./component/editTool";
import { WhiteboardConfig } from "./utils/config";
import { AppType, gAppManager } from "@/lib/app-manager";

export default function App() {
    const [colors, setColors] = useState<ColorProps[]>([])
    const [widths, setWidths] = useState<LineWidthProps[]>([])
    const [showTool, setShowTool] = useState<boolean>(true)
    const canvasEl = useRef<HTMLDivElement>(null);

    const jumpToHome = () => {
        gAppManager.createApp(AppType.Home, { from: AppType.Whiteboard });
    };

    const onShowTool = (show:boolean) => {
        setShowTool(show)
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
            <div className="whiteboard-title-button" onClick={jumpToHome}>
                <IconPlus />
            </div>
        </div>
        <div ref={canvasEl} className="board-container">
            {showTool && <ColorSelect show={showTool} colors={colors} widths={widths} background={WhiteboardConfig[WhiteboardConfig.mode].background} />}
        </div>
        <EditTool showTool={onShowTool} />
  </div>
}

function IconPlus({ className }:{ className?:string }){
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
  <path d="M13 10.5H20.5V13H13V20.5H10.5V13H3V10.5H10.5V3H13V10.5Z" fill="white"/>
  </svg>
  
}