import {FC} from 'react';
import styled, {useTheme} from 'styled-components';
import {AppTheme} from 'AppTheme';
import {useGameInfo} from 'store/gameInfoSlice';
import {BOARD_SIZE, CellState, Player, Point} from 'shared';
import lang from 'language.json';
import {GameStatus, useGameStatus} from 'store/gameStatusSlice';

export const MIN_CELL_SIZE = 25;

interface BoardProps {
    player: Player;
    onClick?: (point: Point) => void;
    shipsVisible: boolean;
    canMakeMove: boolean;
    markedCell?: Point;
}

const StyledBoard = styled.ul<{ $borderColor: string; }>`
  margin: 0 auto;
  border: 1px solid ${props => props.$borderColor};
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE + 1}, 1fr);
  grid-auto-rows: 1fr;
`;

export const Cell = styled.li<{
    $hasShip: boolean;
    $clickable: boolean;
    $borderColor: string;
    $size?: number;
    $color?: string;
    $minSize?: number;
    $marked?: boolean;
}>`
  cursor: pointer;
  pointer-events: ${props => props.$clickable ? 'all' : 'none'};
  width: ${props => props.$size ? props.$size + 'px' : 'unset'};
  min-width: ${props => props.$minSize ? props.$minSize + 'px' : 'unset'};
  position: relative;
  aspect-ratio: 1;
  border: 1px solid ${props => props.$borderColor};
  display: grid;
  place-content: center;
  color: ${props => props.$color || 'inherit'};
  background-color: ${props => props.$hasShip ? props.theme.color.ship : props.$marked ? props.theme.color.markedCell : 'unset'};
`;

export const Cross = styled.div<{ $color: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(45deg);

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 100%;
    background-color: ${props => props.$color};
  }

  &:after {
    position: absolute;
    content: '';
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 5px;
    background-color: ${props => props.$color};
  }
`;

export const Dot = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.theme.color.defaultDot};
  }
`;

// todo memoise
const Board: FC<BoardProps> = ({player, onClick, shipsVisible, canMakeMove, markedCell}) => {
    const {ships, boards} = useGameInfo();
    const {status} = useGameStatus();
    const board = boards[player];

    const shipField = Array.from(Array(BOARD_SIZE + 1), () => Array(BOARD_SIZE + 1).fill(false));
    if (shipsVisible) {
        for (const ship of ships[player]) {
            for (let i = ship.position.start.row; i <= ship.position.end.row; i++) {
                for (let j = ship.position.start.col; j <= ship.position.end.col; j++) {
                    shipField[i + 1][j + 1] = true;
                }
            }
        }
    }

    function handleClick(row: number, col: number) {
        if (typeof onClick === 'function') {
            onClick({row, col});
        }
    }

    const theme = useTheme() as AppTheme;

    function getCellSymbol(state: CellState) {
        switch (state) {
            case CellState.Sunk:
                return <Cross $color={theme.color.sunkCross} />;
            case CellState.Hit:
                return <Cross $color={theme.color.hitCross} />;
            case CellState.Miss:
                return <Dot />;
            default:
                return null;
        }
    }

    const settingPlayer = status === GameStatus.SettingFirstPlayer || status === GameStatus.SettingSecondPlayer;
    return (
        <StyledBoard
            $borderColor={(canMakeMove && !settingPlayer) ? theme.color.currentPlayerBoardBorder : theme.color.boardBorder}
        >
            {shipField.map((row, i) => row.map((_, j) => {
                    let cell: CellState | null = null;
                    let symbol;
                    if (i > 0 && j > 0) {
                        cell = board[i - 1][j - 1];
                        symbol = getCellSymbol(cell);
                    } else if (i > 0 || j > 0) {
                        if (i === 0) {
                            symbol = (lang.letters[j - 1]).toUpperCase();
                        } else {
                            symbol = i;
                        }
                    }
                    const marked = markedCell && markedCell.row === i - 1 && markedCell.col === j - 1;
                    return (
                        <Cell
                            key={String(i) + j}
                            $minSize={MIN_CELL_SIZE}
                            $borderColor={theme.color.boardBorder}
                            $hasShip={shipField[i][j] || cell === CellState.Sunk}
                            $clickable={canMakeMove && cell === CellState.Default}
                            $marked={marked}
                            onClick={() => handleClick(i - 1, j - 1)}
                            $color={cell === null ? theme.color.hover : undefined}
                        >
                            {symbol}
                        </Cell>
                    );
                }
            ))}
        </StyledBoard>
    );
};

export default Board;