import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import styled from 'styled-components';
import type { Task, Holiday, ReorderPayload, TaskCreatePayload, TaskUpdatePayload } from '../../types';
import { getMonthData, WEEKDAYS } from '../../utils/dateHelpers';
import { CalendarCell } from './CalendarCell';
import { TaskCard } from '../Task/TaskCard';

interface Props {
  year: number;
  month: number;
  tasks: Task[];
  holidays: Holiday[];
  searchQuery: string;
  onCreateTask: (payload: TaskCreatePayload) => Promise<void>;
  onUpdateTask: (id: string, payload: TaskUpdatePayload) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onReorderTasks: (payload: ReorderPayload) => Promise<void>;
}

const ScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-width: 700px;
  background: ${({ theme }) => theme.colors.border};
  gap: 1px;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ theme }) => theme.colors.surface};
  user-select: none;

  @media (max-width: 768px) {
    padding: 8px 0;
    font-size: 10px;
  }
`;

export function CalendarGrid({
  year, month, tasks, holidays, searchQuery,
  onCreateTask, onUpdateTask, onDeleteTask, onReorderTasks,
}: Props) {
  const days = useMemo(() => getMonthData(year, month), [year, month]);

  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeIdRef.current) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of localTasks) {
      const list = map.get(task.date);
      if (list) list.push(task);
      else map.set(task.date, [task]);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.order - b.order);
    }
    return map;
  }, [localTasks]);

  const activeTask = useMemo(
    () => (activeId ? localTasks.find((t) => t._id === activeId) ?? null : null),
    [activeId, localTasks],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const findContainer = useCallback(
    (id: string): string | null => {
      if (id.startsWith('cell-')) return id.slice(5);
      for (const [date, dateTasks] of tasksByDate) {
        if (dateTasks.some((t) => t._id === id)) return date;
      }
      return null;
    },
    [tasksByDate],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveId(id);
    activeIdRef.current = id;
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeItemId = String(active.id);
      const overId = String(over.id);

      const activeContainer = findContainer(activeItemId);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer || activeContainer === overContainer) return;

      setLocalTasks((prev) => {
        const activeIdx = prev.findIndex((t) => t._id === activeItemId);
        if (activeIdx === -1) return prev;

        const next = [...prev];
        next[activeIdx] = { ...next[activeIdx]!, date: overContainer };

        const destTasks = next
          .filter((t) => t.date === overContainer && t._id !== activeItemId)
          .sort((a, b) => a.order - b.order);

        let insertIdx = destTasks.length;
        if (!overId.startsWith('cell-')) {
          const overPos = destTasks.findIndex((t) => t._id === overId);
          if (overPos !== -1) insertIdx = overPos;
        }

        destTasks.splice(insertIdx, 0, next[activeIdx]!);
        destTasks.forEach((t, i) => { t.order = i; });

        const sourceRemaining = next
          .filter((t) => t.date === activeContainer)
          .sort((a, b) => a.order - b.order);
        sourceRemaining.forEach((t, i) => { t.order = i; });

        return next;
      });
    },
    [findContainer],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      activeIdRef.current = null;

      const { active, over } = event;
      if (!over) {
        setLocalTasks(tasks);
        return;
      }

      const activeItemId = String(active.id);
      const overId = String(over.id);

      const activeContainer = findContainer(activeItemId);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer) {
        setLocalTasks(tasks);
        return;
      }

      if (activeContainer === overContainer && !overId.startsWith('cell-')) {
        setLocalTasks((prev) => {
          const containerTasks = prev
            .filter((t) => t.date === activeContainer)
            .sort((a, b) => a.order - b.order);

          const oldIdx = containerTasks.findIndex((t) => t._id === activeItemId);
          const newIdx = containerTasks.findIndex((t) => t._id === overId);

          if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev;

          const reordered = arrayMove(containerTasks, oldIdx, newIdx);
          reordered.forEach((t, i) => { t.order = i; });

          const otherTasks = prev.filter((t) => t.date !== activeContainer);
          return [...otherTasks, ...reordered];
        });
      }

      setTimeout(() => {
        setLocalTasks((current) => {
          const affectedDates = new Set<string>();
          for (const t of current) {
            const orig = tasks.find((ot) => ot._id === t._id);
            if (orig && (orig.date !== t.date || orig.order !== t.order)) {
              affectedDates.add(t.date);
              affectedDates.add(orig.date);
            }
          }

          if (affectedDates.size === 0) return current;

          const payload: ReorderPayload = {
            tasks: current
              .filter((t) => affectedDates.has(t.date))
              .map((t) => ({ _id: t._id, date: t.date, order: t.order })),
          };

          onReorderTasks(payload);
          return current;
        });
      }, 0);
    },
    [findContainer, tasks, onReorderTasks],
  );

  const handleCreateTask = useCallback(
    (title: string, date: string, color: string) => {
      onCreateTask({ title, date, color });
    },
    [onCreateTask],
  );

  const handleUpdateTask = useCallback(
    (id: string, title: string, color: string) => {
      onUpdateTask(id, { title, color });
    },
    [onUpdateTask],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ScrollWrapper>
        <Grid>
          {WEEKDAYS.map((wd) => (
            <WeekdayHeader key={wd}>{wd}</WeekdayHeader>
          ))}
          {days.map((day) => (
            <CalendarCell
              key={day.date}
              day={day}
              tasks={tasksByDate.get(day.date) ?? []}
              holidays={holidays}
              searchQuery={searchQuery}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </Grid>
      </ScrollWrapper>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            searchQuery=""
            onEdit={() => {}}
            onDelete={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
