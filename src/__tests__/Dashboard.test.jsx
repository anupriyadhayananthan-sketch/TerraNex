import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { getHighRiskProjects } from '../utils/dataLoader';
import { RoleProvider } from '../context/RoleContext';

const renderDashboard = () => {
  return render(
    <RoleProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Dashboard />
      </MemoryRouter>
    </RoleProvider>
  );
};

describe('Dashboard.test.jsx — Dashboard Screen Suite', () => {
  it('renders 3 stat cards with metrics', () => {
    renderDashboard();
    expect(screen.getByText(/Total Tracked Projects/i)).toBeInTheDocument();
    expect(screen.getAllByText(/High-Risk Projects/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Avg Data Confidence/i)).toBeInTheDocument();
  });

  it('renders "Project Count by State" bar chart section header', () => {
    renderDashboard();
    expect(screen.getByText(/Project Count by State/i)).toBeInTheDocument();
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
});
