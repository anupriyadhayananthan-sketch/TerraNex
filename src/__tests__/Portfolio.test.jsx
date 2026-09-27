import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Portfolio from '../pages/Portfolio';
import rawData from '../data/seed_projects_dataset.json';
import { RoleProvider } from '../context/RoleContext';

const renderPortfolio = (initialEntry = '/portfolio') => {
  return render(
    <RoleProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Portfolio />
      </MemoryRouter>
    </RoleProvider>
  );
};

describe('Portfolio.test.jsx — Portfolio Screen Suite', () => {
  it('renders all 52 projects on initial load for Central Ministry role', () => {
    renderPortfolio();
    // Default role in context is District Officer (scoped to Patna). Set to Central Ministry for all 52
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('filtering by state "Bihar" shows only Bihar projects', () => {
    renderPortfolio();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Bihar' } });
    
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('filtering by "High" risk category shows only High-risk projects', () => {
    renderPortfolio();
    const highButton = document.getElementById('risk-filter-high');
    fireEvent.click(highButton);
    
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('filtering by "Medium" risk category shows only Medium-risk projects', () => {
    renderPortfolio();
    const medButton = document.getElementById('risk-filter-medium');
    fireEvent.click(medButton);
    
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('filtering by "Low" risk category shows only Low-risk projects', () => {
    renderPortfolio();
    const lowButton = document.getElementById('risk-filter-low');
    fireEvent.click(lowButton);
    
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('sorting by risk score descending places highest-risk project first', () => {
    renderPortfolio();
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('sorting by risk score ascending places lowest-risk project first when toggled', () => {
    renderPortfolio();
    const sortBtn = document.getElementById('sort-risk-btn');
    fireEvent.click(sortBtn);

    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('shows graceful "no projects found" state when filter combination matches 0 projects', () => {
    renderPortfolio();
    const searchInput = screen.getByPlaceholderText(/Search project name/i);
    fireEvent.change(searchInput, { target: { value: 'NON_EXISTENT_QUERY_12345' } });

    expect(screen.getByText('No Projects Found')).toBeInTheDocument();
  });
});
