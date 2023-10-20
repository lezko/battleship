import {GameStatus, useGameStatus} from 'store/gameStatusSlice';
import SettingPlayer from 'components/SettingPlayer';
import {GameMode} from 'shared';
import Container from 'components/layout/Container';
import OnePlayerGame from 'components/game/OnePlayerGame';
import TwoPlayersGame from 'components/game/TwoPlayersGame';
import {useGameInfo} from 'store/gameInfoSlice';
import styled from 'styled-components';
import Home from 'components/Home';

const StyledApp = styled.div`
  padding-block: 15px;
`;

const App = () => {
    const {status} = useGameStatus();
    const {gameMode} = useGameInfo();
    function getGameModeDependentHtml(gameMode: GameMode) {
        switch (gameMode) {
            case GameMode.OnePlayer:
                return <OnePlayerGame />;
            case GameMode.TwoPlayers:
                return <TwoPlayersGame />;
            case GameMode.OnlineGame:
                return <>under development :)</>;
        }
    }

    function getGameStatusDependentHtml(gameStatus: GameStatus) {
        switch (gameStatus) {
            case GameStatus.Idle:
                return <Home />;
            case GameStatus.SettingFirstPlayer:
            case GameStatus.SettingSecondPlayer:
                return <SettingPlayer />;
            case GameStatus.Playing:
                return getGameModeDependentHtml(gameMode);
        }
    }

    return (
        <StyledApp>
            <Container>
                {getGameStatusDependentHtml(status)}
            </Container>
        </StyledApp>
    );
};

export default App;