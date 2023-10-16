import {Player} from 'core/types/Player';
import {FC, useState} from 'react';
import {Button, Flex} from 'antd';
import {resetGame, useGameInfo} from 'store/gameInfoSlice';
import lang from 'language.json';
import {useAppDispatch} from 'store';
import {GameStatus, setGameStatus} from 'store/gameStatusSlice';
import {GameMode} from 'core/types/GameMode';
import {computerName} from 'components/game/OnePlayerGame';
import RulesModal from 'components/RulesModal';
import {GameShootMode} from 'core/types/GameShootMode';
import styled from 'styled-components';

interface GameStatusPanelProps {
    winner: Player | null;
    onFinishGame: () => void;
}

const StyledFlex = styled(Flex)`
  @media (max-width: 460px) {
    display: block;
    & > * + * {
      margin-top: 5px;
    }
  }
`;

const GameStatusPanel: FC<GameStatusPanelProps> = ({onFinishGame, winner}) => {
    const {finishedEarly, playerNames, currentPlayer, gameMode, gameShootMode} = useGameInfo();
    const gameInProgress = winner === null && !finishedEarly;

    function getStatusHtml() {
        const playerName = currentPlayer === Player.Second && gameMode === GameMode.OnePlayer ? computerName : playerNames[currentPlayer];
        if (gameInProgress) {
            return <>{lang.moving} {playerName}</>;
        }
        if (finishedEarly) {
            const statusText = gameMode === GameMode.OnePlayer ? <>{lang.winner} - {computerName}</> : lang.drawBecauseFinishedEarly;
            return <>{statusText}</>;
        }
        if (winner === null) {
            throw new Error('Winner is null but game has been finished normally.');
        }
        return <>{lang.winner} - {playerNames[winner]}</>;
    }

    const dispatch = useAppDispatch();

    function handleNewGame() {
        dispatch(resetGame());
        dispatch(setGameStatus(GameStatus.SettingFirstPlayer));
    }

    function handleBackToMain() {
        dispatch(resetGame());
        dispatch(setGameStatus(GameStatus.Idle));
    }

    const [rulesModalOpen, setRulesModalOpen] = useState(false);

    function getButtonsHtml() {
        let buttons;
        if (gameInProgress) {
            buttons = [<Button onClick={onFinishGame}>{lang.finishGame}</Button>];
        } else {
            buttons = [
                <Button onClick={handleNewGame}>{lang.newGame}</Button>,
                <Button onClick={handleBackToMain}>{lang.backToMain}</Button>,
            ];
        }
        buttons.push(<Button onClick={() => setRulesModalOpen(true)}>{lang.rules}</Button>);
        return buttons;
    }

    const gameShootModeText = gameShootMode === GameShootMode.OneByOne ? lang.shootMode.oneByOne : lang.shootMode.untilMiss;

    return (
        <>
            <RulesModal open={rulesModalOpen} setOpen={setRulesModalOpen} />
            <StyledFlex style={{marginBottom: 10}} justify="space-between" align="center">
                <div>
                    <h3 style={{fontStyle: 'italic', marginBlock: 3}}>
                        {getStatusHtml()}
                    </h3>
                    <i style={{fontSize: '.8rem'}}>{lang.mode} - {gameShootModeText}</i>
                </div>
                <Flex gap={5}>{getButtonsHtml().map((b, i) =>
                    <li key={i}>{b}</li>
                )}</Flex>
            </StyledFlex>
        </>
    );
};

export default GameStatusPanel;