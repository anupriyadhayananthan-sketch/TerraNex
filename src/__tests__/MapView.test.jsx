import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import MapView from '../pages/MapView';
import rawData from '../data/seed_projects_dataset.json';
import { RoleProvider } from '../context/RoleContext';

const renderMapView = () => {
  return render(
    <RoleProvider>
      <MemoryRouter initialEntries={['/map']}>
        <MapView />
      </MemoryRouter>
    </RoleProvider>
  );
};

describe('MapView.test.jsx — GIS Map View Suite', () => {
  it('renders GIS Map View header title', () => {
    renderMapView();
    expect(screen.getByText(/GIS Map View — National Risk Distribution/i)).toBeInTheDocument();
  });

  it('renders map filter buttons for All Pins, High Risk, Medium Risk, Low Risk', () => {
    renderMapView();
    expect(document.getElementById('map-filter-all')).toBeInTheDocument();
    expect(document.getElementById('map-filter-high')).toBeInTheDocument();
    expect(document.getElementById('map-filter-medium')).toBeInTheDocument();
    expect(document.getElementById('map-filter-low')).toBeInTheDocument();
  });

  it('filtering map by High Risk updates active button state', () => {
    renderMapView();
    const highBtn = document.getElementById('map-filter-high');
    fireEvent.click(highBtn);
    
    expect(highBtn.className).toContain('bg-red-600');
  });

  it('displays project markers count in legend banner', () => {
    renderMapView();
    expect(screen.getByText(/project markers/i)).toBeInTheDocument();
  });

  it('renders map legend with correct color indicators', () => {
    renderMapView();
    expect(screen.getByText(/High Risk \(≥ 65%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Risk \(35-64%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Low Risk \(< 35%\)/i)).toBeInTheDocument();
  });

  it('renders leaflet container without crashing', () => {
    const { container } = renderMapView();
    expect(container.querySelector('.leaflet-container')).toBeInTheDocument();
  });
});
