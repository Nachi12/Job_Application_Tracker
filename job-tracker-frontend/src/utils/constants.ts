import { JobStatus } from '../types/models';

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

export const JOB_STATUS_OPTIONS = Object.entries(JOB_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as JobStatus, label })
);

export const PAGE_SIZE = 10;

export const STORAGE_KEYS = {
  TOKEN: 'jt_token',
  THEME: 'jt_theme'
};