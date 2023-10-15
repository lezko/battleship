import {BOARD_SIZE, IBoard} from 'core/types/IBoard';
import {FC} from 'react';
import styled from 'styled-components';
import {IPoint, IShip} from 'core/types/IShip';
import {CellState} from 'core/types/CellState';

interface BoardProps {
    board: IBoard;
    ships: IShip[] | null;
    makeMove?: (p: IPoint) => void;
    canMakeMove?: boolean;
}

const StyledBoard = styled.ul`
  max-width: 500px;
  border: 2px solid black;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-auto-rows: 1fr;
`;

const StyledCell = styled.li<{ $hasShip: boolean; $clickable: boolean; }>`
  cursor: pointer;
  pointer-events: ${props => props.$clickable ? 'all' : 'none'};
  min-width: 30px;
  position: relative;
  aspect-ratio: 1;
  border: 1px solid gray;
  display: grid;
  place-content: center;
  background-color: ${props => props.$hasShip ? 'black' : 'unset'};
`;

const Cross = styled.div<{$color: string}>`
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

const Dot = styled.div`
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
    background-color: green;
  }
`;

// todo memoise
const Board: FC<BoardProps> = ({board, ships, makeMove, canMakeMove = false}) => {
    const shipField = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
    const sunkField = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
    if (ships) {
        for (const ship of ships) {
            for (let i = ship.position.start.row; i <= ship.position.end.row; i++) {
                for (let j = ship.position.start.col; j <= ship.position.end.col; j++) {
                    shipField[i][j] = true;
                    if (ship.decksHit === ship.size) {
                        sunkField[i][j] = true;
                    }
                }
            }
        }
    }

    function handleClick(row: number, col: number) {
        if (typeof makeMove === 'function') {
            makeMove({row, col});
        }
    }

    function getCellSymbol(state: CellState) {
        switch (state) {
            case CellState.Hit:
                return <Cross $color="pink" />;
            case CellState.Miss:
                return <Dot />;
            default:
                return null;
        }
    }

    return (
        <StyledBoard>{board.map((row, i) => row.map((cell, j) =>
            <StyledCell
                key={String(i) + j}
                $hasShip={shipField[i][j]}
                $clickable={canMakeMove && cell === CellState.Default}
                onClick={() => handleClick(i, j)}
            >
                {sunkField[i][j] ? <Cross $color="red" /> : getCellSymbol(board[i][j])}
            </StyledCell>
        ))}</StyledBoard>
    );
};

export default Board;