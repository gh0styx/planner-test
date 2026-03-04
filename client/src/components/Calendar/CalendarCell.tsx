import { useState, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styled from 'styled-components';
import type { CalendarDay, Task, Holiday } from '../../types';
import { TaskCard } from '../Task/TaskCard';
import { TaskForm } from '../Task/TaskForm';
import { HolidayBadge } from '../Holiday/HolidayBadge';

interface Props {
  day: CalendarDay;
  tasks: Task[];
  holidays: Holiday[];
  searchQuery: string;
  onCreateTask: (title: string, date: string, color: string) => void;
  onUpdateTask: (id: string, title: string, color: string) => void;
  onDeleteTask: (id: string) => void;
}

const Cell = styled.div<{ $current: boolean; $today: boolean; $over: boolean }>`
  min-height: 100px;
  max-height: 180px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0;
  display: flex;
  flex-direction: column;
  background: ${({ $today, $over, theme }) =>
    $over
      ? theme.colors.dragOverlay
      : $today
        ? theme.colors.accentSoft
        : theme.colors.surface};
  opacity: ${({ $current }) => ($current ? 1 : 0.45)};
  transition: background ${({ theme }) => theme.transition}, opacity ${({ theme }) => theme.transition};
  overflow: hidden;
  position: relative;

  &:hover {
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: 80px;
    max-height: 140px;
  }
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px 2px;
  flex-shrink: 0;
`;

const DayNum = styled.span<{ $today: boolean }>`
  font-size: 12px;
  font-weight: ${({ $today }) => ($today ? 700 : 500)};
  width: ${({ $today }) => ($today ? '22px' : 'auto')};
  height: ${({ $today }) => ($today ? '22px' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ $today, theme }) =>
    $today ? theme.colors.white : theme.colors.textSecondary};
  background: ${({ $today, theme }) =>
    $today ? theme.colors.accent : 'transparent'};

  @media (max-width: 768px) {
    font-size: 11px;
    width: ${({ $today }) => ($today ? '20px' : 'auto')};
    height: ${({ $today }) => ($today ? '20px' : 'auto')};
  }
`;

const AddBtn = styled.button`
  font-size: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0;
  transition: all ${({ theme }) => theme.transition};

  ${Cell}:hover & { opacity: 1; }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceActive};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 4px 4px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export function CalendarCell({
  day, tasks, holidays, searchQuery,
  onCreateTask, onUpdateTask, onDeleteTask,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${day.date}`,
    data: { type: 'cell', date: day.date },
  });

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.order - b.order),
    [tasks],
  );

  const taskIds = useMemo(() => sortedTasks.map((t) => t._id), [sortedTasks]);

  const dayHolidays = useMemo(() => {
    const seen = new Set<string>();
    return holidays.filter((h) => {
      if (h.date !== day.date || seen.has(h.name)) return false;
      seen.add(h.name);
      return true;
    });
  }, [holidays, day.date]);

  const handleCreate = (title: string, color: string) => {
    onCreateTask(title, day.date, color);
    setIsAdding(false);
  };

  const handleUpdate = (title: string, color: string) => {
    if (editingTask) {
      onUpdateTask(editingTask._id, title, color);
      setEditingTask(null);
    }
  };

  return (
    <Cell
      ref={setNodeRef}
      $current={day.isCurrentMonth}
      $today={day.isToday}
      $over={isOver}
    >
      <DayHeader>
        <DayNum $today={day.isToday}>{day.day}</DayNum>
        <AddBtn onClick={() => setIsAdding(true)} title="Add task">+</AddBtn>
      </DayHeader>

      <Content>
        {dayHolidays.map((h) => (
          <HolidayBadge key={h.name} name={h.name} />
        ))}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) =>
            editingTask?._id === task._id ? (
              <TaskForm
                key={task._id}
                task={task}
                onSave={handleUpdate}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <TaskCard
                key={task._id}
                task={task}
                searchQuery={searchQuery}
                onEdit={setEditingTask}
                onDelete={onDeleteTask}
              />
            ),
          )}
        </SortableContext>

        {isAdding && (
          <TaskForm onSave={handleCreate} onCancel={() => setIsAdding(false)} />
        )}
      </Content>
    </Cell>
  );
}
