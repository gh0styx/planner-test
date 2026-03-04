import styled from 'styled-components';
import { getMonthName } from '../../utils/dateHelpers';

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NavBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceActive};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  &:active { transform: scale(0.92); }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 700;
  min-width: 160px;
  text-align: center;
  letter-spacing: -0.01em;
  user-select: none;

  @media (max-width: 480px) {
    font-size: 16px;
    min-width: 130px;
  }
`;

const TodayBtn = styled.button`
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentSoft};
  transition: all ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.accentLight};
  }
  &:active { transform: scale(0.96); }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 12px;
  }
`;

export function CalendarHeader({ year, month, onPrev, onNext, onToday }: Props) {
  return (
    <Container>
      <NavBtn onClick={onPrev} aria-label="Previous month">‹</NavBtn>
      <Title>{getMonthName(month)} {year}</Title>
      <NavBtn onClick={onNext} aria-label="Next month">›</NavBtn>
      <TodayBtn onClick={onToday}>Today</TodayBtn>
    </Container>
  );
}
