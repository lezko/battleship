export interface AppTheme {
    color: {
        bg: string;
        bgElevated: string;
        text: string;
        textDisabled: string;
        hover: string;
        ship: string;
        hitCross: string;
        markedCell: string;
        sunkCross: string;
        boardBorder: string;
        currentPlayerBoardBorder: string;
        defaultDot: string;
    }
}

export const theme: AppTheme = {
    color: {
        bg: '#423737',
        bgElevated: '#574949',
        text: '#989797',
        textDisabled: '#5e5e5e',
        hover: '#dadada',
        ship: '#292929',
        hitCross: '#d2d24e',
        markedCell: '#6c5656',
        boardBorder: 'gray',
        currentPlayerBoardBorder: '#d2d24e',
        sunkCross: '#d55b5b',
        defaultDot: '#657a45'
    }
}

