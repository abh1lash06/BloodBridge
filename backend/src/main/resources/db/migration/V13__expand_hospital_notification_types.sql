ALTER TABLE notifications
DROP CHECK chk_notifications_type;

ALTER TABLE notifications
ADD CONSTRAINT chk_notifications_type
CHECK (
    type IN (
        'DONOR_MATCHED',
        'DONOR_ACCEPTED',
        'DONOR_REJECTED',
        'HOSPITAL_RESERVED',
        'HOSPITAL_RESERVATION_FULFILLED',
        'REQUEST_FULFILLED',
        'REQUEST_CANCELLED'
    )
);