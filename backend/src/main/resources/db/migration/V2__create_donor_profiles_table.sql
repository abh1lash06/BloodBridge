CREATE TABLE donor_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    blood_group VARCHAR(5) NOT NULL,

    date_of_birth DATE NOT NULL,

    gender VARCHAR(20) NOT NULL,

    address VARCHAR(500) NOT NULL,

    available BOOLEAN NOT NULL DEFAULT TRUE,

    last_donation_date DATE NULL,

    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT uk_donor_profiles_user
        UNIQUE (user_id),

    CONSTRAINT fk_donor_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_donor_blood_group
        CHECK (
            blood_group IN (
                'A+', 'A-',
                'B+', 'B-',
                'AB+', 'AB-',
                'O+', 'O-'
            )
        ),

    CONSTRAINT chk_donor_gender
        CHECK (
            gender IN (
                'MALE',
                'FEMALE',
                'OTHER'
            )
        ),

    CONSTRAINT chk_donor_verification
        CHECK (
            verification_status IN (
                'PENDING',
                'VERIFIED',
                'REJECTED'
            )
        ),

    INDEX idx_donor_blood_group (blood_group),

    INDEX idx_donor_available (available),

    INDEX idx_donor_verification (verification_status)
);