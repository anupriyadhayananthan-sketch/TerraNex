-- ============================================================
-- TerraNex AI — Supabase Direct SQL Seed
-- 52 Projects & 22 Ingestion Feed Items
-- ============================================================

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-001', 'Patna-West Peripheral Ring Road', 'Urban Infrastructure', 'Bihar', 'Patna', 'SIA/Approvals',
  630, 1405, 74,
  0, 84, 14,
  23, 7,
  12, 22.7, 'Low',
  '{"Notification":24,"SIA/Approvals":22,"Compensation":45,"R&R":22,"Possession":55}'::jsonb, '[{"factor":"R&R progress lagging","impact_pct":12.9}]'::jsonb, '{"actions":["Initiate R&R committee review for 1208 pending families","Release pending rehabilitation grants this quarter"],"owner":"R&R Committee","priority":"Low","due_days":30}'::jsonb, 90.8,
  3, '{"lat":25.7799,"lng":85.5539}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-002', 'NH-31 Aurangabad-South Widening', 'National Highway', 'Maharashtra', 'Aurangabad', 'SIA/Approvals',
  144.8, 1583, 48,
  0, 78, 22,
  65, 24,
  12, 45.9, 'Medium',
  '{"Notification":26,"SIA/Approvals":45,"Compensation":44,"R&R":17,"Possession":34}'::jsonb, '[{"factor":"Pending compensation disbursement","impact_pct":18.8},{"factor":"Approval/notification backlog","impact_pct":16},{"factor":"R&R progress lagging","impact_pct":11.7}]'::jsonb, '{"actions":["Escalate 164 pending compensation disbursement cases to District Collector","Set a 15-day disbursement completion target with weekly tracking"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 76.8,
  14, '{"lat":19.0946,"lng":75.0518}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-003', 'Amritsar-East Peripheral Ring Road', 'Urban Infrastructure', 'Punjab', 'Amritsar', 'Compensation',
  660.5, 183, 34,
  9, 78, 45,
  78, 25,
  12, 71.9, 'High',
  '{"Notification":33,"SIA/Approvals":32,"Compensation":70,"R&R":54,"Possession":53}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":21.6},{"factor":"Approval/notification backlog","impact_pct":16.7},{"factor":"Pending compensation disbursement","impact_pct":9.6},{"factor":"R&R progress lagging","impact_pct":8.2},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.7}]'::jsonb, '{"actions":["Expedite review of 9 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"High","due_days":7}'::jsonb, 90.5,
  3, '{"lat":31.0776,"lng":75.631}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-004', 'Khammam-North 400kV Transmission Corridor', 'Power Transmission', 'Telangana', 'Khammam', 'Possession',
  549.4, 1160, 33,
  6, 37, 39,
  24, 22,
  12, 64.5, 'Medium',
  '{"Notification":27,"SIA/Approvals":14,"Compensation":23,"R&R":46,"Possession":58}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":14.7},{"factor":"Active/unresolved legal disputes","impact_pct":14.4},{"factor":"Pending compensation disbursement","impact_pct":12},{"factor":"Incomplete documentation","impact_pct":11.3}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 90.5,
  6, '{"lat":18.1865,"lng":79.3748}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-005', 'Bhopal-West Canal Modernization', 'Irrigation Canal', 'Madhya Pradesh', 'Bhopal', 'R&R',
  465, 1549, 79,
  3, 81, 56,
  48, 10,
  12, 34.1, 'Low',
  '{"Notification":41,"SIA/Approvals":15,"Compensation":13,"R&R":30,"Possession":20}'::jsonb, '[{"factor":"R&R progress lagging","impact_pct":6.6}]'::jsonb, '{"actions":["Initiate R&R committee review for 681 pending families","Release pending rehabilitation grants this quarter"],"owner":"R&R Committee","priority":"Low","due_days":30}'::jsonb, 79.4,
  10, '{"lat":23.6505,"lng":77.3066}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-006', 'Purulia-Bypass Industrial Development Corridor', 'Industrial Corridor', 'West Bengal', 'Purulia', 'R&R',
  24.6, 1496, 19,
  6, 98, 44,
  63, 9,
  12, 40.9, 'Medium',
  '{"Notification":37,"SIA/Approvals":20,"Compensation":39,"R&R":42,"Possession":26}'::jsonb, '[{"factor":"Pending compensation disbursement","impact_pct":17.5},{"factor":"Active/unresolved legal disputes","impact_pct":14.4},{"factor":"R&R progress lagging","impact_pct":8.4}]'::jsonb, '{"actions":["Escalate 242 pending compensation disbursement cases to District Collector","Set a 15-day disbursement completion target with weekly tracking"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 91,
  4, '{"lat":23.4663,"lng":87.8144}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-007', 'Muzaffarpur-Bypass Peripheral Ring Road', 'Urban Infrastructure', 'Bihar', 'Muzaffarpur', 'SIA/Approvals',
  327.2, 350, 74,
  11, 97, 10,
  61, 33,
  12, 58.7, 'Medium',
  '{"Notification":17,"SIA/Approvals":60,"Compensation":29,"R&R":25,"Possession":13}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"R&R progress lagging","impact_pct":13.5}]'::jsonb, '{"actions":["Expedite review of 11 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 93,
  1, '{"lat":25.289,"lng":85.5808}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-008', 'Indore-West Industrial Development Corridor', 'Industrial Corridor', 'Madhya Pradesh', 'Indore', 'Compensation',
  805.6, 358, 38,
  4, 84, 37,
  89, 14,
  12, 56.3, 'Medium',
  '{"Notification":29,"SIA/Approvals":35,"Compensation":55,"R&R":38,"Possession":43}'::jsonb, '[{"factor":"Pending compensation disbursement","impact_pct":13.2},{"factor":"Active/unresolved legal disputes","impact_pct":9.6},{"factor":"R&R progress lagging","impact_pct":9.4},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.3}]'::jsonb, '{"actions":["Escalate 44 pending compensation disbursement cases to District Collector","Set a 15-day disbursement completion target with weekly tracking"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 49.4,
  30, '{"lat":23.2418,"lng":77.0975}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-009', 'Ghaziabad-East Industrial Development Corridor', 'Industrial Corridor', 'Uttar Pradesh', 'Ghaziabad', 'Notification',
  542, 488, 13,
  10, 72, 19,
  85, 17,
  12, 45.2, 'Medium',
  '{"Notification":42,"SIA/Approvals":44,"Compensation":18,"R&R":46,"Possession":46}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Pending compensation disbursement","impact_pct":20.4},{"factor":"R&R progress lagging","impact_pct":12.2},{"factor":"Approval/notification backlog","impact_pct":11.3},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.1}]'::jsonb, '{"actions":["Expedite review of 10 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 92.8,
  4, '{"lat":27.4672,"lng":80.8415}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-010', 'NH-95 Warangal-South Widening', 'National Highway', 'Telangana', 'Warangal', 'SIA/Approvals',
  358.3, 1789, 11,
  6, 42, 17,
  71, 23,
  12, 53.3, 'Medium',
  '{"Notification":25,"SIA/Approvals":47,"Compensation":38,"R&R":18,"Possession":37}'::jsonb, '[{"factor":"Pending compensation disbursement","impact_pct":18.9},{"factor":"Approval/notification backlog","impact_pct":15.3},{"factor":"Active/unresolved legal disputes","impact_pct":14.4},{"factor":"R&R progress lagging","impact_pct":12.4},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.3}]'::jsonb, '{"actions":["Escalate 318 pending compensation disbursement cases to District Collector","Set a 15-day disbursement completion target with weekly tracking"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 96.2,
  2, '{"lat":17.6202,"lng":79.4552}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-011', 'Bhagalpur-East Industrial Development Corridor', 'Industrial Corridor', 'Bihar', 'Bhagalpur', 'Compensation',
  466.4, 50, 16,
  11, 60, 31,
  72, 33,
  12, 80.8, 'High',
  '{"Notification":23,"SIA/Approvals":35,"Compensation":71,"R&R":10,"Possession":34}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Pending compensation disbursement","impact_pct":11.3},{"factor":"R&R progress lagging","impact_pct":10.3},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.3}]'::jsonb, '{"actions":["Expedite review of 11 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"High","due_days":7}'::jsonb, 86.2,
  7, '{"lat":25.3182,"lng":85.8409}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-012', 'Purulia-North Doubling & Gauge Conversion', 'Railway Line', 'West Bengal', 'Purulia', 'SIA/Approvals',
  63.8, 1526, 74,
  0, 70, 17,
  26, 39,
  12, 47.5, 'Medium',
  '{"Notification":42,"SIA/Approvals":41,"Compensation":42,"R&R":15,"Possession":21}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"R&R progress lagging","impact_pct":12.4}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 88.7,
  7, '{"lat":22.3822,"lng":86.9816}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-013', 'Howrah-Bypass Industrial Development Corridor', 'Industrial Corridor', 'West Bengal', 'Howrah', 'Compensation',
  532.2, 878, 89,
  5, 96, 50,
  53, 15,
  12, 52.8, 'Medium',
  '{"Notification":55,"SIA/Approvals":30,"Compensation":47,"R&R":18,"Possession":52}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Approval/notification backlog","impact_pct":10},{"factor":"R&R progress lagging","impact_pct":7.5}]'::jsonb, '{"actions":["Expedite review of 5 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 68.1,
  21, '{"lat":23.0746,"lng":87.4487}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-014', 'Patna-Bypass 400kV Transmission Corridor', 'Power Transmission', 'Bihar', 'Patna', 'Possession',
  76.2, 456, 69,
  1, 74, 18,
  51, 25,
  12, 55.6, 'Medium',
  '{"Notification":20,"SIA/Approvals":38,"Compensation":44,"R&R":55,"Possession":54}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":16.7},{"factor":"R&R progress lagging","impact_pct":12.3}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 88,
  4, '{"lat":26.1847,"lng":85.6848}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-015', 'Kalaburagi-West Peripheral Ring Road', 'Urban Infrastructure', 'Karnataka', 'Kalaburagi', 'SIA/Approvals',
  757.9, 1540, 75,
  1, 66, 87,
  46, 23,
  12, 37.6, 'Medium',
  '{"Notification":53,"SIA/Approvals":38,"Compensation":42,"R&R":41,"Possession":26}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":15.3},{"factor":"Incomplete documentation","impact_pct":6.1}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 90.1,
  3, '{"lat":15.7864,"lng":76.1153}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-016', 'NH-11 Nadia-North Widening', 'National Highway', 'West Bengal', 'Nadia', 'R&R',
  547, 556, 25,
  7, 84, 81,
  21, 9,
  12, 41.8, 'Medium',
  '{"Notification":54,"SIA/Approvals":19,"Compensation":44,"R&R":42,"Possession":47}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":16.8},{"factor":"Pending compensation disbursement","impact_pct":13.8}]'::jsonb, '{"actions":["Expedite review of 7 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 91.3,
  2, '{"lat":22.963,"lng":87.4157}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-017', 'Ludhiana-West Canal Modernization', 'Irrigation Canal', 'Punjab', 'Ludhiana', 'Compensation',
  310.3, 1166, 57,
  12, 49, 40,
  40, 13,
  12, 56.7, 'Medium',
  '{"Notification":11,"SIA/Approvals":21,"Compensation":57,"R&R":36,"Possession":52}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Incomplete documentation","impact_pct":9.2},{"factor":"R&R progress lagging","impact_pct":9}]'::jsonb, '{"actions":["Expedite review of 12 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 86.6,
  6, '{"lat":31.3369,"lng":75.8729}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-018', 'NH-71 Bhagalpur-West Widening', 'National Highway', 'Bihar', 'Bhagalpur', 'SIA/Approvals',
  781.9, 736, 44,
  8, 59, 38,
  23, 14,
  12, 45.6, 'Medium',
  '{"Notification":31,"SIA/Approvals":46,"Compensation":27,"R&R":32,"Possession":51}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":19.2},{"factor":"Pending compensation disbursement","impact_pct":14.6},{"factor":"R&R progress lagging","impact_pct":9.3},{"factor":"Incomplete documentation","impact_pct":7.4}]'::jsonb, '{"actions":["Expedite review of 8 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 90.1,
  6, '{"lat":25.6113,"lng":85.7154}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-019', 'NH-44 Ludhiana-West Widening', 'National Highway', 'Punjab', 'Ludhiana', 'Compensation',
  836.3, 98, 18,
  5, 74, 50,
  75, 40,
  12, 73, 'High',
  '{"Notification":17,"SIA/Approvals":34,"Compensation":64,"R&R":12,"Possession":55}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Pending compensation disbursement","impact_pct":11.8},{"factor":"R&R progress lagging","impact_pct":7.5},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.5}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"High","due_days":7}'::jsonb, 83.8,
  10, '{"lat":30.8233,"lng":75.5239}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-020', 'Nalgonda-North 400kV Transmission Corridor', 'Power Transmission', 'Telangana', 'Nalgonda', 'Compensation',
  568.9, 275, 43,
  4, 82, 51,
  71, 20,
  12, 58.8, 'Medium',
  '{"Notification":18,"SIA/Approvals":22,"Compensation":57,"R&R":34,"Possession":53}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":13.3},{"factor":"Pending compensation disbursement","impact_pct":10.5},{"factor":"Active/unresolved legal disputes","impact_pct":9.6},{"factor":"R&R progress lagging","impact_pct":7.3},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.3}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 82.4,
  10, '{"lat":18.2978,"lng":79.1088}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-021', 'Howrah-West Canal Modernization', 'Irrigation Canal', 'West Bengal', 'Howrah', 'Compensation',
  499.3, 1360, 46,
  3, 86, 37,
  85, 32,
  12, 74, 'High',
  '{"Notification":20,"SIA/Approvals":52,"Compensation":67,"R&R":52,"Possession":50}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Pending compensation disbursement","impact_pct":10.5},{"factor":"R&R progress lagging","impact_pct":9.4},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.1}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"High","due_days":7}'::jsonb, 54.7,
  30, '{"lat":23.0431,"lng":87.0121}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-022', 'Nalgonda-West Doubling & Gauge Conversion', 'Railway Line', 'Telangana', 'Nalgonda', 'Notification',
  219.4, 993, 83,
  9, 39, 68,
  73, 38,
  12, 45.4, 'Medium',
  '{"Notification":44,"SIA/Approvals":41,"Compensation":35,"R&R":25,"Possession":19}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":21.6},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":11},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.4}]'::jsonb, '{"actions":["Expedite review of 9 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 94,
  3, '{"lat":18.1873,"lng":78.9067}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-023', 'Bhagalpur-Bypass Doubling & Gauge Conversion', 'Railway Line', 'Bihar', 'Bhagalpur', 'Compensation',
  480.4, 1757, 20,
  3, 89, 95,
  87, 37,
  12, 68.2, 'High',
  '{"Notification":30,"SIA/Approvals":38,"Compensation":69,"R&R":42,"Possession":37}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Pending compensation disbursement","impact_pct":10.1},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.2}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"High","due_days":7}'::jsonb, 78.4,
  14, '{"lat":25.9967,"lng":85.5574}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-024', 'Gwalior-North Canal Modernization', 'Irrigation Canal', 'Madhya Pradesh', 'Gwalior', 'R&R',
  450.3, 1303, 35,
  2, 39, 46,
  50, 19,
  12, 48.1, 'Medium',
  '{"Notification":30,"SIA/Approvals":44,"Compensation":15,"R&R":42,"Possession":34}'::jsonb, '[{"factor":"Pending compensation disbursement","impact_pct":15},{"factor":"Approval/notification backlog","impact_pct":12.7},{"factor":"Incomplete documentation","impact_pct":11},{"factor":"R&R progress lagging","impact_pct":8.1}]'::jsonb, '{"actions":["Escalate 169 pending compensation disbursement cases to District Collector","Set a 15-day disbursement completion target with weekly tracking"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 86.9,
  5, '{"lat":23.5327,"lng":77.6477}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-025', 'Nadia-South Industrial Development Corridor', 'Industrial Corridor', 'West Bengal', 'Nadia', 'Notification',
  710.5, 817, 79,
  11, 32, 83,
  68, 32,
  12, 46.2, 'Medium',
  '{"Notification":42,"SIA/Approvals":34,"Compensation":36,"R&R":44,"Possession":44}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":12.2}]'::jsonb, '{"actions":["Expedite review of 11 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 95.4,
  1, '{"lat":23.2598,"lng":87.9774}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-026', 'Coimbatore-South 400kV Transmission Corridor', 'Power Transmission', 'Tamil Nadu', 'Coimbatore', 'SIA/Approvals',
  582.1, 848, 26,
  9, 46, 89,
  88, 3,
  12, 29.7, 'Low',
  '{"Notification":47,"SIA/Approvals":29,"Compensation":15,"R&R":51,"Possession":37}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":21.6},{"factor":"Pending compensation disbursement","impact_pct":15.5},{"factor":"Incomplete documentation","impact_pct":9.7},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.3}]'::jsonb, '{"actions":["Expedite review of 9 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Low","due_days":30}'::jsonb, 85.3,
  6, '{"lat":10.5628,"lng":78.454}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-027', 'Nadia-North Doubling & Gauge Conversion', 'Railway Line', 'West Bengal', 'Nadia', 'SIA/Approvals',
  749.5, 589, 58,
  1, 40, 70,
  22, 36,
  12, 46.2, 'Medium',
  '{"Notification":32,"SIA/Approvals":45,"Compensation":51,"R&R":12,"Possession":11}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":10.8}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 92.6,
  1, '{"lat":23.4395,"lng":87.1392}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-028', 'Bhadrak-East Doubling & Gauge Conversion', 'Railway Line', 'Odisha', 'Bhadrak', 'Compensation',
  197, 1452, 37,
  7, 51, 87,
  34, 12,
  12, 50, 'Medium',
  '{"Notification":16,"SIA/Approvals":47,"Compensation":51,"R&R":46,"Possession":53}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":16.8},{"factor":"Incomplete documentation","impact_pct":8.8}]'::jsonb, '{"actions":["Expedite review of 7 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 93.6,
  4, '{"lat":20.9896,"lng":84.6504}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-029', 'Warangal-West Industrial Development Corridor', 'Industrial Corridor', 'Telangana', 'Warangal', 'Notification',
  660, 1761, 92,
  5, 45, 82,
  25, 24,
  12, 39, 'Medium',
  '{"Notification":38,"SIA/Approvals":14,"Compensation":42,"R&R":51,"Possession":31}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":16},{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Incomplete documentation","impact_pct":9.9}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 81.9,
  10, '{"lat":17.4152,"lng":79.4041}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-030', 'Nadia-West Peripheral Ring Road', 'Urban Infrastructure', 'West Bengal', 'Nadia', 'Compensation',
  627.7, 1352, 39,
  5, 98, 71,
  79, 29,
  12, 75.6, 'High',
  '{"Notification":47,"SIA/Approvals":27,"Compensation":77,"R&R":15,"Possession":27}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":19.3},{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.7}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"High","due_days":7}'::jsonb, 51.8,
  30, '{"lat":23.358,"lng":87.1926}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-031', 'Pune-South Canal Modernization', 'Irrigation Canal', 'Maharashtra', 'Pune', 'R&R',
  166.8, 454, 50,
  8, 73, 45,
  55, 37,
  12, 64.8, 'Medium',
  '{"Notification":43,"SIA/Approvals":22,"Compensation":15,"R&R":64,"Possession":41}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Active/unresolved legal disputes","impact_pct":19.2},{"factor":"R&R progress lagging","impact_pct":8.2}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 95.4,
  1, '{"lat":19.6662,"lng":74.9884}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-032', 'NH-22 Gwalior-North Widening', 'National Highway', 'Madhya Pradesh', 'Gwalior', 'SIA/Approvals',
  592.6, 647, 89,
  5, 90, 80,
  87, 24,
  12, 42.4, 'Medium',
  '{"Notification":45,"SIA/Approvals":39,"Compensation":39,"R&R":27,"Possession":29}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":16},{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.2}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 86.2,
  6, '{"lat":23.0017,"lng":76.9448}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-033', 'Gaya-South Doubling & Gauge Conversion', 'Railway Line', 'Bihar', 'Gaya', 'SIA/Approvals',
  507.3, 1576, 72,
  5, 42, 34,
  57, 16,
  12, 38.6, 'Medium',
  '{"Notification":21,"SIA/Approvals":32,"Compensation":44,"R&R":18,"Possession":27}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Approval/notification backlog","impact_pct":10.7},{"factor":"Incomplete documentation","impact_pct":10.4},{"factor":"R&R progress lagging","impact_pct":9.9}]'::jsonb, '{"actions":["Expedite review of 5 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 88.3,
  5, '{"lat":25.0546,"lng":84.9654}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-034', 'NH-12 Ganjam-Bypass Widening', 'National Highway', 'Odisha', 'Ganjam', 'SIA/Approvals',
  414.7, 717, 28,
  12, 62, 71,
  34, 6,
  12, 38.6, 'Medium',
  '{"Notification":41,"SIA/Approvals":37,"Compensation":53,"R&R":13,"Possession":19}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Pending compensation disbursement","impact_pct":14.9},{"factor":"Incomplete documentation","impact_pct":6.8}]'::jsonb, '{"actions":["Expedite review of 12 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 86.8,
  6, '{"lat":20.079,"lng":84.8754}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-035', 'Warangal-Bypass Industrial Development Corridor', 'Industrial Corridor', 'Telangana', 'Warangal', 'Compensation',
  531.4, 1608, 71,
  2, 86, 48,
  95, 29,
  12, 59.4, 'Medium',
  '{"Notification":46,"SIA/Approvals":49,"Compensation":57,"R&R":16,"Possession":23}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":19.3},{"factor":"R&R progress lagging","impact_pct":7.8},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.7}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 88.5,
  4, '{"lat":18.1506,"lng":79.2176}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-036', 'Khammam-West Industrial Development Corridor', 'Industrial Corridor', 'Telangana', 'Khammam', 'Notification',
  391.2, 1236, 65,
  2, 59, 46,
  56, 31,
  12, 38.5, 'Medium',
  '{"Notification":34,"SIA/Approvals":26,"Compensation":50,"R&R":47,"Possession":52}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"R&R progress lagging","impact_pct":8.1},{"factor":"Incomplete documentation","impact_pct":7.4}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 91.7,
  2, '{"lat":18.3647,"lng":79.1374}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-037', 'Khammam-East Canal Modernization', 'Irrigation Canal', 'Telangana', 'Khammam', 'Notification',
  676.8, 1238, 77,
  11, 86, 25,
  79, 21,
  12, 51.5, 'Medium',
  '{"Notification":53,"SIA/Approvals":42,"Compensation":44,"R&R":41,"Possession":38}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":14},{"factor":"R&R progress lagging","impact_pct":11.2},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.7}]'::jsonb, '{"actions":["Expedite review of 11 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 51.6,
  30, '{"lat":17.4965,"lng":78.9478}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-038', 'NH-22 Patiala-West Widening', 'National Highway', 'Punjab', 'Patiala', 'Possession',
  713, 1198, 80,
  11, 64, 83,
  25, 13,
  12, 50.6, 'Medium',
  '{"Notification":43,"SIA/Approvals":51,"Compensation":38,"R&R":27,"Possession":53}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Incomplete documentation","impact_pct":6.5}]'::jsonb, '{"actions":["Expedite review of 11 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 89.3,
  7, '{"lat":30.8231,"lng":75.8771}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-039', 'Jabalpur-North 400kV Transmission Corridor', 'Power Transmission', 'Madhya Pradesh', 'Jabalpur', 'Compensation',
  731.2, 695, 57,
  6, 66, 94,
  71, 37,
  12, 65.6, 'High',
  '{"Notification":39,"SIA/Approvals":15,"Compensation":59,"R&R":17,"Possession":35}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Active/unresolved legal disputes","impact_pct":14.4},{"factor":"Incomplete documentation","impact_pct":6.1},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.3}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"High","due_days":7}'::jsonb, 92.5,
  1, '{"lat":23.7379,"lng":77.7899}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-040', 'Mysuru-West 400kV Transmission Corridor', 'Power Transmission', 'Karnataka', 'Mysuru', 'Compensation',
  534.9, 1040, 85,
  3, 36, 36,
  54, 37,
  12, 63, 'Medium',
  '{"Notification":28,"SIA/Approvals":38,"Compensation":59,"R&R":11,"Possession":50}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":11.5},{"factor":"R&R progress lagging","impact_pct":9.6}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 90.5,
  3, '{"lat":15.4306,"lng":75.3872}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-041', 'Belagavi-East Industrial Development Corridor', 'Industrial Corridor', 'Karnataka', 'Belagavi', 'SIA/Approvals',
  717.6, 252, 64,
  11, 49, 73,
  57, 34,
  12, 66.5, 'High',
  '{"Notification":27,"SIA/Approvals":67,"Compensation":40,"R&R":25,"Possession":39}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":9.2}]'::jsonb, '{"actions":["Expedite review of 11 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"High","due_days":7}'::jsonb, 54.5,
  30, '{"lat":15.3615,"lng":75.5603}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-042', 'NH-46 Tumakuru-South Widening', 'National Highway', 'Karnataka', 'Tumakuru', 'SIA/Approvals',
  672.7, 567, 5,
  2, 68, 85,
  94, 33,
  12, 48.6, 'Medium',
  '{"Notification":38,"SIA/Approvals":46,"Compensation":31,"R&R":45,"Possession":44}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Pending compensation disbursement","impact_pct":18.4},{"factor":"Incomplete documentation","impact_pct":5.8},{"factor":"Strong stakeholder responsiveness","impact_pct":-5.6}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 94.7,
  3, '{"lat":15.1527,"lng":76.2194}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-043', 'Karimnagar-East Doubling & Gauge Conversion', 'Railway Line', 'Telangana', 'Karimnagar', 'SIA/Approvals',
  409.9, 1681, 53,
  2, 49, 73,
  24, 10,
  12, 30.6, 'Low',
  '{"Notification":47,"SIA/Approvals":31,"Compensation":38,"R&R":16,"Possession":43}'::jsonb, '[{"factor":"Incomplete documentation","impact_pct":9.2}]'::jsonb, '{"actions":["Deploy additional survey/verification staff to close documentation gaps","Digitize pending land records for this project"],"owner":"Sub-Divisional Magistrate","priority":"Low","due_days":30}'::jsonb, 79.9,
  10, '{"lat":18.4925,"lng":78.9184}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-044', 'Cuttack-North 400kV Transmission Corridor', 'Power Transmission', 'Odisha', 'Cuttack', 'Compensation',
  346.9, 184, 47,
  9, 98, 58,
  60, 33,
  12, 76.6, 'High',
  '{"Notification":12,"SIA/Approvals":49,"Compensation":68,"R&R":53,"Possession":28}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":21.6},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"R&R progress lagging","impact_pct":6.3}]'::jsonb, '{"actions":["Expedite review of 9 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"High","due_days":7}'::jsonb, 81.6,
  10, '{"lat":21.0969,"lng":85.0961}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-045', 'Patna-North 400kV Transmission Corridor', 'Power Transmission', 'Bihar', 'Patna', 'Possession',
  53.4, 1650, 12,
  2, 77, 65,
  38, 17,
  12, 52.3, 'Medium',
  '{"Notification":36,"SIA/Approvals":46,"Compensation":53,"R&R":21,"Possession":46}'::jsonb, '[{"factor":"Pending compensation disbursement","impact_pct":15.9},{"factor":"Approval/notification backlog","impact_pct":11.3}]'::jsonb, '{"actions":["Escalate 290 pending compensation disbursement cases to District Collector","Set a 15-day disbursement completion target with weekly tracking"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 83.1,
  10, '{"lat":25.7314,"lng":85.3591}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-046', 'Bhopal-North Doubling & Gauge Conversion', 'Railway Line', 'Madhya Pradesh', 'Bhopal', 'Compensation',
  571.8, 1667, 64,
  10, 50, 19,
  76, 24,
  12, 74.8, 'High',
  '{"Notification":29,"SIA/Approvals":50,"Compensation":73,"R&R":39,"Possession":29}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":16},{"factor":"R&R progress lagging","impact_pct":12.2},{"factor":"Incomplete documentation","impact_pct":9},{"factor":"Strong stakeholder responsiveness","impact_pct":-4.6}]'::jsonb, '{"actions":["Expedite review of 10 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"High","due_days":7}'::jsonb, 75.9,
  14, '{"lat":22.9391,"lng":77.2616}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-047', 'Karimnagar-Bypass Industrial Development Corridor', 'Industrial Corridor', 'Telangana', 'Karimnagar', 'SIA/Approvals',
  598.9, 64, 89,
  3, 31, 82,
  26, 40,
  12, 54.9, 'Medium',
  '{"Notification":41,"SIA/Approvals":55,"Compensation":24,"R&R":48,"Possession":32}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":12.4}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 50.5,
  30, '{"lat":17.6628,"lng":79.1282}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-048', 'Cuttack-East Peripheral Ring Road', 'Urban Infrastructure', 'Odisha', 'Cuttack', 'SIA/Approvals',
  383.1, 1206, 51,
  7, 41, 47,
  61, 28,
  12, 54.1, 'Medium',
  '{"Notification":22,"SIA/Approvals":54,"Compensation":33,"R&R":43,"Possession":42}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":18.7},{"factor":"Active/unresolved legal disputes","impact_pct":16.8},{"factor":"Incomplete documentation","impact_pct":10.6},{"factor":"R&R progress lagging","impact_pct":8}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"Medium","due_days":14}'::jsonb, 91,
  3, '{"lat":20.9962,"lng":85.1966}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-049', 'Jabalpur-East Peripheral Ring Road', 'Urban Infrastructure', 'Madhya Pradesh', 'Jabalpur', 'Compensation',
  77.9, 1564, 33,
  9, 80, 81,
  66, 7,
  12, 44.6, 'Medium',
  '{"Notification":10,"SIA/Approvals":26,"Compensation":39,"R&R":33,"Possession":53}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":21.6}]'::jsonb, '{"actions":["Expedite review of 9 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 87.3,
  6, '{"lat":23.5988,"lng":77.1146}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-050', 'Ludhiana-South Peripheral Ring Road', 'Urban Infrastructure', 'Punjab', 'Ludhiana', 'Notification',
  753.3, 1169, 46,
  10, 58, 92,
  28, 31,
  12, 61.1, 'Medium',
  '{"Notification":59,"SIA/Approvals":17,"Compensation":18,"R&R":12,"Possession":12}'::jsonb, '[{"factor":"Active/unresolved legal disputes","impact_pct":24},{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Incomplete documentation","impact_pct":7.6}]'::jsonb, '{"actions":["Expedite review of 10 unresolved legal disputes with State Legal Cell","Constitute a fast-track dispute resolution committee"],"owner":"State Legal Cell","priority":"Medium","due_days":14}'::jsonb, 49.6,
  30, '{"lat":30.6652,"lng":75.4911}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-051', 'Tumakuru-North 400kV Transmission Corridor', 'Power Transmission', 'Karnataka', 'Tumakuru', 'Compensation',
  635.5, 1126, 58,
  5, 49, 63,
  32, 33,
  12, 72.4, 'High',
  '{"Notification":36,"SIA/Approvals":27,"Compensation":71,"R&R":23,"Possession":38}'::jsonb, '[{"factor":"Approval/notification backlog","impact_pct":20},{"factor":"Active/unresolved legal disputes","impact_pct":12},{"factor":"Incomplete documentation","impact_pct":9.2}]'::jsonb, '{"actions":["Expedite SIA public hearing and Section 19 declaration (statutory window: 0 months remaining)","Prioritize this project in the next District Land Acquisition Committee meeting"],"owner":"District Collector","priority":"High","due_days":7}'::jsonb, 75.2,
  14, '{"lat":15.2336,"lng":75.3833}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.projects (
  id, name, project_type, state, district, current_stage,
  land_area_hectares, families_affected, compensation_disbursed_pct,
  legal_disputes_count, documentation_completeness_pct, rr_progress_pct,
  stakeholder_responsiveness_score, months_since_notification,
  statutory_deadline_months, overall_risk_score, risk_category,
  stage_risks, top_drivers, recommendation, data_confidence_pct,
  last_synced_days_ago, coordinates
) VALUES (
  'PRJ-052', 'NH-61 Patiala-North Widening', 'National Highway', 'Punjab', 'Patiala', 'SIA/Approvals',
  117, 1756, 63,
  0, 57, 92,
  22, 5,
  12, 18.3, 'Low',
  '{"Notification":25,"SIA/Approvals":18,"Compensation":23,"R&R":14,"Possession":45}'::jsonb, '[{"factor":"Incomplete documentation","impact_pct":7.7}]'::jsonb, '{"actions":["Deploy additional survey/verification staff to close documentation gaps","Digitize pending land records for this project"],"owner":"Sub-Divisional Magistrate","priority":"Low","due_days":30}'::jsonb, 91.7,
  5, '{"lat":30.5486,"lng":75.1591}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  overall_risk_score = EXCLUDED.overall_risk_score,
  risk_category = EXCLUDED.risk_category,
  updated_at = NOW();

INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-002', '2026-09-26', 0, 'Rajya Sabha Unstarred Question Reply', 'Archive record notes ongoing litigation over compensation for a power transmission project in Odisha', 'PRJ-044', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-011', '2026-09-26', 0, 'eParlib Archive Record', 'Archive record notes ongoing litigation over compensation for a national highway project in Karnataka', 'PRJ-042', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-020', '2026-09-25', 1, 'Rajya Sabha Unstarred Question Reply', 'Reply lists possession handover delay for a national highway project in West Bengal', 'PRJ-016', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-021', '2026-09-25', 1, 'data.gov.in Dataset Update', 'Reply lists possession handover delay for a power transmission project in Karnataka', NULL, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-015', '2026-09-23', 3, 'PIB Press Release', 'Dataset update lists 142 families awaiting R&R clearance under a irrigation canal corridor in Telangana', 'PRJ-037', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-005', '2026-09-21', 5, 'eParlib Archive Record', 'Reply confirms unresolved ownership dispute delaying a power transmission project in Telangana', 'PRJ-004', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-006', '2026-09-20', 6, 'eParlib Archive Record', 'Parliament reply flags legal dispute pending resolution for a power transmission project in Bihar', 'PRJ-014', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-013', '2026-09-20', 6, 'eParlib Archive Record', 'Reply confirms unresolved ownership dispute delaying a power transmission project in Karnataka', 'PRJ-040', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-019', '2026-09-19', 7, 'data.gov.in Dataset Update', 'Archive record shows documentation verification completed for a railway line project in West Bengal', 'PRJ-027', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-018', '2026-09-18', 8, 'PIB Press Release', 'Dataset update lists 240 families awaiting R&R clearance under a railway line corridor in Telangana', 'PRJ-022', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-010', '2026-09-15', 11, 'data.gov.in Dataset Update', 'Reply confirms unresolved ownership dispute delaying a national highway project in Punjab', 'PRJ-052', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-014', '2026-09-15', 11, 'data.gov.in Dataset Update', 'Reply confirms unresolved ownership dispute delaying a power transmission project in Karnataka', 'PRJ-040', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-009', '2026-09-14', 12, 'Rajya Sabha Unstarred Question Reply', 'Reply confirms unresolved ownership dispute delaying a national highway project in Punjab', 'PRJ-052', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-007', '2026-09-09', 17, 'PIB Press Release', 'Archive record notes ongoing litigation over compensation for a power transmission project in Bihar', 'PRJ-014', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-003', '2026-09-07', 19, 'eParlib Archive Record', 'Archive record notes ongoing litigation over compensation for a power transmission project in Odisha', 'PRJ-044', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-016', '2026-09-07', 19, 'PIB Press Release', 'Dataset update reports revised land area figures for a railway line project in Telangana', 'PRJ-043', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-008', '2026-09-03', 23, 'Lok Sabha Unstarred Question Reply', 'Archive record notes ongoing litigation over compensation for a power transmission project in Bihar', 'PRJ-014', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-022', '2026-09-03', 23, 'Rajya Sabha Unstarred Question Reply', 'Dataset update lists 212 families awaiting R&R clearance under a industrial corridor corridor in Uttar Pradesh', NULL, false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-004', '2026-09-02', 24, 'Rajya Sabha Unstarred Question Reply', 'Archive record notes ongoing litigation over compensation for a power transmission project in Telangana', 'PRJ-004', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-012', '2026-09-02', 24, 'Rajya Sabha Unstarred Question Reply', 'Parliament reply flags legal dispute pending resolution for a national highway project in Karnataka', 'PRJ-042', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-017', '2026-09-02', 24, 'Rajya Sabha Unstarred Question Reply', 'Dataset update lists 353 families awaiting R&R clearance under a industrial corridor corridor in Uttar Pradesh', 'PRJ-009', false)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.ingestion_feed (id, date, days_ago, source, headline, linked_project_id, dispute_related)
VALUES ('FEED-001', '2026-08-28', 29, 'data.gov.in Dataset Update', 'Reply confirms unresolved ownership dispute delaying a power transmission project in Odisha', 'PRJ-044', true)
ON CONFLICT (id) DO NOTHING;
