import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Global mocks for browser APIs in jsdom
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = window.URL.createObjectURL || (() => '');
  window.URL.revokeObjectURL = window.URL.revokeObjectURL || (() => {});
  
  window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

global.ResizeObserver = global.ResizeObserver || class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Leaflet & react-leaflet for headless jsdom testing
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, className }) => (
    <div data-testid="map-container" className={`leaflet-container ${className || ''}`}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: () => ({}),
  },
  divIcon: () => ({}),
}));

// Mock Recharts ResponsiveContainer for headless jsdom testing
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container" style={{ width: 800, height: 400 }}>
        {children}
      </div>
    ),
  };
});
