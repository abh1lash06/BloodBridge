
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const registerSchema = z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(72),
    role: z.enum(['PATIENT', 'DONOR']),
    phoneNumber: z.string().trim().max(20).optional(),
    bloodGroup: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().trim().max(500).optional(),
}).superRefine((data, ctx) => {
    if (data.role !== 'DONOR') return;
    if (!bloodGroups.includes(data.bloodGroup || '')) {
        ctx.addIssue({ code: 'custom', path: ['bloodGroup'], message: 'Select a valid blood group' });
    }
    const dob = data.dateOfBirth || '';
    const parsedDate = new Date(dob + 'T00:00:00');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== dob || parsedDate >= new Date()) {
        ctx.addIssue({ code: 'custom', path: ['dateOfBirth'], message: 'Enter a valid past date of birth' });
    }
    if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender || '')) {
        ctx.addIssue({ code: 'custom', path: ['gender'], message: 'Select gender' });
    }
    if (!data.address || data.address.trim().length < 3) {
        ctx.addIssue({ code: 'custom', path: ['address'], message: 'Address must have at least 3 characters' });
    }
});


export const patientRequestSchema = z.object({
  bloodGroup: z.string().min(1, 'Please select a blood group'),
  unitsRequired: z
    .number({ error: 'Units must be a valid number' })
    .int('Units must be a whole number')
    .min(1, 'At least 1 unit is required')
    .max(20, 'Maximum 20 units can be requested at once'),
  hospitalName: z.string().trim().min(2, 'Hospital name is required'),
  hospitalAddress: z
    .string()
    .trim()
    .min(1, 'Hospital address is required')
    .max(500),
  urgency: z.enum(['NORMAL', 'URGENT', 'CRITICAL'], {
    error: 'Please select an urgency level',
  }),
  requiredDate: z.string().min(1, 'Required date is required'),
  additionalNotes: z.string().trim().optional(),
});

export const donorProfileSchema = z.object({
  bloodGroup: z.string().min(1, 'Please select a blood group'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().trim().min(3, 'Address is required'),
});

export const donorProfileUpdateSchema = donorProfileSchema.omit({
  bloodGroup: true,
});

export const donorProfileUpdateSchema = donorProfileSchema.omit({ bloodGroup: true });

export const hospitalProfileSchema = z.object({
  hospitalName: z.string().trim().min(2, 'Hospital name is required'),
  registrationNumber: z.string().trim().min(2, 'Registration number is required'),
  address: z.string().trim().min(3, 'Address is required'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  phone: z.string().trim().min(5, 'Contact phone number is required'),
});

export const hospitalReserveSchema = z.object({
  units: z
    .number({ error: 'Units must be a number' })
    .int('Units must be a whole number')
    .min(1, 'At least 1 unit must be reserved'),
});

export const updateInventorySchema = z.object({
  bloodGroup: z.string().min(1, 'Blood group is required'),
  availableUnits: z
    .number({ error: 'Available units must be a number' })
    .int('Units must be an integer')
    .min(0, 'Units cannot be negative'),
});
