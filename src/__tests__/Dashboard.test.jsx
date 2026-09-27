import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { getHighRiskProjects } from '../utils/dataLoader';
import { RoleProvider, useRole } from '../context/RoleContext';
import rawProjectsData from '../data/seed_projects_dataset.json';

// Helper: render Dashboard with a given initial role
function renderDashboardWithRole(initialRole = 'District Officer') {
  // We can't set role from outside RoleProvider easily; use a wrapper component
  const Wrapper = () => {
    const { setRole } = useRole();
    React.useEffect(() => { setRole(initialRole); }, []);
    return (
      <MemoryRouter initialEntries={['/dashboard']}>
        <Dashboard />
      </MemoryRouter>
    );
  };
  return render(
    <RoleProvider>
      <Wrapper />
    </RoleProvider>
  );
}

const renderDashboard = () =>
  render(
    <RoleProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Dashboard />
      </MemoryRouter>
    </RoleProvider>
  );

describe('Dashboard.test.jsx — Dashboard Screen Suite', () => {
  it('renders 3 stat cards with metrics', () => {
    renderDashboard();
    expect(screen.getByText(/Total Tracked Projects/i)).toBeInTheDocument();
    expect(screen.getAllByText(/High-Risk Projects/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Avg Data Confidence/i)).toBeInTheDocument();
  });

  it('renders bar chart section header — "by District" for default District Officer role', () => {
    // Default role is District Officer → chart title is "Project Count by District"
    renderDashboard();
    expect(screen.getByText(/Project Count by District/i)).toBeInTheDocument();
  });

  it('renders "Risk Category Distribution" donut chart section header', () => {
    renderDashboard();
    expect(screen.getByText(/Risk Category Distribution/i)).toBeInTheDocument();
  });

  it('renders Priority High-Risk Projects section with top projects list', () => {
    renderDashboard();
    expect(screen.getAllByText(/High-Risk Projects/i).length).toBeGreaterThan(0);
  });

  it('includes navigation link to explore all projects', () => {
    renderDashboard();
    expect(screen.getByText(/Explore Projects/i)).toBeInTheDocument();
  });

  // ── Bug 2 regression guard: bar chart category axis grouping ────────────────

  it('Bug 2 guard: District Officer role — chart shows "Project Count by District"', async () => {
    await act(async () => { renderDashboardWithRole('District Officer'); });
    expect(screen.getByText(/Project Count by District/i)).toBeInTheDocument();
    // State Officer label should NOT appear in the chart title
    expect(screen.queryByText(/Project Count by State/i)).not.toBeInTheDocument();
  });

  it('Bug 2 guard: State Officer role — chart shows "Project Count by State"', async () => {
    await act(async () => { renderDashboardWithRole('State Officer'); });
    expect(screen.getByText(/Project Count by State/i)).toBeInTheDocument();
    expect(screen.queryByText(/Project Count by District/i)).not.toBeInTheDocument();
  });

  it('Bug 2 guard: Central Ministry role — chart shows "Project Count by State"', async () => {
    await act(async () => { renderDashboardWithRole('Central Ministry'); });
    expect(screen.getByText(/Project Count by State/i)).toBeInTheDocument();
    expect(screen.queryByText(/Project Count by District/i)).not.toBeInTheDocument();
  });

  it('Bug 2 guard: District Officer — subtitle mentions district name (Patna)', async () => {
    await act(async () => { renderDashboardWithRole('District Officer'); });
    expect(screen.getByText(/Projects in Patna district/i)).toBeInTheDocument();
  });

  it('Bug 2 guard: State Officer — subtitle does NOT mention district', async () => {
    await act(async () => { renderDashboardWithRole('State Officer'); });
    expect(screen.queryByText(/Projects in Patna district/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Distribution across active state scope/i)).toBeInTheDocument();
  });
});
