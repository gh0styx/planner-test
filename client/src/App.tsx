import { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { SearchBar } from './components/Search/SearchBar';
import { useTasks } from './hooks/useTasks';
import { useHolidays } from './hooks/useHolidays';

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    padding: 10px 12px;
  }
`;

const Main = styled.main`
  flex: 1;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 20px 24px;

  @media (max-width: 640px) {
    padding: 8px 4px 16px;
  }
`;

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [searchQuery, setSearchQuery] = useState('');

  const { tasks, createTask, updateTask, deleteTask, reorderTasks } = useTasks(year, month);
  const { holidays } = useHolidays(year, month);

  const goToPrevMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 0) { setYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 11) { setYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }, []);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  return (
    <Shell>
      <Header>
        <HeaderInner>
          <CalendarHeader
            year={year}
            month={month}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
            onToday={goToToday}
          />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </HeaderInner>
      </Header>
      <Main>
        <CalendarGrid
          year={year}
          month={month}
          tasks={filteredTasks}
          holidays={holidays}
          searchQuery={searchQuery}
          onCreateTask={createTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onReorderTasks={reorderTasks}
        />
      </Main>
    </Shell>
  );
}
