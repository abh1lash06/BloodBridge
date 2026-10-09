
import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters'),

    email: z
        .string()
        .trim()
        .email('Please enter a valid email address'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),

    role: z.enum(['PATIENT', 'DONOR'], {
        error: 'Please select a valid role',
    }),

    phoneNumber: z.string().trim().optional(),
});
export const patientRequestSchema = z.object({
    bloodGroup: z.string().min(1, 'Please select a blood group'),

    unitsRequired: z
        .number({ error: 'Units must be a valid number' })
        .int('Units must be a whole number')
        .min(1, 'At least 1 unit is required')
        .max(50, 'Maximum 50 units can be requested at once'),

    hospitalName: z.string().trim().min(2, 'Hospital name is required'),
    hospitalAddress: z.string().trim().optional(),

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
