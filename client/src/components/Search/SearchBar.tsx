import { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  position: absolute;
  left: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  pointer-events: none;
  display: flex;
`;

const Input = styled.input`
  width: 220px;
  padding: 8px 12px 8px 32px;
  background: ${({ theme }) => theme.colors.surfaceActive};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  transition: all ${({ theme }) => theme.transition};

  &:focus {
    background: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentLight};
    width: 280px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 640px) {
    width: 160px;
    &:focus { width: 200px; }
  }
`;

export function SearchBar({ value, onChange }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(val), 300);
    },
    [onChange],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!value && inputRef.current) inputRef.current.value = '';
  }, [value]);

  return (
    <Wrapper>
      <Icon>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </Icon>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search tasks…"
        defaultValue={value}
        onChange={handleChange}
      />
    </Wrapper>
  );
}
