import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProjectDetail from '../pages/ProjectDetail';
import rawData from '../data/seed_projects_dataset.json';
import * as riskFormulaModule from '../utils/riskFormula';
import { RoleProvider } from '../context/RoleContext';

const renderProjectDetail = (id = 'PRJ-001') => {
  return render(
    <RoleProvider>
      <MemoryRouter initialEntries={[`/project/${id}`]}>
        <Routes>
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    </RoleProvider>
  );
};

describe('ProjectDetail.test.jsx — Project Detail Screen Suite', () => {
  it('renders correct project name, state, and district for PRJ-001', () => {
    renderProjectDetail('PRJ-001');
    const prj = rawData.projects.find(p => p.id === 'PRJ-001');
    expect(screen.getAllByText(prj.name).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(prj.district, 'i')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(prj.state, 'i')).length).toBeGreaterThan(0);
  });

  it('stage-wise bars render all 5 RFCTLARR stages with values', () => {
    renderProjectDetail('PRJ-001');
    const rfctlarrStages = ['Notification', 'SIA/Approvals', 'Compensation', 'R&R', 'Possession'];
    rfctlarrStages.forEach((stage) => {
      expect(screen.getAllByText(stage).length).toBeGreaterThan(0);
    });
  });

  it('renders bottleneck marker when stage risk is >= 65%', () => {
    renderProjectDetail('PRJ-003');
    const bottleneckElements = screen.getAllByText(/BOTTLENECK/i);
    expect(bottleneckElements.length).toBeGreaterThan(0);
  });

  it('top drivers list renders top drivers array', () => {
    renderProjectDetail('PRJ-001');
    const prj = rawData.projects.find(p => p.id === 'PRJ-001');
    prj.top_drivers.forEach((driver) => {
      expect(screen.getAllByText(driver.factor).length).toBeGreaterThan(0);
    });
  });

  it('recommendation actions list renders every item in recommendation.actions', () => {
    renderProjectDetail('PRJ-001');
    const prj = rawData.projects.find(p => p.id === 'PRJ-001');
    prj.recommendation.actions.forEach((act) => {
      expect(screen.getAllByText(act).length).toBeGreaterThan(0);
    });
  });

  it('What-If slider: moving it recomputes risk score using computeRiskScore', () => {
    const spy = vi.spyOn(riskFormulaModule, 'computeRiskScore');
    renderProjectDetail('PRJ-001');
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '95' } });
    
    expect(spy).toHaveBeenCalledWith(expect.anything(), { compensation_disbursed_pct: 95 });
    spy.mockRestore();
  });

  it('What-If slider at project original value returns approximately original score', () => {
    renderProjectDetail('PRJ-001');
    const prj = rawData.projects.find(p => p.id === 'PRJ-001');
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: prj.compensation_disbursed_pct.toString() } });
    
    const elements = screen.getAllByText(`${prj.overall_risk_score}%`);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('navigating to non-existent ID PRJ-999 shows graceful "project not found" state', () => {
    renderProjectDetail('PRJ-999');
    expect(screen.getByText('Project Not Found')).toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  });

  it('"Assign intervention →" button opens modal', () => {
    renderProjectDetail('PRJ-001');
    const btn = document.getElementById('assign-intervention-btn');
    fireEvent.click(btn);

    expect(screen.getByText('Intervention Tracker')).toBeInTheDocument();
    expect(screen.getByText(/Assigned to:/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  });

  it('displays data confidence % and last synced days ago', () => {
    renderProjectDetail('PRJ-001');
    const prj = rawData.projects.find(p => p.id === 'PRJ-001');
    expect(screen.getAllByText(new RegExp(`${prj.data_confidence_pct}%`, 'i')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(`${prj.last_synced_days_ago} days ago`, 'i')).length).toBeGreaterThan(0);
  });
});
