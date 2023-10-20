import styled from 'styled-components';
import {ReactNode} from 'react';
import {MIN_CELL_SIZE} from 'components/Board';
import {BOARD_SIZE} from 'shared';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  @media (max-width: ${MIN_CELL_SIZE * (BOARD_SIZE + 1) * 2 + 100}px) {
    display: block;
    & > * + * {
      margin-top: 40px;
    }
  }
`;

const TwoBoardGrid = ({children}: {children: ReactNode}) => {
    return (
        <StyledGrid>
            {children}
        </StyledGrid>
    );
};

export default TwoBoardGrid;