import axios from 'axios';
export const BLOOD_GROUP_MAP = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
};
export const DISPLAY_TO_INTERNAL_BLOOD_GROUP = {
    'A+': 'A_POSITIVE',
    'A-': 'A_NEGATIVE',
    'B+': 'B_POSITIVE',
    'B-': 'B_NEGATIVE',
    'AB+': 'AB_POSITIVE',
    'AB-': 'AB_NEGATIVE',
    'O+': 'O_POSITIVE',
    'O-': 'O_NEGATIVE',
};
export const ALL_DISPLAY_BLOOD_GROUPS = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
];
export const ALL_INTERNAL_BLOOD_GROUPS = [
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
];
export function toDisplayBloodGroup(value) {
    if (!value)
        return '';
    const trimmed = value.trim().toUpperCase();
    if (trimmed in BLOOD_GROUP_MAP) {
        return BLOOD_GROUP_MAP[trimmed];
    }
    // If already like A+, B-, etc.
    const matched = ALL_DISPLAY_BLOOD_GROUPS.find((bg) => bg.toUpperCase() === trimmed);
    if (matched)
        return matched;
    return value;
}
export function toInternalBloodGroup(value) {
    if (!value)
        return '';
    const trimmed = value.trim();
    if (trimmed in DISPLAY_TO_INTERNAL_BLOOD_GROUP) {
        return DISPLAY_TO_INTERNAL_BLOOD_GROUP[trimmed];
    }
    const matched = ALL_INTERNAL_BLOOD_GROUPS.find((bg) => bg === trimmed.toUpperCase());
    if (matched)
        return matched;
    return value;
}
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
export function formatDate(dateString) {
    if (!dateString)
        return '—';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return dateString;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    }
    catch {
        return dateString;
    }
}
export function formatDateTime(dateString) {
    if (!dateString)
        return '—';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return dateString;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }
    catch {
        return dateString;
    }
}
export function getApiErrorMessage(error) {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return 'Cannot connect to BloodBridge server at http://localhost:8080. Please ensure the backend is running.';
        }
        const status = error.response.status;
        const data = error.response.data;
        // Backend custom error messages
        if (typeof data === 'string' && data.length > 0 && !data.startsWith('<')) {
            return data;
        }
        if (data && typeof data === 'object') {
            if ('message' in data && typeof data.message === 'string' && data.message) {
                return data.message;
            }
            if ('error' in data && typeof data.error === 'string' && data.error) {
                return data.error;
            }
        }
        if (status === 400) {
            return 'The request was invalid. Please check your inputs and try again.';
        }
        if (status === 401) {
            return 'Your session has expired. Please sign in again.';
        }
        if (status === 403) {
            return 'You do not have permission to perform this action.';
        }
        if (status === 404) {
            return 'The requested resource could not be found.';
        }
        if (status === 409) {
            return 'This action conflicts with the current state of the request.';
        }
        if (status >= 500) {
            return 'Something went wrong on the server. Please try again.';
        }
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
}
