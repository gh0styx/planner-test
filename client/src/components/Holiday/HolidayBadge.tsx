import styled from 'styled-components';

interface Props {
  name: string;
}

const Badge = styled.div`
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.holidayBg};
  color: ${({ theme }) => theme.colors.holiday};
  border: 1px solid ${({ theme }) => theme.colors.holidayBorder};
  font-size: 10px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  letter-spacing: 0.01em;
  flex-shrink: 0;
`;

export function HolidayBadge({ name }: Props) {
  return <Badge title={name}>{name}</Badge>;
}
