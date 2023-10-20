import {Button, Modal} from 'antd';
import {FC, useState} from 'react';
import {getHistory, HistoryItem, saveHistory} from 'types/History';
import {GameMode, GameShootMode, Player} from 'shared';
import {computerName} from 'components/game/OnePlayerGame';
import lang from 'language.json';
import styled from 'styled-components';

const HistoryItemComponent: FC<HistoryItem> = ({gameMode, gameShootMode, playerNames, winner}) => {
    const secondPlayerName = gameMode === GameMode.OnePlayer ? computerName : playerNames[Player.Second];
    const shootModeText = gameShootMode === GameShootMode.OneByOne ? lang.shootMode.oneByOne : lang.shootMode.untilMiss;
    let winnerText;
    if (winner !== null) {
        const winnerName = winner === Player.First ? playerNames[Player.First] : secondPlayerName;
        winnerText = <>{lang.winner} - {winnerName}</>;
    } else if (gameMode === GameMode.OnePlayer) {
        winnerText = <>{lang.winner} - {computerName}</>;
    } else {
        winnerText = <>{lang.drawBecauseFinishedEarly}</>;
    }
    return (
        <div>
            <h4>{playerNames[Player.First]} vs. {secondPlayerName}</h4>
            <i style={{fontSize: '.8rem'}}>{lang.mode} - {shootModeText}</i>
            <p>{winnerText}</p>
        </div>
    );
};

const StyledList = styled.ul`
  padding-right: 10px;
  & > * + * {
    border-top: 1px solid ${props => props.theme.color.text};
  }
`;

interface HistoryModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}
const HistoryModal: FC<HistoryModalProps> = ({open, setOpen}) => {

    const [history, setHistory] = useState(getHistory);

    function handleClear() {
        saveHistory([]);
        setHistory([]);
    }

    const footerButtons = [<Button key={0} onClick={() => setOpen(false)}>{lang.ok}</Button>];
    if (history.length > 0) {
        footerButtons.unshift(<Button key={1} onClick={handleClear}>{lang.clear}</Button>)
    }

    return (
        <Modal
            open={open}
            closable
            onCancel={() => setOpen(false)}
            footer={footerButtons}
            title={lang.history}
        >
            <div style={{maxHeight: 400, overflowY: 'auto'}}>
                <div>
                    <StyledList>{history.map((item, i) =>
                        <li style={{paddingBlock: 5}} key={i}><HistoryItemComponent {...item} /></li>
                    )}</StyledList>
                    {history.length === 0 && <div>{lang.noHistoryYet}</div>}
                </div>
            </div>
        </Modal>
    );
};

export default HistoryModal;