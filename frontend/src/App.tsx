import {Fragment} from 'react';
import GlobalStyle from 'GlobalStyle';
import TwoPlayersGame from 'components/game/TwoPlayersGame';
import OnePlayerGame from 'components/game/OnePlayerGame';

const App = () => {
    return (
        <Fragment>
            <GlobalStyle />
            {/*<OnePlayerGame />*/}
            <TwoPlayersGame />
        </Fragment>
    );
};

export default App;