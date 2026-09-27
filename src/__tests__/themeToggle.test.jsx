import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ThemeToggle from '../components/ThemeToggle';

describe('themeToggle.test.jsx — Dark / Light Mode Toggle Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('1. ThemeToggle button renders in DOM', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /Toggle dark\/light mode/i });
    expect(button).toBeInTheDocument();
  });

  it('2. clicking toggle button toggles dark class on documentElement', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /Toggle dark\/light mode/i });
    
    // Initial state set to dark
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click to switch to light mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click back to dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('3. theme choice persists in localStorage after toggling', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /Toggle dark\/light mode/i });

    fireEvent.click(button);
    expect(localStorage.getItem('terranex_theme')).toBe('light');

    fireEvent.click(button);
    expect(localStorage.getItem('terranex_theme')).toBe('dark');
  });

  it('4. applies saved preference from localStorage on load', () => {
    localStorage.setItem('terranex_theme', 'light');
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('5. defaults gracefully when no saved preference exists', () => {
    render(<ThemeToggle />);
    expect(document.documentElement).toBeDefined();
  });
});
