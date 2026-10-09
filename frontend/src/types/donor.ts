import { BloodRequest, UrgencyLevel } from './patient';

export type DonorVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface DonorProfile {
  id?: number | string;
  userId?: number | string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  isAvailable: boolean;
  verificationStatus: DonorVerificationStatus;
  lastDonationDate?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DonorMatchItem {
  id: number | string;
  bloodRequestId?: number | string;
  bloodRequest?: BloodRequest;
  hospitalName?: string;
  hospitalAddress?: string;
  bloodGroup: string;
  urgency: UrgencyLevel;
  requiredDate: string;
  unitsRequired?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  matchedAt?: string;
  createdAt?: string;
}
