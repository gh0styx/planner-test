import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import type { Task } from '../../types';

interface Props {
  task: Task;
  searchQuery: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

const Wrapper = styled.div<{ $isDragging: boolean; $isOverlay: boolean }>`
  touch-action: none;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.35 : 1)};
  ${({ $isOverlay, theme }) =>
    $isOverlay &&
    `
    box-shadow: ${theme.shadow.drag};
    transform: rotate(2deg);
    z-index: 999;
  `}
`;

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  cursor: grab;
  transition: box-shadow ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
  &:active { cursor: grabbing; }
`;

const ColorBar = styled.div<{ $color: string }>`
  height: 3px;
  background: ${({ $color }) => $color};
  width: 100%;
`;

const Body = styled.div`
  padding: 4px 6px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.span`
  flex: 1;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Highlight = styled.mark`
  background: #fef08a;
  color: inherit;
  padding: 0 1px;
  border-radius: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: 1px;
  opacity: 0;
  flex-shrink: 0;
  transition: opacity ${({ theme }) => theme.transition};

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionBtn = styled.button`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceActive};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

function renderTitle(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <Highlight key={i}>{part}</Highlight> : part,
  );
}

export function TaskCard({ task, searchQuery, onEdit, onDelete, isDragOverlay }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: 'task', task },
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Wrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      $isOverlay={!!isDragOverlay}
      {...attributes}
      {...listeners}
    >
      <Card>
        <ColorBar $color={task.color} />
        <Body>
          <Title>{renderTitle(task.title, searchQuery)}</Title>
          <Actions>
            <ActionBtn
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onEdit(task)}
              title="Edit"
            >
              ✎
            </ActionBtn>
            <ActionBtn
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onDelete(task._id)}
              title="Delete"
            >
              ×
            </ActionBtn>
          </Actions>
        </Body>
      </Card>
    </Wrapper>
  );
}
