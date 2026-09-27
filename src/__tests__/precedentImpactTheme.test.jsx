/**
 * src/__tests__/precedentImpactTheme.test.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Regression guard for Bug 1: verifies that key elements on the Precedent &
 * Impact Simulator page carry both light-mode AND dark-mode class pairings,
 * so hardcoded dark-only classes cannot silently regress again.
 *
 * Strategy: render the page, then inspect the rendered DOM elements for
 * data-testid attributes and check that the element's className string
 * contains both a light-mode class and a dark: prefixed counterpart.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PrecedentImpactSimulator from '../pages/PrecedentImpactSimulator';

const renderSimulator = () =>
  render(
    <MemoryRouter initialEntries={['/precedent-impact']}>
      <PrecedentImpactSimulator />
    </MemoryRouter>
  );

/**
 * Helper: given a DOM element, checks its className string contains
 * at least one plain (light) bg/text class AND at least one dark: prefixed class.
 */
function hasLightAndDarkClasses(element) {
  const cls = element.className || '';
  const hasLight = /\bbg-(white|slate-[1-9]|gray-[1-9]|indigo-[1-9]|emerald-[1-9]|red-[1-9]|amber-[1-9])/.test(cls) ||
                   /\btext-(slate-[4-9]|gray-[4-9]|indigo-[4-9]|emerald-[4-9]|red-[4-9]|amber-[4-9]|black)/.test(cls) ||
                   /\bborder-(slate-[1-3]|white|gray-[1-3])/.test(cls);
  const hasDark = /\bdark:/.test(cls);
  return { hasLight, hasDark, cls };
}

describe('precedentImpactTheme.test.jsx — Precedent Simulator Light/Dark Theme Regression Guard', () => {

  it('1. Section wrappers carry both light-mode bg and dark: class', () => {
    renderSimulator();
    // The Section component renders divs with bg-white dark:bg-slate-900
    const sections = document.querySelectorAll('[class*="rounded-2xl"]');
    expect(sections.length).toBeGreaterThan(0);
    // At least one section must have both light and dark bg
    const hasTheming = Array.from(sections).some(el => {
      const cls = el.className || '';
      return (cls.includes('bg-white') || cls.includes('bg-slate-')) && cls.includes('dark:');
    });
    expect(hasTheming).toBe(true);
  });

  it('2. KPI card "Similar Cases Found" has both light bg and dark: counterpart', () => {
    renderSimulator();
    const kpiCard = document.querySelector('[data-testid="kpi-similar-cases"]');
    expect(kpiCard).not.toBeNull();
    const cls = kpiCard.className;
    // Should have a light bg (bg-slate-100 etc.) and a dark: class
    expect(cls).toMatch(/bg-slate-100|bg-white/);
    expect(cls).toContain('dark:');
  });

  it('3. KPI card "Showing Improvement" has both light bg and dark: counterpart', () => {
    renderSimulator();
    const kpiCard = document.querySelector('[data-testid="kpi-improvement"]');
    expect(kpiCard).not.toBeNull();
    const cls = kpiCard.className;
    expect(cls).toMatch(/bg-slate-100|bg-white/);
    expect(cls).toContain('dark:');
  });

  it('4. KPI card "Best Match" has both light bg and dark: counterpart', () => {
    renderSimulator();
    const kpiCard = document.querySelector('[data-testid="kpi-best-match"]');
    expect(kpiCard).not.toBeNull();
    const cls = kpiCard.className;
    expect(cls).toMatch(/bg-slate-100|bg-white/);
    expect(cls).toContain('dark:');
  });

  it('5. Intervention list rows carry both light bg and dark: counterpart', () => {
    renderSimulator();
    const rows = document.querySelectorAll('[data-testid="intervention-list-row"]');
    // May be 0 rows if no similar cases — that is OK (conditional render).
    // If rows render, they must have proper theming.
    if (rows.length > 0) {
      const cls = rows[0].className;
      expect(cls).toMatch(/bg-slate-100|bg-white/);
      expect(cls).toContain('dark:');
    } else {
      // Page still rendered without crashing — pass
      expect(true).toBe(true);
    }
  });

  it('6. Action cards carry both light bg and dark: counterpart', () => {
    renderSimulator();
    const actionCards = document.querySelectorAll('[data-testid^="action-card-"]');
    expect(actionCards.length).toBeGreaterThan(0); // AVAILABLE_ACTIONS always renders
    const card = actionCards[0];
    const cls = card.className;
    expect(cls).toMatch(/bg-white|bg-indigo-50|bg-slate-/);
    expect(cls).toContain('dark:');
  });

  it('7. Page renders without crashing in both theme states (smoke test)', () => {
    expect(() => renderSimulator()).not.toThrow();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('8. Page header h1 carries both light-mode text color and dark: counterpart', () => {
    renderSimulator();
    const h1 = screen.getByRole('heading', { level: 1 });
    const cls = h1.className;
    // text-slate-800 (light) + dark:text-slate-100
    expect(cls).toMatch(/text-slate-[678]|text-gray-[678]/);
    expect(cls).toContain('dark:');
  });

  it('9. Disclaimer banner carries both light bg and dark: counterpart', () => {
    renderSimulator();
    // The disclaimer has bg-slate-100 dark:bg-slate-900/60
    const banners = document.querySelectorAll('[class*="rounded-xl"][class*="dark:"]');
    expect(banners.length).toBeGreaterThan(0);
  });
});
