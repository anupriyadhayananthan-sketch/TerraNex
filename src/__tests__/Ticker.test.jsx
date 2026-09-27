import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Ticker, { TICKER_MESSAGES } from '../components/Ticker';
import App from '../App';

describe('Ticker.test.jsx — Global Scrolling Announcement Ticker Suite', () => {
  it('1. Ticker component renders configured ticker messages', () => {
    render(<Ticker />);
    expect(screen.getAllByText(new RegExp(TICKER_MESSAGES[0], 'i')).length).toBeGreaterThan(0);
  });

  it('2. Ticker component renders globally in App on Dashboard page', () => {
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);
    expect(screen.getAllByText(new RegExp(TICKER_MESSAGES[0], 'i')).length).toBeGreaterThan(0);
  });

  it('3. Ticker component renders globally in App on Project Detail page', () => {
    window.history.pushState({}, 'Project Detail', '/project/PRJ-001');
    render(<App />);
    expect(screen.getAllByText(new RegExp(TICKER_MESSAGES[0], 'i')).length).toBeGreaterThan(0);
  });
});
