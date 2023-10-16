import ShipCount from 'components/ShipCount';
import {Flex} from 'antd';
import {getAliveShipsParams, Ship} from 'core/types/Ship';
import {FC} from 'react';

interface ShipSetProps {
    ships: Ship[];
}

const ShipSet: FC<ShipSetProps> = ({ships}) => {
    const shipParams = getAliveShipsParams(ships);
    return (
        <Flex
            justify="center"
            gap={20}
        >
            {Object.entries(shipParams).map(([size, count], i) =>
                <ShipCount key={i} size={+size} count={count} />
            )}
        </Flex>
    );
};

export default ShipSet;