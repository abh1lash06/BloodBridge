CREATE TABLE hospital_blood_reservations (
    id BIGINT NOT NULL AUTO_INCREMENT,

    blood_request_id BIGINT NOT NULL,

    hospital_profile_id BIGINT NOT NULL,

    blood_group VARCHAR(20) NOT NULL,

    units_reserved INT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'RESERVED',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    released_at TIMESTAMP NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_reservation_blood_request
        FOREIGN KEY (blood_request_id)
        REFERENCES blood_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reservation_hospital
        FOREIGN KEY (hospital_profile_id)
        REFERENCES hospital_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_reservation_blood_group
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

    CONSTRAINT chk_reservation_units
        CHECK (
            units_reserved >= 1
        ),

    CONSTRAINT chk_reservation_status
        CHECK (
            status IN (
                'RESERVED',
                'RELEASED',
                'FULFILLED',
                'CANCELLED'
            )
        ),

    INDEX idx_reservation_request (
        blood_request_id
    ),

    INDEX idx_reservation_hospital (
        hospital_profile_id
    ),

    INDEX idx_reservation_status (
        status
    )
);