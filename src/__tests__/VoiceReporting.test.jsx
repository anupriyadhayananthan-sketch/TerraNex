import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VoiceReporter, { extractVoiceFields } from '../components/VoiceReporter';

describe('src/__tests__/VoiceReporting.test.jsx — Web Speech API Suite', () => {
  it('renders VoiceReporter component without crashing', () => {
    render(<VoiceReporter projectId="PRJ-001" />);
    expect(screen.getByText(/Voice-Based Field Update/i)).toBeInTheDocument();
  });

  it('shows fallback message gracefully when Web Speech API is absent in JSDOM', () => {
    render(<VoiceReporter projectId="PRJ-001" />);
    expect(screen.getByText(/Voice API unsupported in browser/i)).toBeInTheDocument();
  });

  it('extractVoiceFields regex parses "released for 12 families, 3 pending"', () => {
    const res = extractVoiceFields("Compensation released for 12 families, 3 pending.");
    expect(res.families_updated).toBe(12);
    expect(res.families_pending).toBe(3);
  });

  it('extractVoiceFields returns null for non-matching input strings without throwing', () => {
    const res = extractVoiceFields("Hello world non matching input string");
    expect(res.families_updated).toBeNull();
    expect(res.families_pending).toBeNull();
  });
});
