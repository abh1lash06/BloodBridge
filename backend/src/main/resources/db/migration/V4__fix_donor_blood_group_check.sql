ALTER TABLE donor_profiles
    DROP CHECK chk_donor_blood_group;

ALTER TABLE donor_profiles
    ADD CONSTRAINT chk_donor_blood_group
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
        );