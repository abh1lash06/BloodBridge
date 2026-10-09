-- Allow donor profiles to be created automatically during donor registration.
-- Blood group, DOB, gender and address are completed afterward.

ALTER TABLE donor_profiles
    MODIFY COLUMN blood_group VARCHAR(20) NULL,
    MODIFY COLUMN date_of_birth DATE NULL,
    MODIFY COLUMN gender VARCHAR(20) NULL,
    MODIFY COLUMN address VARCHAR(500) NULL;
