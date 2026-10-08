CREATE TABLE hospital_blood_inventory (
    id BIGINT NOT NULL AUTO_INCREMENT,
    hospital_profile_id BIGINT NOT NULL,
    blood_group VARCHAR(20) NOT NULL,
    available_units INT NOT NULL DEFAULT 0,
    reserved_units INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),

    CONSTRAINT uk_hospital_inventory_group
        UNIQUE (hospital_profile_id, blood_group),

    CONSTRAINT fk_hospital_inventory_hospital
        FOREIGN KEY (hospital_profile_id)
        REFERENCES hospital_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_inventory_blood_group
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

    CONSTRAINT chk_inventory_available_units
        CHECK (available_units >= 0),

    CONSTRAINT chk_inventory_reserved_units
        CHECK (reserved_units >= 0),

    INDEX idx_inventory_blood_group (blood_group),
    INDEX idx_inventory_hospital (hospital_profile_id)
);