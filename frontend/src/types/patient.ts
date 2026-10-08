export type InternalBloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE';

export type DisplayBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'CRITICAL';

export type RequestStatus = 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';

export interface BloodRequest {
  id: number | string;
  patientId?: number | string;
  patientName?: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress?: string;
  urgency: UrgencyLevel;
  requiredDate: string;
  additionalNotes?: string;
  status: RequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBloodRequestInput {
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress?: string;
  urgency: UrgencyLevel;
  requiredDate: string;
  additionalNotes?: string;
}

export interface DonorMatch {
  id: number | string;
  donorId?: number | string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  bloodGroup: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isAvailable?: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  matchedAt?: string;
  requestId?: number | string;
}
