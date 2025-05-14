

export type ColorProps = {
    color: string
    isSelected: boolean
}

export type LineWidthProps = {
    width: number
    isSelected: boolean
}

export type ColorSelectProps = {
    show: boolean
    colors: ColorProps[]
    widths: LineWidthProps[]
}