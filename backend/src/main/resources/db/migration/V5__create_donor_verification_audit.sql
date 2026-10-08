CREATE TABLE donor_verification_audits (
    id BIGINT NOT NULL AUTO_INCREMENT,

    donor_profile_id BIGINT NOT NULL,

    admin_user_id BIGINT NOT NULL,

    previous_status VARCHAR(30) NOT NULL,

    new_status VARCHAR(30) NOT NULL,

    reason VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_verification_audit_donor
        FOREIGN KEY (donor_profile_id)
        REFERENCES donor_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_verification_audit_admin
        FOREIGN KEY (admin_user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_verification_previous_status
        CHECK (
            previous_status IN (
                'PENDING',
                'VERIFIED',
                'REJECTED'
            )
        ),

    CONSTRAINT chk_verification_new_status
        CHECK (
            new_status IN (
                'PENDING',
                'VERIFIED',
                'REJECTED'
            )
        ),

    INDEX idx_verification_audit_donor (
        donor_profile_id
    ),

    INDEX idx_verification_audit_admin (
        admin_user_id
    ),

    INDEX idx_verification_audit_created (
        created_at
    )
);