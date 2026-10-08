import { DonorProfile } from './donor';
import { HospitalProfile } from './hospital';

export interface AdminDonorVerificationItem extends DonorProfile {
  id: number | string;
}

export interface AdminHospitalVerificationItem extends HospitalProfile {
  id: number | string;
}

export interface AdminStats {
  totalDonors: number;
  verifiedDonors: number;
  pendingDonors: number;
  totalHospitals: number;
  verifiedHospitals: number;
  pendingHospitals: number;
  totalBloodRequests: number;
  fulfilledRequests: number;
}
