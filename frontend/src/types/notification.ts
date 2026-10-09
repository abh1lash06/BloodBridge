export type NotificationType =
  | 'DONOR_MATCHED'
  | 'DONOR_ACCEPTED'
  | 'DONOR_REJECTED'
  | 'HOSPITAL_RESERVED'
  | 'HOSPITAL_RESERVATION_RELEASED'
  | 'HOSPITAL_RESERVATION_FULFILLED'
  | 'REQUEST_FULFILLED'
  | 'REQUEST_CANCELLED'
  | string;

export interface AppNotification {
  id: number | string;
  title?: string;
  message: string;
  type?: NotificationType;
  read: boolean;
  createdAt: string;
  referenceId?: number | string | null;
  referenceType?: string | null;
}
