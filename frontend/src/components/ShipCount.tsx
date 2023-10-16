import React, {FC} from 'react';
import styled, {useTheme} from 'styled-components';
import {Flex} from 'antd';
import {Cell} from 'components/Board';
import {AppTheme} from 'AppTheme';

const CELL_SIZE = 20;

interface ShipCountProps {
    size: number;
    count: number;
}

const Ship = styled.div`
  display: flex;
  flex-wrap: nowrap;
  border: 1px solid ${props => props.theme.color.boardBorder};
`;

const ShipCount: FC<ShipCountProps> = ({size, count}) => {
    if (count === 0) {
        return null;
    }
    const theme = useTheme() as AppTheme;

    return (
        <Flex gap={5} vertical justify="center" align="center">
            <Ship
            >{Array(size).fill(null).map((_, i) =>
                <Cell
                    $hasShip={true}
                    $clickable={false}
                    $size={CELL_SIZE}
                    $borderColor={theme.color.boardBorder}
                    key={i}
                />
            )}</Ship>
            <span style={{fontSize: '.8rem'}}>{count}</span>
        </Flex>
    );
};

export default ShipCount;