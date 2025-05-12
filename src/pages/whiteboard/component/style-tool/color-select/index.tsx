import { ColorProps, ColorSelectProps, LineWidthProps } from "@/pages/whiteboard/types"
import { useEffect, useState } from "react"
import './index.css'
import { painManager } from "@/lib/whiteboard/PainManager"

export default function ColorSelect(props:ColorSelectProps){
    const [colors, setColors] = useState<ColorProps[]>([])
    const [lineWidths, setLineWidths] = useState<LineWidthProps[]>([])

    const onSelectColor = (e:any) => {
        e.preventDefault()
        e.stopPropagation()
        const selIndex = Number(e.target.id.split('-')[1])
        const newColors = colors.map((color, index) => {
            if(index === selIndex){
                color.isSelected = true
            }else{
                color.isSelected = false
            }
            return color
        })
        setColors(newColors)
    }

    const onSelectLineWidth = (e:any) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(e)
        const selIndex = Number(e.target.id.split('-')[1])
        const newLineWidths = lineWidths.map((item, index) => {
            if(index === selIndex){
                item.isSelected = true
            }else{
                item.isSelected = false
            }
            return item
        })
        console.log(newLineWidths)
        setLineWidths(newLineWidths)
    }

    useEffect(() => {
        if(colors.length > 0){
            const selColor = colors.find(item => item.isSelected)
            if(selColor){
                painManager.changeLineColor(selColor.color)
            }
        }
        if(lineWidths.length > 0){
            const selWidth = lineWidths.find(item => item.isSelected)
            if(selWidth){
                painManager.changeLineWidth(selWidth.width * 5)
            }
        }
    }, [colors, lineWidths])

    useEffect(() => {
        setColors(props.colors)
    }, [props.colors])

    useEffect(() => {
        setLineWidths(props.widths)
    }, [props.widths])

    return <div className='color-select'>
        {
            colors.map((color, index) => {
                return <div id={`color-${index}`} className='color-item' key={index} onClick={onSelectColor}>
                    <div className="color-item-bg" style={{backgroundColor: color.color}}>
                        {color.isSelected && <img className='color-selected' src='assets/pages/whiteboard/style/submit.png' />}
                    </div>
                </div>
            })
        }
        <div className="color-select-divider" />
        {
            lineWidths.map((item, index) => {
                return <div className='line-width-item' key={index}>
                    <div id={`width-${index}`} className={"line-width-item-bg" + (item.isSelected ? " line-width-selected" : '')} onClick={onSelectLineWidth}>
                        <img className='line-width-img' src={`assets/pages/whiteboard/style/line-width${item.width}.png`} />
                    </div>
                </div>
            })
        }
    </div>
}