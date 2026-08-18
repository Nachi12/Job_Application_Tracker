import { JobStatus } from '../types/models';

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  Saved: 'Saved',
  Applied: 'Applied',
  Screening: 'Screening',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Closed / Rejected'
};

export const JOB_STATUS_OPTIONS = (Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((key) => ({
  value: key,
  label: JOB_STATUS_LABELS[key]
}));

export const PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  TOKEN: 'jt_token',
  THEME: 'jt_theme'
};