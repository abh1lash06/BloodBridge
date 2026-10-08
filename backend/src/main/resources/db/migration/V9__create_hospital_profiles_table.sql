CREATE TABLE hospital_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    hospital_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),

    CONSTRAINT uk_hospital_profiles_user
        UNIQUE (user_id),

    CONSTRAINT uk_hospital_registration
        UNIQUE (registration_number),

    CONSTRAINT fk_hospital_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_hospital_profiles_city (city),
    INDEX idx_hospital_profiles_state (state),
    INDEX idx_hospital_profiles_verified (verified)
);