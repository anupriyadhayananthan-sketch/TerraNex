import { describe, it, expect } from 'vitest';
import { getAnswer } from '../utils/chatbotEngine';
import { getAllProjects, getProjectById } from '../utils/dataLoader';
import knowledgeBaseData from '../data/chatbot_knowledge_base.json';

describe('chatbotEngine — Rule-Based Project Assistant Engine', () => {
  const allProjects = getAllProjects();
  const sampleProject = getProjectById('PRJ-001') || allProjects[0];

  it('1. returns top driver info when asked "why is this risky"', () => {
    const answer = getAnswer('Why is this risky?', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain(sampleProject.top_drivers[0].factor);
    expect(answer.toLowerCase()).toContain('risk mainly because of');
  });

  it('2. returns correct overall_risk_score when asked "what is the risk score"', () => {
    const answer = getAnswer('What is the risk score?', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain(`${sampleProject.overall_risk_score}%`);
  });

  it('3. returns correct recommendation owner when asked "what should I do"', () => {
    const answer = getAnswer('What should I do?', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain(sampleProject.recommendation.owner);
  });

  it('4. returns correct current_stage when asked "which stage is this stuck at"', () => {
    const answer = getAnswer('Which stage is this stuck at?', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain(sampleProject.current_stage);
  });

  it('5. portfolio-wide: returns correct count for "how many high risk projects in Bihar"', () => {
    const expectedCount = allProjects.filter(p => p.state === 'Bihar' && (p.risk_category === 'High' || p.overall_risk_score >= 65)).length;
    const answer = getAnswer('how many high risk projects in Bihar', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain(`${expectedCount} high-risk projects in Bihar`);
  });

  it('6. portfolio-wide: returns graceful error message for unrecognized state name', () => {
    const answer = getAnswer('how many high risk projects in Atlantis', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain("couldn't find that state in the current dataset");
  });

  it('7. general knowledge: returns Section 19 explanation for "what is section 19"', () => {
    const answer = getAnswer('what is section 19', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain('Declaration stage');
    expect(answer.toLowerCase()).toContain('12 months');
  });

  it('8. general knowledge: returns entry with more matched keywords when hitting multiple entries', () => {
    // "rfctlarr land acquisition act section 11" matches rfctlarr_act with 3 keywords vs section11 with 1 keyword
    const answer = getAnswer('rfctlarr land acquisition act section 11', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain('Right to Fair Compensation and Transparency');
  });

  it('9. fallback: returns fallback message for nonsense input', () => {
    const answer = getAnswer('banana spaceship', sampleProject, allProjects, knowledgeBaseData);
    expect(answer).toContain("I'm not sure about that one. Try asking things like");
  });

  it('10. case-insensitivity: "WHY IS THIS RISKY" and "why is this risky" return identical answers', () => {
    const ansUpper = getAnswer('WHY IS THIS RISKY?', sampleProject, allProjects, knowledgeBaseData);
    const ansLower = getAnswer('why is this risky?', sampleProject, allProjects, knowledgeBaseData);
    expect(ansUpper).toEqual(ansLower);
  });

  it('11. empty input does not crash and returns prompt', () => {
    const ansEmpty = getAnswer('', sampleProject, allProjects, knowledgeBaseData);
    const ansSpaces = getAnswer('   ', sampleProject, allProjects, knowledgeBaseData);
    expect(ansEmpty).toContain('Please type a question');
    expect(ansSpaces).toContain('Please type a question');
  });
});
