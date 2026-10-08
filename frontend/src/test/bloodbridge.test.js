import { describe, it, expect } from 'vitest';
import { toDisplayBloodGroup, toInternalBloodGroup, getApiErrorMessage, ALL_DISPLAY_BLOOD_GROUPS, formatDate, } from '../lib/utils';
import { loginSchema, registerSchema, patientRequestSchema, hospitalReserveSchema, updateInventorySchema, } from '../lib/validation';
import { getRoleDashboardPath } from '../context/AuthContext';
describe('Blood Group Conversions', () => {
    it('converts internal enum representations to display symbols', () => {
        expect(toDisplayBloodGroup('O_POSITIVE')).toBe('O+');
        expect(toDisplayBloodGroup('O_NEGATIVE')).toBe('O-');
        expect(toDisplayBloodGroup('A_POSITIVE')).toBe('A+');
        expect(toDisplayBloodGroup('A_NEGATIVE')).toBe('A-');
        expect(toDisplayBloodGroup('B_POSITIVE')).toBe('B+');
        expect(toDisplayBloodGroup('B_NEGATIVE')).toBe('B-');
        expect(toDisplayBloodGroup('AB_POSITIVE')).toBe('AB+');
        expect(toDisplayBloodGroup('AB_NEGATIVE')).toBe('AB-');
    });
    it('converts display symbols back to internal backend format', () => {
        expect(toInternalBloodGroup('O+')).toBe('O_POSITIVE');
        expect(toInternalBloodGroup('A-')).toBe('A_NEGATIVE');
        expect(toInternalBloodGroup('AB+')).toBe('AB_POSITIVE');
    });
    it('contains exactly the 8 standard blood groups', () => {
        expect(ALL_DISPLAY_BLOOD_GROUPS).toEqual([
            'A+',
            'A-',
            'B+',
            'B-',
            'AB+',
            'AB-',
            'O+',
            'O-',
        ]);
    });
});
describe('Validation Schemas', () => {
    describe('Login Validation', () => {
        it('validates correct email and password', () => {
            const result = loginSchema.safeParse({
                email: 'doctor@hospital.org',
                password: 'password123',
            });
            expect(result.success).toBe(true);
        });
        it('rejects invalid email addresses', () => {
            const result = loginSchema.safeParse({
                email: 'invalid-email',
                password: 'password123',
            });
            expect(result.success).toBe(false);
        });
    });
    describe('Registration Validation', () => {
        it('accepts PATIENT and DONOR registration', () => {
            const patientRes = registerSchema.safeParse({
                fullName: 'Jane Doe',
                email: 'jane@example.com',
                password: 'securePassword123',
                role: 'PATIENT',
            });
            expect(patientRes.success).toBe(true);
            const donorRes = registerSchema.safeParse({
                fullName: 'John Donor',
                email: 'john@example.com',
                password: 'securePassword123',
                role: 'DONOR',
            });
            expect(donorRes.success).toBe(true);
        });
        it('strictly forbids public registration for HOSPITAL or ADMIN roles', () => {
            const hospitalRes = registerSchema.safeParse({
                fullName: 'City Hospital Admin',
                email: 'admin@hospital.org',
                password: 'securePassword123',
                role: 'HOSPITAL',
            });
            expect(hospitalRes.success).toBe(false);
            const adminRes = registerSchema.safeParse({
                fullName: 'Super Admin',
                email: 'super@admin.org',
                password: 'securePassword123',
                role: 'ADMIN',
            });
            expect(adminRes.success).toBe(false);
        });
    });
    describe('Patient Request Form Validation', () => {
        it('validates a complete emergency request', () => {
            const res = patientRequestSchema.safeParse({
                bloodGroup: 'A+',
                unitsRequired: 2,
                hospitalName: 'St. Mary Emergency Trauma Center',
                hospitalAddress: '100 Health Way',
                urgency: 'CRITICAL',
                requiredDate: '2026-10-10',
                additionalNotes: 'Urgent ICU case',
            });
            expect(res.success).toBe(true);
        });
        it('rejects zero or negative units', () => {
            const res = patientRequestSchema.safeParse({
                bloodGroup: 'B+',
                unitsRequired: 0,
                hospitalName: 'St. Mary',
                urgency: 'URGENT',
                requiredDate: '2026-10-10',
            });
            expect(res.success).toBe(false);
        });
    });
    describe('Hospital Reservation & Inventory Validation', () => {
        it('validates units to reserve', () => {
            const valid = hospitalReserveSchema.safeParse({ units: 3 });
            expect(valid.success).toBe(true);
            const invalid = hospitalReserveSchema.safeParse({ units: 0 });
            expect(invalid.success).toBe(false);
        });
        it('validates available inventory updates', () => {
            const valid = updateInventorySchema.safeParse({
                bloodGroup: 'O+',
                availableUnits: 15,
            });
            expect(valid.success).toBe(true);
            const negative = updateInventorySchema.safeParse({
                bloodGroup: 'O+',
                availableUnits: -1,
            });
            expect(negative.success).toBe(false);
        });
    });
});
describe('Role Dashboard Routing', () => {
    it('correctly maps roles to their respective dashboards', () => {
        expect(getRoleDashboardPath('PATIENT')).toBe('/patient/dashboard');
        expect(getRoleDashboardPath('DONOR')).toBe('/donor/dashboard');
        expect(getRoleDashboardPath('HOSPITAL')).toBe('/hospital/dashboard');
        expect(getRoleDashboardPath('ADMIN')).toBe('/admin/dashboard');
        expect(getRoleDashboardPath(null)).toBe('/login');
    });
});
describe('API Error Handling and Formatting', () => {
    it('handles standard Error instances', () => {
        const err = new Error('Custom client exception');
        expect(getApiErrorMessage(err)).toBe('Custom client exception');
    });
    it('formats dates consistently', () => {
        const formatted = formatDate('2026-10-08T14:00:00Z');
        expect(formatted).toContain('2026');
    });
});
