import ShipCount from 'components/ShipCount';
import {Flex} from 'antd';
import {ShipParameters} from 'core/types/Ship';
import {FC} from 'react';

interface ShipSetProps {
    shipParams: ShipParameters;
}

const ShipSet: FC<ShipSetProps> = ({shipParams}) => {
    return (
        <Flex
            justify="center"
            gap={20}
        >
            {Object.entries(shipParams).map(([size, count], i) =>
                <ShipCount
                    key={i}
                    size={+size}
                    count={count}
                />
            )}
        </Flex>
    );
};

export default ShipSet;