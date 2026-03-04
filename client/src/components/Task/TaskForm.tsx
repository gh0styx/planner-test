import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { LABEL_COLORS } from '../../types';
import type { Task } from '../../types';

interface Props {
  task?: Task | null;
  onSave: (title: string, color: string) => void;
  onCancel: () => void;
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  border: 1px solid ${({ theme }) => theme.colors.accent};
`;

const Input = styled.input`
  width: 100%;
  padding: 5px 6px;
  font-size: 12px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surfaceActive};
  transition: background ${({ theme }) => theme.transition};

  &:focus {
    background: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const ColorBtn = styled.button<{ $color: string; $active: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active }) => ($active ? 'rgba(0,0,0,0.35)' : 'transparent')};
  transition: all ${({ theme }) => theme.transition};
  flex-shrink: 0;

  &:hover {
    transform: scale(1.15);
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const SaveBtn = styled.button`
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.transition};

  &:hover { background: ${({ theme }) => theme.colors.accentHover}; }
  &:active { transform: scale(0.95); }
`;

const CancelBtn = styled.button`
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: color ${({ theme }) => theme.transition};

  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`;

export function TaskForm({ task, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [color, setColor] = useState(task?.color ?? LABEL_COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

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
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title…"
      />
      <Row>
        {LABEL_COLORS.map((c) => (
          <ColorBtn key={c} $color={c} $active={color === c} onClick={() => setColor(c)} />
        ))}
        <Spacer />
        <CancelBtn onClick={onCancel}>Cancel</CancelBtn>
        <SaveBtn onClick={handleSubmit}>Save</SaveBtn>
      </Row>
    </Form>
  );
}
