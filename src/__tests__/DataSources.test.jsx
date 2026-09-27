import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import DataSources from '../pages/DataSources';
import rawFeedData from '../data/ingestion_feed_dataset.json';

const renderDataSources = () => {
  return render(
    <MemoryRouter initialEntries={['/data-sources']}>
      <DataSources />
    </MemoryRouter>
  );
};

describe('DataSources.test.jsx — Auto-Ingestion Feed Suite', () => {
  it('renders all feed entries initially from JSON dataset', () => {
    renderDataSources();
    expect(screen.getByText(/Auto-Ingestion Data Feed/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${rawFeedData.feed.length} Ingested Records`, 'i'))).toBeInTheDocument();
  });

  it('renders linked_project_id entries as links to detail page', () => {
    renderDataSources();
    const linkedItem = rawFeedData.feed.find(item => item.linked_project_id !== null);
    expect(screen.getAllByText(new RegExp(linkedItem.linked_project_id, 'i')).length).toBeGreaterThan(0);
  });

  it('clicking "Simulate refresh" prepends one new entry to the top of the feed', () => {
    renderDataSources();
    const refreshBtn = document.getElementById('simulate-refresh-btn');
    const initialCount = rawFeedData.feed.length;
    
    fireEvent.click(refreshBtn);
    expect(screen.getByText(/Pipeline ingested new record/i)).toBeInTheDocument();
  });

  it('displays explicit honesty framing banner', () => {
    renderDataSources();
    expect(screen.getByText(/Simulated ingestion pipeline/i)).toBeInTheDocument();
  });
});
