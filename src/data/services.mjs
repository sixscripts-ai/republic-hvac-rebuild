export const services = [
  {
    slug: 'ac-repair',
    name: 'AC Repair',
    eyebrow: 'Cooling repair',
    summary: 'Troubleshooting and repair for air-conditioning systems that are not cooling, cycling correctly, or running efficiently.',
    intro: 'When your air conditioner is not keeping up, the right next step is a clear diagnosis. Republic HVAC Services provides residential and commercial AC repair with a focus on identifying the cause before recommending the work.',
    symptoms: ['Warm air from vents', 'Weak or uneven airflow', 'Frequent cycling', 'Unusual noises', 'Water around indoor equipment', 'Unexpected energy-use increases'],
    includes: ['System inspection and diagnostic review', 'Explanation of findings', 'Repair options based on system condition', 'Operational check after completed work'],
    related: ['ac-installation', 'hvac-maintenance']
  },
  {
    slug: 'ac-installation',
    name: 'AC Installation',
    eyebrow: 'Cooling replacement',
    summary: 'Air-conditioning replacement and installation planning for homes and commercial spaces.',
    intro: 'A new cooling system should match the building, comfort goals, and operating needs. Republic HVAC Services can help evaluate replacement options and plan a practical installation.',
    symptoms: ['Existing system is near end of life', 'Repair costs are becoming frequent', 'Comfort is inconsistent', 'Current equipment is inefficient', 'Property needs a new cooling system'],
    includes: ['Existing-system review', 'Equipment and sizing discussion', 'Installation planning', 'Startup and operational check'],
    related: ['ac-repair', 'hvac-maintenance']
  },
  {
    slug: 'heating-repair',
    name: 'Heating Repair',
    eyebrow: 'Heating service',
    summary: 'Diagnosis and repair for heating systems that are not producing reliable, consistent comfort.',
    intro: 'Heating problems can come from controls, airflow, equipment, or system wear. Republic HVAC Services provides heating-system diagnostics and repair for residential and commercial properties.',
    symptoms: ['No heat', 'Uneven room temperatures', 'Short cycling', 'Unusual sounds', 'System will not start', 'Rising utility use'],
    includes: ['Heating-system inspection', 'Diagnostic review', 'Repair options based on findings', 'Post-service operation check'],
    related: ['furnace-repair', 'heat-pumps', 'hvac-maintenance']
  },
  {
    slug: 'furnace-repair',
    name: 'Furnace Repair',
    eyebrow: 'Furnace service',
    summary: 'Furnace troubleshooting and repair for common performance and reliability problems.',
    intro: 'If a furnace is not starting, heating evenly, or operating normally, a proper diagnostic helps narrow the issue. Republic HVAC Services provides furnace repair as part of its heating services.',
    symptoms: ['Furnace does not start', 'Cold or weak airflow', 'Frequent on/off cycling', 'Unusual furnace noises', 'Thermostat and temperature mismatch', 'Inconsistent heating'],
    includes: ['Furnace inspection', 'Diagnostic testing', 'Repair recommendations', 'Operation and safety check after service'],
    related: ['heating-repair', 'heat-pumps', 'hvac-maintenance']
  },
  {
    slug: 'heat-pumps',
    name: 'Heat Pump Service',
    eyebrow: 'Heating & cooling',
    summary: 'Service for heat-pump systems used for efficient heating and cooling.',
    intro: 'Heat pumps handle both heating and cooling, so performance issues can affect comfort year-round. Republic HVAC Services provides heat-pump service within its heating and cooling offering.',
    symptoms: ['System is not heating or cooling', 'Outdoor unit is not operating normally', 'Frequent cycling', 'Reduced airflow', 'Unusual noises', 'Comfort varies by room'],
    includes: ['System inspection', 'Heating and cooling operation review', 'Repair recommendations', 'Performance check after completed work'],
    related: ['heating-repair', 'ac-repair', 'hvac-maintenance']
  },
  {
    slug: 'hvac-maintenance',
    name: 'HVAC Maintenance',
    eyebrow: 'Preventive service',
    summary: 'Routine heating and cooling maintenance designed to support reliability and system longevity.',
    intro: 'Preventive maintenance can help identify developing HVAC issues before they become larger repairs. Republic HVAC Services provides routine maintenance for heating and cooling equipment.',
    symptoms: ['Seasonal maintenance is due', 'System performance has declined', 'Energy use has changed', 'Equipment has not been inspected recently', 'You want to plan ahead before peak season'],
    includes: ['Visual system inspection', 'Basic operational checks', 'Filter and airflow review', 'Recommendations based on observed condition'],
    related: ['ac-repair', 'heating-repair']
  },
  {
    slug: 'commercial-hvac',
    name: 'Commercial HVAC',
    eyebrow: 'Business comfort',
    summary: 'Heating and cooling service for commercial spaces and operating environments.',
    intro: 'Republic HVAC Services currently positions its offering for both residential and commercial heating and cooling. This page provides a dedicated path for business customers without making unsupported claims about specific commercial equipment or response guarantees.',
    symptoms: ['Workspaces are not maintaining temperature', 'A commercial unit needs diagnosis', 'Routine service is due', 'Equipment performance has become inconsistent'],
    includes: ['Service-needs review', 'System inspection', 'Recommendations based on observed conditions', 'Follow-up planning where needed'],
    related: ['ac-repair', 'heating-repair', 'hvac-maintenance']
  }
];
