import { JobApplication } from '../types/models';

const escapeCsvField = (field: any): string => {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
};

export const exportJobsToCsv = (jobs: JobApplication[], filename = 'hirelog_applications.csv') => {
  const headers = [
    'Company',
    'Role',
    'Status',
    'Applied Date',
    'Source',
    'Location',
    'Salary',
    'Interview Date',
    'Recruiter Name',
    'Recruiter Email'
  ];

  const rows = jobs.map((job) => [
    escapeCsvField(job.companyName),
    escapeCsvField(job.role),
    escapeCsvField(job.status),
    escapeCsvField(job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : ''),
    escapeCsvField(job.source || 'LinkedIn'),
    escapeCsvField(job.location || ''),
    escapeCsvField(job.salary ? `$${job.salary}` : ''),
    escapeCsvField(job.interviewDate ? new Date(job.interviewDate).toLocaleDateString() : ''),
    escapeCsvField(job.recruiterName || ''),
    escapeCsvField(job.recruiterEmail || '')
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
