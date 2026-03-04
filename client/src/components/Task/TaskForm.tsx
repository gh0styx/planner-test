import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { LABEL_COLORS } from '../../types';
import type { Task } from '../../types';

interface Props {
  task?: Task | null;
  onSave: (title: string, color: string) => void;
  onCancel: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ColorBar = styled.div<{ $color: string }>`
  height: 4px;
  background: ${({ $color }) => $color};
  width: 100%;
  flex-shrink: 0;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surfaceActive};
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transition};
  box-sizing: border-box;

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accentSoft};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ColorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColorLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ColorBtn = styled.button<{ $color: string; $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active }) => ($active ? 'rgba(0,0,0,0.4)' : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 0 0 2px rgba(255,255,255,0.9)' : 'none')};
  transition: all ${({ theme }) => theme.transition};
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`;

const SaveBtn = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
  &:active {
    transform: scale(0.98);
  }
`;

const CancelBtn = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceActive};
  }
`;

export function TaskForm({ task, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [color, setColor] = useState(task?.color ?? LABEL_COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(task?.title ?? '');
    setColor(task?.color ?? LABEL_COLORS[0]);
  }, [task]);

  useEffect(() => {
    inputRef.current?.focus();
    if (task) inputRef.current?.select();
  }, [task]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, color);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <Form>
      <ColorBar $color={color} />
      <Body>
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={task ? 'Edit task…' : 'What needs to be done?'}
        />
        <ColorSection>
          <ColorLabel>Color</ColorLabel>
          <ColorRow>
            {LABEL_COLORS.map((c) => (
              <ColorBtn key={c} $color={c} $active={color === c} onClick={() => setColor(c)} />
            ))}
          </ColorRow>
        </ColorSection>
        <Actions>
          <CancelBtn onClick={onCancel}>Cancel</CancelBtn>
          <SaveBtn onClick={handleSubmit}>{task ? 'Save' : 'Add task'}</SaveBtn>
        </Actions>
      </Body>
    </Form>
  );
}
