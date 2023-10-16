import styled, {useTheme} from 'styled-components';
import {AppTheme} from 'AppTheme';
import {Button, Flex, Modal} from 'antd';
import {Cross, Dot, Cell} from 'components/Board';
import {FC} from 'react';
import lang from 'language.json';

const StyledDiv = styled.div`
  padding-right: 20px;

  & > * + * {
    margin-top: 10px;
  }

  p {
    font-size: .9rem;
  }

  h3 {
    font-size: 1.4rem;
  }

  h4 {
    font-size: 1.2rem;
  }
`;

const Rules = () => {
    const theme = useTheme() as AppTheme;
    return (
        <StyledDiv>
            <p>
                Игра рассчитана на двух игроков. У каждого игрока есть поле 10 на 10 клеток, на котором нужно разместить
                10 кораблей - 4 однопалубных, 3 двухпалубных, 2 трёхпалубных и 1 четырехпалубный (одна палуба - одна
                клетка на игровом поле). Корабли имеют строго прямоугольную форму и располагаются на поле вертикально
                или горизонтально. Расстояние между кораблями должно быть не менее одной клетки, в том числе по
                диагонали. Игроку не известна расстановка кораблей соперника.
            </p>
            <p>
                Игроки ходят по очереди. Первый атакующий определяется случайным образом. Атакующий выбирает клетку на
                поле соперника. Если в клетке отсутствует корабль или его часть, она помечается как промах. В случае
                попадания в корабль соперника, клетка отмечается как попадание. Если тип игры - <b>Стрельба строго по
                очереди</b>, ход переходит к другому игроку, в противном случае, игрок продолжает атаку до первого
                промаха. Если корабль обстрелян полностью, он считается потопленным, и все клетки, прилегающие к
                кораблю, в
                том числе по диагонали отмечаются как промах.
            </p>
            <h4>Обозначения:</h4>
            <ul>
                <Flex align="center" gap={5}>
                    <Cell $size={30} $clickable={false} $hasShip={false} $borderColor={theme.color.boardBorder}>
                        <Dot />
                    </Cell> - <b>Промах</b>
                </Flex>
                <Flex align="center" gap={5}>
                    <Cell $size={30} $clickable={false} $hasShip={false} $borderColor={theme.color.boardBorder}>
                        <Cross $color={theme.color.hitCross} />
                    </Cell> - <b>Попадание</b>
                </Flex>
                <Flex align="center" gap={5}>
                    <Cell $size={30} $clickable={false} $hasShip={true} $borderColor={theme.color.boardBorder}>
                        <Cross $color={theme.color.sunkCross} />
                    </Cell> - <b>Потоплен</b>
                </Flex>
            </ul>
        </StyledDiv>
    );
};

interface RulesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const RulesModal: FC<RulesModalProps> = ({open, setOpen}) => {
    return (
        <Modal
            open={open}
            closable
            onCancel={() => setOpen(false)}
            title={<h2>{lang.battleship}</h2>}
            footer={<><Button style={{marginTop: 10}} onClick={() => setOpen(false)}>{lang.ok}</Button></>}
        >
            <div style={{maxHeight: 400, overflowY: 'auto', width: '100%'}}><Rules /></div>
        </Modal>
    );
};

export default RulesModal;