import GameModeMenu from 'components/GameModeMenu';
import styled from 'styled-components';
import {Button, Flex, Modal, Select} from 'antd';
import {GameShootMode} from 'core/types/GameShootMode';
import lang from 'language.json';
import {useAppDispatch} from 'store';
import {setGameInfo, useGameInfo} from 'store/gameInfoSlice';
import {useState} from 'react';
import HistoryModal from 'components/HistoryModal';
import RulesModal from 'components/RulesModal';

const ThinDiv = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const Home = () => {
    const dispatch = useAppDispatch();
    const {gameShootMode} = useGameInfo();
    const [{info}, contextHover] = Modal.useModal();

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [rulesModalOpen, setRulesModalOpen] = useState(false);

    return (
        <div>
            <HistoryModal open={historyModalOpen} setOpen={setHistoryModalOpen} />
            <RulesModal open={rulesModalOpen} setOpen={setRulesModalOpen} />

            <h1 style={{fontSize: '1.6rem', textAlign: 'center', marginBlock: 20}}>{lang.home.welcome}</h1>

            <Flex justify="center" gap={10}>
                <Button onClick={() => setHistoryModalOpen(true)}>{lang.history}</Button>
                <Button onClick={() => setRulesModalOpen(true)}>{lang.rules}</Button>
            </Flex>

            <h2 style={{textAlign: 'center', marginTop: 25, marginBottom: 10, fontSize: '1.4rem'}}>{lang.play}</h2>

            <ThinDiv>
                <Select
                    style={{width: '100%', marginBottom: 10}}
                    defaultValue={gameShootMode}
                    options={[
                        {value: GameShootMode.OneByOne, label: lang.shootMode.oneByOne},
                        {value: GameShootMode.UntilMiss, label: lang.shootMode.untilMiss},
                    ]}
                    onChange={mode => dispatch(setGameInfo({gameShootMode: mode}))}
                />
                <GameModeMenu />
            </ThinDiv>
        </div>
    );
};

export default Home;