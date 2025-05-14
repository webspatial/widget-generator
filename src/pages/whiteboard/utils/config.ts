type Mode = 'dark' | 'light';

interface ThemeConfig {
    background: string;
    cursor: string;
    colors: string[];
}

interface WhiteboardConfigType {
    mode: Mode;
    lineWidths: number[];
    dark: ThemeConfig;
    light: ThemeConfig;
}

const WhiteboardConfig: WhiteboardConfigType = {
    mode: 'dark',
    lineWidths: [
        5,
        10,
        15,
    ],
    dark:{
        background: '#1A1A1A',
        cursor: '#E9E9E9',
        colors: [
            '#E25655',
            '#DAB447',
            '#457ACA',
            '#349B5D',
            '#E9E9E9'
        ]
    },
    light:{
        background: '#E9E9E9',
        cursor: '#1A1A1A',
        colors: [
            '#E25655',
            '#DAB447',
            '#457ACA',
            '#349B5D',
            '#1A1A1A'
        ]
    }
}

export { WhiteboardConfig };