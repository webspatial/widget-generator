import { useEffect, useRef, useState } from "react";
import "./App.css"
import { painManager } from "@/lib/whiteboard/PainManager";
import ColorSelect from "./component/style-tool/color-select";
import { ColorProps, LineWidthProps } from "./types";
import EditTool from "./component/editTool";

export default function App() {
    const [colors, setColors] = useState<ColorProps[]>([])
    const [widths, setWidths] = useState<LineWidthProps[]>([])
    const canvasEl = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        if(canvasEl.current){
            // #1A1A1A, #E9E9E9
            const backgroundColor = '#' + (new URLSearchParams(window.location.search).get('backgroundColor') ?? 'E9E9E9')
            painManager.init(backgroundColor, canvasEl.current);

            const useColors:ColorProps[] = [
                {color: '#E25655', isSelected: true},
                {color: '#DAB447', isSelected: false},
                {color: '#457ACA', isSelected: false},
                {color: '#349B5D', isSelected: false},
                {color: '#1E1E1E', isSelected: false},
            ]

            const useWidths:LineWidthProps[] = [
                {width: 1, isSelected: true},
                {width: 2, isSelected: false},
                {width: 3, isSelected: false},
            ]
            setWidths(useWidths)
            setColors(useColors)
        }
    }, [])

  return <div className="whiteboard">
        <div ref={canvasEl} className="board-container"></div>
        <ColorSelect colors={colors} widths={widths} />
        <EditTool />
  </div>
}