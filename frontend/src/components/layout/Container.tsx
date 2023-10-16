import styled from 'styled-components';
import {FC, ReactNode} from 'react';

const StyledContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding-inline: 10px;
`;

interface ContainerProps {
    children: ReactNode;
}

const Container: FC<ContainerProps> = ({children}) => {
    return (
        <StyledContainer>
            {children}
        </StyledContainer>
    );
};

export default Container;