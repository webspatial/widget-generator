import { ColorProps, ColorSelectProps, LineWidthProps } from "@/pages/whiteboard/types"
import { useEffect, useState } from "react"
import './index.css'
import { painManager } from "@/lib/whiteboard/PainManager"

export default function ColorSelect(props: ColorSelectProps) {
    const [colors, setColors] = useState<ColorProps[]>([])
    const [lineWidths, setLineWidths] = useState<LineWidthProps[]>([])

    const onSelectColor = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const selIndex = Number(e.target.id.split('-')[1])
        const newColors = colors.map((color, index) => {
            if (index === selIndex) {
                color.isSelected = true
            } else {
                color.isSelected = false
            }
            return color
        })
        setColors(newColors)
    }

    const onSelectLineWidth = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const selIndex = Number(e.target.id.split('-')[1])
        const newLineWidths = lineWidths.map((item, index) => {
            if (index === selIndex) {
                item.isSelected = true
            } else {
                item.isSelected = false
            }
            return item
        })
        setLineWidths(newLineWidths)
    }

    useEffect(() => {
        if (colors.length > 0) {
            const selColor = colors.find(item => item.isSelected)
            if (selColor) {
                painManager.changeLineColor(selColor.color)
            }
        }
        if (lineWidths.length > 0) {
            const selWidth = lineWidths.find(item => item.isSelected)
            if (selWidth) {
                painManager.changeLineWidth(selWidth.width)
            }
        }
    }, [colors, lineWidths])

    useEffect(() => {
        setColors(props.colors)
    }, [props.colors])

    useEffect(() => {
        setLineWidths(props.widths)
    }, [props.widths])

    return <div enable-xr className={`color-select-container ${props.show ? 'show-tool' : 'hide-tool'}`}>
        <div className='color-select'>
            {
                colors.map((color, index) => {
                    return <div id={`color-${index}`} className='color-item' key={index} onClick={onSelectColor}>
                        <div className="color-item-bg" style={{ backgroundColor: color.color }}>
                            {color.isSelected && <IconOK className='color-selected' />}
                        </div>
                    </div>
                })
            }
            <div className="color-select-divider" />
            {
                lineWidths.map((item, index) => {
                    return <div className='line-width-item' key={index}>
                        <div id={`width-${index}`} className={"line-width-item-bg" + (item.isSelected ? " line-width-selected" : '')} onClick={onSelectLineWidth}>
                            <IconLineWidth className='line-width-img' width={index + 1} />
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}


function IconOK({ className }: { className?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M5 10L8.5 13L14.5 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

function IconLineWidth({ className, width }: { className?: string, width: number }) {
    return (<>
        {width === 1 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M15.2931 6.29289C15.6837 5.90237 16.3167 5.90237 16.7072 6.29289C17.0976 6.68342 17.0977 7.31646 16.7072 7.70696L6.7072 17.707C6.3167 18.0975 5.68367 18.0974 5.29314 17.707C4.90261 17.3164 4.90261 16.6834 5.29314 16.2929L15.2931 6.29289ZM17.2931 11.2939C17.6837 10.9033 18.3167 10.9033 18.7072 11.2939C19.0972 11.6844 19.0976 12.3176 18.7072 12.7079L13.7072 17.7079C13.3168 18.0983 12.6837 18.098 12.2931 17.7079C11.9026 17.3174 11.9026 16.6844 12.2931 16.2939L17.2931 11.2939Z" fill="white" />
        </svg>}
        {width === 2 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M15.2931 6.29289C15.6837 5.90237 16.3167 5.90237 16.7072 6.29289C17.0976 6.68342 17.0977 7.31646 16.7072 7.70696L6.7072 17.707C6.3167 18.0975 5.68367 18.0974 5.29314 17.707C4.90261 17.3164 4.90261 16.6834 5.29314 16.2929L15.2931 6.29289ZM17.2931 11.2939C17.6837 10.9033 18.3167 10.9033 18.7072 11.2939C19.0972 11.6844 19.0976 12.3176 18.7072 12.7079L13.7072 17.7079C13.3168 18.0983 12.6837 18.098 12.2931 17.7079C11.9026 17.3174 11.9026 16.6844 12.2931 16.2939L17.2931 11.2939Z" fill="white" />
        </svg>}
        {width === 3 && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M16.7368 13.4471C17.5224 12.8065 18.6814 12.8526 19.4136 13.5848C20.1456 14.317 20.1918 15.4761 19.5513 16.2615L19.4136 16.4129L16.4136 19.4129C15.6326 20.1939 14.3665 20.1937 13.5855 19.4129C12.8044 18.6318 12.8044 17.3658 13.5855 16.5848L16.5855 13.5848L16.7368 13.4471ZM13.7329 4.73321C14.7092 3.7569 16.2918 3.7569 17.2681 4.73321C18.2444 5.70952 18.2444 7.29206 17.2681 8.26837L8.26809 17.2684C7.29178 18.2446 5.70922 18.2446 4.73293 17.2684C3.75664 16.2921 3.75669 14.7095 4.73293 13.7332L13.7329 4.73321Z" fill="white" />
        </svg>}
    </>
    )
}