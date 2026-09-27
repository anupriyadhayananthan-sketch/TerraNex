import { jsPDF } from 'jspdf';
import { getRiskTrendHistory } from './dataLoader';

export function generateOfficerBrief(project) {
  if (!project) return null;

  const doc = new jsPDF();
  const trendHistory = getRiskTrendHistory(project.id);
  const trendPoints = trendHistory?.points || [];
  const firstTrend = trendPoints[0]?.risk_score || project.overall_risk_score;
  const lastTrend = trendPoints[trendPoints.length - 1]?.risk_score || project.overall_risk_score;
  const trendDir = trendHistory?.trend_direction || 'stable';

  // Styling palette
  const darkNavy = [15, 23, 42];
  const indigo = [79, 70, 229];
  const slateText = [51, 65, 85];

  // Header Bar
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, 210, 24, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TerraNex AI — Officer Brief', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart India Hackathon MVP (PS 26017)', 140, 15);

  let y = 34;

  // Project Title Banner
  doc.setTextColor(...darkNavy);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(project.name || 'Project Brief', 14, y);

  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  doc.text(`ID: ${project.id} | State: ${project.state} | District: ${project.district} | Sector: ${project.project_type}`, 14, y);

  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  // Key Metrics Table / Summary Box
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 32, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  doc.text('Overall Risk Score:', 20, y + 10);
  
  doc.setFontSize(14);
  doc.setTextColor(project.overall_risk_score >= 65 ? 220 : project.overall_risk_score >= 35 ? 217 : 22, project.overall_risk_score >= 65 ? 38 : project.overall_risk_score >= 35 ? 119 : 163, 38);
  doc.text(`${project.overall_risk_score}% (${project.risk_category} Risk)`, 65, y + 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  doc.text(`Current Stage: ${project.current_stage}`, 20, y + 20);
  doc.text(`Land Area: ${project.land_area_hectares} Ha | Affected Families: ${project.families_affected}`, 95, y + 20);

  doc.text(`6-Month Trend: ${firstTrend}% -> ${lastTrend}% (${trendDir})`, 20, y + 27);

  // Statutory Stage Risks
  y += 42;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  doc.text('RFCTLARR Statutory Stage Risks', 14, y);

  y += 6;
  const stages = project.stage_risks || {};
  const stageItems = [
    `Notification: ${stages.Notification || 0}%`,
    `SIA/Approvals: ${stages['SIA/Approvals'] || 0}%`,
    `Compensation: ${stages.Compensation || 0}%`,
    `R&R: ${stages['R&R'] || 0}%`,
    `Possession: ${stages.Possession || 0}%`
  ];
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  doc.text(stageItems.join('   |   '), 14, y);

  // Top Delay Drivers
  y += 14;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  doc.text('Top Delay Drivers', 14, y);

  y += 6;
  const drivers = project.top_drivers || [];
  if (drivers.length > 0) {
    drivers.slice(0, 4).forEach(d => {
      y += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...slateText);
      doc.text(`• ${d.factor}: +${d.impact_pct}% impact`, 18, y);
    });
  } else {
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No major delay drivers identified.', 18, y);
  }

  // Recommended Policy Levers
  y += 14;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  doc.text('Recommended Policy Actions', 14, y);

  const rec = project.recommendation || {};
  const actions = Array.isArray(rec.actions) ? rec.actions : (rec.actions ? [rec.actions] : ['Review project timeline']);

  y += 2;
  actions.forEach(act => {
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateText);
    doc.text(`- ${act}`, 18, y);
  });

  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Action Owner: ${rec.owner || 'District Collector'}  |  Priority: ${rec.priority || 'Medium'}  |  Timeline: ${rec.due_days || 14} Days`, 18, y);

  // Data Freshness & Confidence
  y += 14;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Data Confidence: ${project.data_confidence_pct || 80}%  |  Last Synced: ${project.last_synced_days_ago || 0} days ago`, 14, y);

  // Footer Disclaimer Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 280, 196, 280);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by TerraNex AI — synthetic demonstration dataset, PS 26017', 14, 285);

  const fileName = `TerraNex_Brief_${project.id}.pdf`;
  doc.save(fileName);
  return fileName;
}
