CREATE TABLE blood_requests (
    id BIGINT NOT NULL AUTO_INCREMENT,

    patient_user_id BIGINT NOT NULL,

    blood_group VARCHAR(20) NOT NULL,

    units_required INT NOT NULL,

    hospital_name VARCHAR(200) NOT NULL,

    hospital_address VARCHAR(500) NOT NULL,

    urgency VARCHAR(20) NOT NULL DEFAULT 'NORMAL',

    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',

    required_date DATE NOT NULL,

    additional_notes VARCHAR(1000),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_blood_requests_patient
        FOREIGN KEY (patient_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_blood_request_blood_group
        CHECK (
            blood_group IN (
                'A_POSITIVE',
                'A_NEGATIVE',
                'B_POSITIVE',
                'B_NEGATIVE',
                'AB_POSITIVE',
                'AB_NEGATIVE',
                'O_POSITIVE',
                'O_NEGATIVE'
            )
        ),

    CONSTRAINT chk_blood_request_units
        CHECK (
            units_required >= 1
            AND units_required <= 20
        ),

    CONSTRAINT chk_blood_request_urgency
        CHECK (
            urgency IN (
                'NORMAL',
                'URGENT',
                'CRITICAL'
            )
        ),

    CONSTRAINT chk_blood_request_status
        CHECK (
            status IN (
                'OPEN',
                'MATCHED',
                'FULFILLED',
                'CANCELLED'
            )
        ),

    INDEX idx_blood_requests_patient (
        patient_user_id
    ),

    INDEX idx_blood_requests_blood_group (
        blood_group
    ),

    INDEX idx_blood_requests_status (
        status
    ),

    INDEX idx_blood_requests_urgency (
        urgency
    ),

    INDEX idx_blood_requests_required_date (
        required_date
    )
);