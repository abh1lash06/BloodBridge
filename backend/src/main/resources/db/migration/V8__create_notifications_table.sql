CREATE TABLE notifications (
    id BIGINT NOT NULL AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    type VARCHAR(50) NOT NULL,

    title VARCHAR(200) NOT NULL,

    message VARCHAR(1000) NOT NULL,

    reference_id BIGINT NULL,

    read_status BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_notifications_type
        CHECK (
            type IN (
                'DONOR_MATCHED',
                'DONOR_ACCEPTED',
                'DONOR_REJECTED',
                'REQUEST_FULFILLED',
                'REQUEST_CANCELLED'
            )
        ),

    INDEX idx_notifications_user (
        user_id
    ),

    INDEX idx_notifications_user_read (
        user_id,
        read_status
    ),

    INDEX idx_notifications_created (
        created_at
    )
);