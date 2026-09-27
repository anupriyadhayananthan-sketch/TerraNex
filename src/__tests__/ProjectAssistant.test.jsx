import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectAssistant from '../components/ProjectAssistant';
import { getProjectById } from '../utils/dataLoader';

describe('ProjectAssistant.jsx — Rule-Based Project Assistant Component', () => {
  const sampleProject1 = getProjectById('PRJ-001');
  const sampleProject2 = getProjectById('PRJ-002');

  it('1. renders assistant panel with title and suggestion chips', () => {
    render(<ProjectAssistant currentProject={sampleProject1} />);
    expect(screen.getByText('Rule-Based Project Assistant')).toBeInTheDocument();
    expect(screen.getByText('Why is this risky?')).toBeInTheDocument();
    expect(screen.getByText('What should I do?')).toBeInTheDocument();
    expect(screen.getByText('What is Section 19?')).toBeInTheDocument();
  });

  it('2. clicking a suggestion chip sends that question and renders response', () => {
    render(<ProjectAssistant currentProject={sampleProject1} />);
    const chip = screen.getByText('Why is this risky?');
    fireEvent.click(chip);

    // User message present
    expect(screen.getAllByText('Why is this risky?').length).toBeGreaterThan(0);
    // Assistant response contains top driver
    expect(screen.getByText(new RegExp(sampleProject1.top_drivers[0].factor, 'i'))).toBeInTheDocument();
  });

  it('3. typing input + clicking send appends both messages', () => {
    render(<ProjectAssistant currentProject={sampleProject1} />);
    const input = screen.getByPlaceholderText(/Ask a question about this project/i);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'What is Section 19?' } });
    fireEvent.click(sendBtn);

    expect(screen.getAllByText('What is Section 19?').length).toBeGreaterThan(1);
    expect(screen.getByText(/Section 19 is the Declaration stage/i)).toBeInTheDocument();
  });

  it('4. switching to a different project resets conversation without crashing', () => {
    const { rerender } = render(<ProjectAssistant currentProject={sampleProject1} />);
    expect(screen.getAllByText(new RegExp(sampleProject1.id, 'i')).length).toBeGreaterThan(0);

    // Rerender with project 2
    rerender(<ProjectAssistant currentProject={sampleProject2} />);
    expect(screen.getAllByText(new RegExp(sampleProject2.id, 'i')).length).toBeGreaterThan(0);
  });
});
