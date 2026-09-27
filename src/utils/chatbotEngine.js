/**
 * Rule-Based Project Assistant Engine (Offline, Keyword-Matching)
 */

export function getAnswer(userInput, currentProject, allProjects = [], knowledgeBase = null) {
  if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
    return "Please type a question or select one of the suggested prompts.";
  }

  const rawInput = userInput.trim();
  const normalized = rawInput
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Ensure knowledge base entries list
  const kbEntries = knowledgeBase?.entries || knowledgeBase || [];

  // Get distinct list of states in dataset
  const distinctStates = Array.from(new Set(allProjects.map(p => p.state))).sort();

  // Helper to check if string contains all or any of the given keywords
  const containsAny = (str, keywords) => keywords.some(kw => str.includes(kw));
  const containsAll = (str, keywords) => keywords.every(kw => str.includes(kw));

  // --- Priority 2: Project-Specific Queries ---
  if (currentProject) {
    // Why / Risk Drivers
    if (containsAny(normalized, ["why", "risky", "risk factor", "reason", "driver", "causes", "why is this"])) {
      const drivers = currentProject.top_drivers || [];
      if (drivers.length > 0) {
        const driversList = drivers.map(d => `${d.factor} (+${d.impact_pct}%)`).join(', ');
        return `This project is ${currentProject.risk_category?.toLowerCase() || 'high'} risk mainly because of: ${driversList}.`;
      }
      return `The overall risk score for ${currentProject.name} is ${currentProject.overall_risk_score}%.`;
    }

    // Risk Score
    if (containsAny(normalized, ["risk score", "how risky", "what is the risk", "overall risk", "score"])) {
      return `The overall risk score for ${currentProject.name} is ${currentProject.overall_risk_score}%, placing it in the ${currentProject.risk_category} risk category.`;
    }

    // Recommended Actions / Next Steps
    if (containsAny(normalized, ["what should i do", "recommend", "action", "what next", "next step", "what to do"])) {
      const rec = currentProject.recommendation;
      if (rec) {
        const actions = Array.isArray(rec.actions) ? rec.actions.join('; ') : rec.actions;
        return `Recommended action: ${actions} (Owner: ${rec.owner}, Priority: ${rec.priority}, Target Due: ${rec.due_days} days).`;
      }
      return `No specific recommendation lever assigned yet for ${currentProject.name}.`;
    }

    // Stage / Stuck / Step
    if (containsAny(normalized, ["current stage", "which stage", "stuck stage", "what stage", "stage breakdown", "stage risk", "which step"])) {
      const sr = currentProject.stage_risks || {};
      return `The project is currently at the ${currentProject.current_stage} stage. Stage risk breakdown: Notification (${sr.notification || 0}%), SIA (${sr.sia_approvals || 0}%), Compensation (${sr.compensation || 0}%), R&R (${sr.rr || 0}%), Possession (${sr.possession || 0}%).`;
    }

    // Compensation status / percent
    if (containsAny(normalized, ["compensation status", "compensation percent", "compensation disbursed", "how much compensation", "disbursement"])) {
      return `Compensation disbursed is currently at ${currentProject.compensation_disbursed_pct}%.`;
    }

    // Legal disputes / Litigation
    if (containsAny(normalized, ["legal dispute", "legal disputes", "how many disputes", "litigation status", "dispute", "litigation"])) {
      return `This project currently has ${currentProject.legal_disputes_count} active/unresolved legal disputes.`;
    }

    // Families affected
    if (containsAny(normalized, ["family", "families", "how many families", "affected families", "displaced"])) {
      return `This project affects ${currentProject.families_affected} families.`;
    }

    // Confidence / Freshness
    if (containsAny(normalized, ["confidence", "how reliable", "last synced", "how fresh", "freshness"])) {
      return `Data confidence is ${currentProject.data_confidence_pct}%, last synced ${currentProject.last_synced_days_ago} days ago.`;
    }
  }

  // --- Priority 3: Portfolio-Wide Queries ---
  // Highest Risk Project
  if (containsAny(normalized, ["highest risk project", "most at risk", "most risky", "highest risk"])) {
    if (allProjects.length > 0) {
      const sorted = [...allProjects].sort((a, b) => b.overall_risk_score - a.overall_risk_score);
      const top = sorted[0];
      return `The highest risk project is ${top.id}: ${top.name} in ${top.state} with an overall risk score of ${top.overall_risk_score}%.`;
    }
  }

  // State-specific queries: "how many high risk projects in {state}" or "how many projects in {state}"
  const isHighRiskQuery = containsAny(normalized, ["high risk", "high-risk", "most risky"]);
  const isProjectCountQuery = containsAny(normalized, ["how many", "count", "projects in"]);

  if (isProjectCountQuery || normalized.includes("in ")) {
    // Check if any known state is mentioned in normalized query
    const mentionedState = distinctStates.find(st => normalized.includes(st.toLowerCase()));
    
    if (mentionedState) {
      if (isHighRiskQuery) {
        const count = allProjects.filter(p => p.state.toLowerCase() === mentionedState.toLowerCase() && (p.risk_category === 'High' || p.overall_risk_score >= 65)).length;
        return `There are ${count} high-risk projects in ${mentionedState}.`;
      } else {
        const count = allProjects.filter(p => p.state.toLowerCase() === mentionedState.toLowerCase()).length;
        return `There are ${count} total projects in ${mentionedState}.`;
      }
    } else {
      // Check if user specifically asked for a state that doesn't exist
      // Look for patterns like "in <word>"
      const matchInState = normalized.match(/in\s+([a-z]+)/i);
      if (matchInState) {
        const candidateState = matchInState[1].trim();
        // Ignore generic words like "the", "this", "our"
        if (!["the", "this", "our", "a", "an", "total"].includes(candidateState)) {
          return `I couldn't find that state in the current dataset — try one of: ${distinctStates.join(', ')}.`;
        }
      }
    }
  }

  // --- Priority 4: Knowledge Base Match ---
  let bestEntry = null;
  let maxKeywordScore = 0;

  for (const entry of kbEntries) {
    const keywords = entry.keywords || [];
    let matchScore = 0;

    for (const kw of keywords) {
      const normKw = kw.toLowerCase().trim();
      if (normalized.includes(normKw)) {
        matchScore += 1;
      }
    }

    if (matchScore > maxKeywordScore) {
      maxKeywordScore = matchScore;
      bestEntry = entry;
    }
  }

  if (bestEntry && maxKeywordScore > 0) {
    return bestEntry.answer;
  }

  // --- Priority 5: Fallback ---
  return "I'm not sure about that one. Try asking things like: 'Why is this project risky?', 'What should I do next?', 'What is Section 19?', or 'How many high-risk projects are in Bihar?'";
}
