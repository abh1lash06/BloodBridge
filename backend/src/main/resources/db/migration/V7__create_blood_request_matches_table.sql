CREATE TABLE blood_request_matches (
    id BIGINT NOT NULL AUTO_INCREMENT,

    blood_request_id BIGINT NOT NULL,

    donor_profile_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    matched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    responded_at TIMESTAMP NULL,

    PRIMARY KEY (id),

    CONSTRAINT uk_blood_request_donor_match
        UNIQUE (
            blood_request_id,
            donor_profile_id
        ),

    CONSTRAINT fk_matches_blood_request
        FOREIGN KEY (blood_request_id)
        REFERENCES blood_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_matches_donor
        FOREIGN KEY (donor_profile_id)
        REFERENCES donor_profiles(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_blood_request_match_status
        CHECK (
            status IN (
                'PENDING',
                'ACCEPTED',
                'REJECTED',
                'CANCELLED'
            )
        ),

    INDEX idx_matches_blood_request (
        blood_request_id
    ),

    INDEX idx_matches_donor (
        donor_profile_id
    ),

    INDEX idx_matches_status (
        status
    ),

    INDEX idx_matches_matched_at (
        matched_at
    )
);