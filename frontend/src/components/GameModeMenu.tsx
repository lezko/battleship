import {GameMode} from 'core/types/GameMode';
import lang from 'language.json';
import styled from 'styled-components';
import {useAppDispatch} from 'store';
import {GameStatus, setGameStatus} from 'store/gameStatusSlice';
import {setGameInfo} from 'store/gameInfoSlice';
import {Button} from 'antd';

const StyledList = styled.ul`
  display: flex;
  justify-content: space-between;
  @media (max-width: 450px) {
    flex-direction: column;
    align-items: stretch;
    & > * + * {
      margin-top: 10px;
    }
  }
`;

const StyledItem = styled.li`
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
`;

const GameModeMenu = () => {
    const gameModeNames = {
        [GameMode.OnePlayer]: lang.gameMode.onePlayer,
        [GameMode.TwoPlayers]: lang.gameMode.twoPlayers,
        [GameMode.OnlineGame]: lang.gameMode.onlineGame,
    };
    const dispatch = useAppDispatch();

    function handleClick(gameMode: GameMode) {
        dispatch(setGameInfo({gameMode}));
        dispatch(setGameStatus(GameStatus.SettingFirstPlayer));
    }

    return (
        <StyledList>{Object.entries(gameModeNames).map(([mode, name], i) =>
            <StyledItem key={i}>
                <Button style={{flexGrow: 1}} onClick={() => handleClick(+mode)}>{name}</Button>
            </StyledItem>
        )}</StyledList>
    );
};

export default GameModeMenu;