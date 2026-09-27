import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RoleProvider, useRole } from '../context/RoleContext';
import rawProjectsData from '../data/seed_projects_dataset.json';

const TestComponent = () => {
  const { role, filterByRole, setRole } = useRole();
  const projects = filterByRole(rawProjectsData.projects);

  return (
    <div>
      <span data-testid="current-role">{role}</span>
      <span data-testid="count">{projects.length}</span>
      <button id="btn-district" onClick={() => setRole('District Officer')}>Set District</button>
      <button id="btn-state" onClick={() => setRole('State Officer')}>Set State</button>
      <button id="btn-central" onClick={() => setRole('Central Ministry')}>Set Central</button>
    </div>
  );
};

describe('src/__tests__/roleFiltering.test.jsx — Role Scoping Suite', () => {
  it('District Officer role filters projects to Patna district', () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );

    const patnaCount = rawProjectsData.projects.filter(p => p.district === 'Patna').length;
    expect(screen.getByTestId('count').textContent).toBe(patnaCount.toString());
  });

  it('State Officer role filters projects to Bihar state', () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );
    const btn = screen.getByText('Set State');
    fireEvent.click(btn);

    const biharCount = rawProjectsData.projects.filter(p => p.state === 'Bihar').length;
    expect(screen.getByTestId('count').textContent).toBe(biharCount.toString());
  });

  it('Central Ministry role returns all 52 projects', () => {
    render(
      <RoleProvider>
        <TestComponent />
      </RoleProvider>
    );
    const btn = screen.getByText('Set Central');
    fireEvent.click(btn);

    expect(screen.getByTestId('count').textContent).toBe('52');
  });
});
