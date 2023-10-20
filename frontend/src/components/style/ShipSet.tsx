import ShipCount from 'components/ShipCount';
import {Flex} from 'antd';
import {FC} from 'react';
import { ShipParameters } from 'shared';

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