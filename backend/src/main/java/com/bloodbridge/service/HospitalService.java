package com.bloodbridge.service;

import com.bloodbridge.dto.hospital.CreateHospitalProfileRequest;
import com.bloodbridge.dto.hospital.HospitalBloodInventoryResponse;
import com.bloodbridge.dto.hospital.HospitalBloodReservationResponse;
import com.bloodbridge.dto.hospital.HospitalProfileResponse;
import com.bloodbridge.dto.hospital.ReserveBloodRequestRequest;
import com.bloodbridge.dto.hospital.UpdateBloodInventoryRequest;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.BloodRequestMatch;
import com.bloodbridge.entity.HospitalBloodInventory;
import com.bloodbridge.entity.HospitalBloodReservation;
import com.bloodbridge.entity.HospitalProfile;
import com.bloodbridge.entity.Notification;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.BloodRequestMatchRepository;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.HospitalBloodInventoryRepository;
import com.bloodbridge.repository.HospitalBloodReservationRepository;
import com.bloodbridge.repository.HospitalProfileRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HospitalService {

    private final HospitalProfileRepository hospitalProfileRepository;
    private final HospitalBloodInventoryRepository hospitalBloodInventoryRepository;
    private final HospitalBloodReservationRepository hospitalBloodReservationRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodRequestMatchRepository bloodRequestMatchRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public HospitalService(
            HospitalProfileRepository hospitalProfileRepository,
            HospitalBloodInventoryRepository hospitalBloodInventoryRepository,
            HospitalBloodReservationRepository hospitalBloodReservationRepository,
            BloodRequestRepository bloodRequestRepository,
            BloodRequestMatchRepository bloodRequestMatchRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.hospitalProfileRepository = hospitalProfileRepository;
        this.hospitalBloodInventoryRepository = hospitalBloodInventoryRepository;
        this.hospitalBloodReservationRepository = hospitalBloodReservationRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodRequestMatchRepository = bloodRequestMatchRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // =========================================================
    // HOSPITAL PROFILE
    // =========================================================

    @Transactional
    public HospitalProfileResponse createProfile(
            String authenticatedEmail,
            CreateHospitalProfileRequest request
    ) {
        User user = getHospitalUser(authenticatedEmail);

        if (request == null) {
            throw new IllegalArgumentException(
                    "Hospital profile data is required"
            );
        }

        if (hospitalProfileRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException(
                    "Hospital profile already exists for this user"
            );
        }

        String registrationNumber =
                request.getRegistrationNumber().trim();

        if (hospitalProfileRepository.existsByRegistrationNumber(
                registrationNumber
        )) {
            throw new IllegalArgumentException(
                    "Hospital registration number already exists"
            );
        }

        HospitalProfile profile =
                HospitalProfile.builder()
                        .user(user)
                        .hospitalName(
                                request.getHospitalName().trim()
                        )
                        .registrationNumber(
                                registrationNumber
                        )
                        .address(
                                request.getAddress().trim()
                        )
                        .city(
                                request.getCity().trim()
                        )
                        .state(
                                request.getState().trim()
                        )
                        .phone(
                                request.getPhone().trim()
                        )
                        .verified(false)
                        .build();

        HospitalProfile saved =
                hospitalProfileRepository.save(profile);

        return toProfileResponse(saved);
    }

    @Transactional(readOnly = true)
    public HospitalProfileResponse getMyProfile(
            String authenticatedEmail
    ) {
        HospitalProfile profile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        return toProfileResponse(profile);
    }

    @Transactional
    public HospitalProfileResponse updateProfile(
            String authenticatedEmail,
            CreateHospitalProfileRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Hospital profile data is required"
            );
        }

        HospitalProfile profile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        String registrationNumber =
                request.getRegistrationNumber().trim();

        if (!profile.getRegistrationNumber()
                .equals(registrationNumber)
                && hospitalProfileRepository
                .existsByRegistrationNumber(
                        registrationNumber
                )) {

            throw new IllegalArgumentException(
                    "Hospital registration number already exists"
            );
        }

        profile.setHospitalName(
                request.getHospitalName().trim()
        );

        profile.setRegistrationNumber(
                registrationNumber
        );

        profile.setAddress(
                request.getAddress().trim()
        );

        profile.setCity(
                request.getCity().trim()
        );

        profile.setState(
                request.getState().trim()
        );

        profile.setPhone(
                request.getPhone().trim()
        );

        HospitalProfile saved =
                hospitalProfileRepository.save(profile);

        return toProfileResponse(saved);
    }

    // =========================================================
    // BLOOD INVENTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalBloodInventoryResponse> getInventory(
            String authenticatedEmail
    ) {
        HospitalProfile profile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        return hospitalBloodInventoryRepository
                .findByHospitalProfileIdOrderByBloodGroupAsc(
                        profile.getId()
                )
                .stream()
                .map(this::toInventoryResponse)
                .toList();
    }

    @Transactional
    public HospitalBloodInventoryResponse updateInventory(
            String authenticatedEmail,
            UpdateBloodInventoryRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Inventory data is required"
            );
        }

        HospitalProfile profile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        HospitalBloodInventory.BloodGroup bloodGroup =
                parseInventoryBloodGroup(
                        request.getBloodGroup()
                );

        HospitalBloodInventory inventory =
                hospitalBloodInventoryRepository
                        .findByHospitalProfileIdAndBloodGroup(
                                profile.getId(),
                                bloodGroup
                        )
                        .orElseGet(() ->
                                HospitalBloodInventory
                                        .builder()
                                        .hospitalProfile(profile)
                                        .bloodGroup(bloodGroup)
                                        .availableUnits(0)
                                        .reservedUnits(0)
                                        .build()
                        );

        if (request.getAvailableUnits() < 0) {
            throw new IllegalArgumentException(
                    "Available units cannot be negative"
            );
        }

        if (request.getAvailableUnits()
                < inventory.getReservedUnits()) {

            throw new IllegalArgumentException(
                    "Available units cannot be less than reserved units"
            );
        }

        inventory.setAvailableUnits(
                request.getAvailableUnits()
        );

        HospitalBloodInventory saved =
                hospitalBloodInventoryRepository.save(
                        inventory
                );

        return toInventoryResponse(saved);
    }

    @Transactional(readOnly = true)
    public HospitalBloodInventoryResponse getInventoryForBloodGroup(
            String authenticatedEmail,
            String bloodGroup
    ) {
        HospitalProfile profile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        HospitalBloodInventory.BloodGroup parsedGroup =
                parseInventoryBloodGroup(bloodGroup);

        HospitalBloodInventory inventory =
                hospitalBloodInventoryRepository
                        .findByHospitalProfileIdAndBloodGroup(
                                profile.getId(),
                                parsedGroup
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood inventory not found for group "
                                                + bloodGroup
                                )
                        );

        return toInventoryResponse(inventory);
    }

    // =========================================================
    // BLOOD RESERVATION
    // =========================================================

    @Transactional
    public HospitalBloodReservationResponse reserveBlood(
            String authenticatedEmail,
            Long bloodRequestId,
            ReserveBloodRequestRequest request
    ) {
        HospitalProfile hospitalProfile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        if (!Boolean.TRUE.equals(
                hospitalProfile.getVerified()
        )) {
            throw new IllegalArgumentException(
                    "Hospital must be verified before reserving blood"
            );
        }

        if (bloodRequestId == null) {
            throw new IllegalArgumentException(
                    "Blood request ID is required"
            );
        }

        if (request == null) {
            throw new IllegalArgumentException(
                    "Reservation data is required"
            );
        }

        int units = request.getUnits();

        if (units < 1) {
            throw new IllegalArgumentException(
                    "At least 1 unit must be reserved"
            );
        }

        BloodRequest bloodRequest =
                bloodRequestRepository
                        .findForUpdate(bloodRequestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood request not found"
                                )
                        );

        if (bloodRequest.getStatus()
                != BloodRequest.Status.OPEN) {

            throw new IllegalArgumentException(
                    "Only OPEN blood requests can be reserved"
            );
        }

        /*
         * Current reservation model uses one active hospital
         * reservation per blood request.
         *
         * Therefore the reservation must cover the complete
         * requested quantity.
         */
        if (bloodRequestMatchRepository.countByBloodRequestIdAndStatus(
                bloodRequest.getId(), BloodRequestMatch.MatchStatus.ACCEPTED) > 0) {
            throw new IllegalArgumentException(
                    "Donors have already accepted this request; a full hospital reservation would duplicate units");
        }

        if (units != bloodRequest.getUnitsRequired()) {
            throw new IllegalArgumentException(
                    "Hospital must reserve all requested blood units"
            );
        }

        boolean anotherActiveReservation =
                hospitalBloodReservationRepository
                        .existsByBloodRequestIdAndStatus(
                                bloodRequestId,
                                HospitalBloodReservation
                                        .ReservationStatus.RESERVED
                        );

        if (anotherActiveReservation) {
            throw new IllegalArgumentException(
                    "This blood request already has an active hospital reservation"
            );
        }

        boolean hospitalAlreadyReserved =
                hospitalBloodReservationRepository
                        .findByBloodRequestIdAndHospitalProfileIdAndStatus(
                                bloodRequestId,
                                hospitalProfile.getId(),
                                HospitalBloodReservation
                                        .ReservationStatus.RESERVED
                        )
                        .isPresent();

        if (hospitalAlreadyReserved) {
            throw new IllegalArgumentException(
                    "This hospital already has an active reservation for this blood request"
            );
        }

        HospitalBloodInventory.BloodGroup inventoryBloodGroup =
                HospitalBloodInventory.BloodGroup.valueOf(
                        bloodRequest
                                .getBloodGroup()
                                .name()
                );

        /*
         * Pessimistic lock prevents concurrent hospital requests
         * from reserving the same inventory units.
         */
        HospitalBloodInventory inventory =
                hospitalBloodInventoryRepository
                        .findForUpdate(
                                hospitalProfile.getId(),
                                inventoryBloodGroup
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Hospital does not have inventory for requested blood group"
                                )
                        );

        int availableUnits =
                inventory.getAvailableUnits();

        int reservedUnits =
                inventory.getReservedUnits();

        if (availableUnits < 0
                || reservedUnits < 0) {

            throw new IllegalStateException(
                    "Hospital inventory contains invalid unit values"
            );
        }

        int freeUnits =
                availableUnits - reservedUnits;

        if (freeUnits < units) {
            throw new IllegalArgumentException(
                    "Insufficient available blood units. Free units: "
                            + freeUnits
            );
        }

        /*
         * Blood is still physically in the hospital inventory.
         * Only the reserved quantity increases.
         */
        inventory.setReservedUnits(
                reservedUnits + units
        );

        hospitalBloodInventoryRepository.save(
                inventory
        );

        HospitalBloodReservation reservation =
                HospitalBloodReservation
                        .builder()
                        .bloodRequest(bloodRequest)
                        .hospitalProfile(hospitalProfile)
                        .bloodGroup(
                                HospitalBloodReservation
                                        .BloodGroup
                                        .valueOf(
                                                bloodRequest
                                                        .getBloodGroup()
                                                        .name()
                                        )
                        )
                        .unitsReserved(units)
                        .status(
                                HospitalBloodReservation
                                        .ReservationStatus.RESERVED
                        )
                        .build();

        HospitalBloodReservation savedReservation =
                hospitalBloodReservationRepository.save(
                        reservation
                );

        /*
         * Full requested quantity is now reserved.
         */
        bloodRequest.setStatus(
                BloodRequest.Status.MATCHED
        );

        bloodRequestRepository.save(
                bloodRequest
        );

        notificationService.createNotification(
                bloodRequest.getPatient(),
                Notification.NotificationType.HOSPITAL_RESERVED,
                "Hospital Reserved Blood",
                hospitalProfile.getHospitalName()
                        + " reserved "
                        + units
                        + " unit(s) of "
                        + formatBloodGroup(
                        bloodRequest
                                .getBloodGroup()
                                .name()
                )
                        + " for your blood request.",
                bloodRequest.getId()
        );

        return toReservationResponse(
                savedReservation
        );
    }

    // =========================================================
    // RESERVATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalBloodReservationResponse>
    getMyReservations(
            String authenticatedEmail
    ) {
        HospitalProfile profile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        return hospitalBloodReservationRepository
                .findByHospitalProfileIdOrderByCreatedAtDesc(
                        profile.getId()
                )
                .stream()
                .map(this::toReservationResponse)
                .toList();
    }

    // =========================================================
    // RELEASE RESERVATION
    // =========================================================

    @Transactional
    public void releaseReservation(
            String authenticatedEmail,
            Long reservationId
    ) {
        HospitalProfile hospitalProfile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        HospitalBloodReservation reservation =
                hospitalBloodReservationRepository
                        .findById(reservationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Hospital reservation not found"
                                )
                        );

        if (!reservation.getHospitalProfile()
                .getId()
                .equals(hospitalProfile.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to release this reservation"
            );
        }

        if (reservation.getStatus()
                != HospitalBloodReservation
                .ReservationStatus.RESERVED) {

            throw new IllegalArgumentException(
                    "Only RESERVED reservations can be released"
            );
        }

        HospitalBloodInventory.BloodGroup inventoryBloodGroup =
                HospitalBloodInventory.BloodGroup.valueOf(
                        reservation
                                .getBloodGroup()
                                .name()
                );

        HospitalBloodInventory inventory =
                hospitalBloodInventoryRepository
                        .findForUpdate(
                                hospitalProfile.getId(),
                                inventoryBloodGroup
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood inventory record not found"
                                )
                        );

        int unitsToRelease =
                reservation.getUnitsReserved();

        if (unitsToRelease < 1) {
            throw new IllegalStateException(
                    "Reservation contains an invalid unit amount"
            );
        }

        if (inventory.getReservedUnits()
                < unitsToRelease) {

            throw new IllegalStateException(
                    "Reserved inventory is lower than the reservation amount"
            );
        }

        inventory.setReservedUnits(
                inventory.getReservedUnits()
                        - unitsToRelease
        );

        reservation.setStatus(
                HospitalBloodReservation
                        .ReservationStatus.RELEASED
        );

        reservation.setReleasedAt(
                LocalDateTime.now()
        );

        hospitalBloodInventoryRepository.save(
                inventory
        );

        hospitalBloodReservationRepository.save(
                reservation
        );

        BloodRequest bloodRequest =
                reservation.getBloodRequest();

        boolean anotherHospitalReservation =
                hospitalBloodReservationRepository
                        .existsByBloodRequestIdAndStatus(
                                bloodRequest.getId(),
                                HospitalBloodReservation
                                        .ReservationStatus.RESERVED
                        );

        boolean acceptedDonorMatch =
                !bloodRequestMatchRepository
                        .findByBloodRequestIdAndStatus(
                                bloodRequest.getId(),
                                BloodRequestMatch
                                        .MatchStatus.ACCEPTED
                        )
                        .isEmpty();

        if (!anotherHospitalReservation
                && !acceptedDonorMatch
                && bloodRequest.getStatus()
                == BloodRequest.Status.MATCHED) {

            bloodRequest.setStatus(
                    BloodRequest.Status.OPEN
            );

            bloodRequestRepository.save(
                    bloodRequest
            );
        }

        notificationService.createNotification(
                bloodRequest.getPatient(),
                Notification.NotificationType
                        .HOSPITAL_RESERVATION_RELEASED,
                "Hospital Reservation Released",
                hospitalProfile.getHospitalName()
                        + " released "
                        + unitsToRelease
                        + " unit(s) of "
                        + formatBloodGroup(
                        bloodRequest
                                .getBloodGroup()
                                .name()
                )
                        + " from your blood request.",
                bloodRequest.getId()
        );
    }

    // =========================================================
    // FULFILL RESERVATION
    // =========================================================

    @Transactional
    public void fulfillReservation(
            String authenticatedEmail,
            Long reservationId
    ) {
        HospitalProfile hospitalProfile =
                getHospitalProfileForHospitalUser(
                        authenticatedEmail
                );

        HospitalBloodReservation reservation =
                hospitalBloodReservationRepository
                        .findById(reservationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Hospital reservation not found"
                                )
                        );

        if (!reservation.getHospitalProfile()
                .getId()
                .equals(hospitalProfile.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to fulfill this reservation"
            );
        }

        if (reservation.getStatus()
                != HospitalBloodReservation
                .ReservationStatus.RESERVED) {

            throw new IllegalArgumentException(
                    "Only RESERVED reservations can be fulfilled"
            );
        }

        HospitalBloodInventory.BloodGroup inventoryBloodGroup =
                HospitalBloodInventory.BloodGroup.valueOf(
                        reservation
                                .getBloodGroup()
                                .name()
                );

        HospitalBloodInventory inventory =
                hospitalBloodInventoryRepository
                        .findForUpdate(
                                hospitalProfile.getId(),
                                inventoryBloodGroup
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood inventory record not found"
                                )
                        );

        int units =
                reservation.getUnitsReserved();

        if (units < 1) {
            throw new IllegalStateException(
                    "Reservation contains an invalid unit amount"
            );
        }

        if (inventory.getReservedUnits() < units) {
            throw new IllegalStateException(
                    "Reserved inventory is lower than the reservation amount"
            );
        }

        if (inventory.getAvailableUnits() < units) {
            throw new IllegalStateException(
                    "Available inventory is lower than the reservation amount"
            );
        }

        /*
         * Fulfillment consumes the blood.
         */
        inventory.setAvailableUnits(
                inventory.getAvailableUnits() - units
        );

        inventory.setReservedUnits(
                inventory.getReservedUnits() - units
        );

        reservation.setStatus(
                HospitalBloodReservation
                        .ReservationStatus.FULFILLED
        );

        reservation.setReleasedAt(
                LocalDateTime.now()
        );

        BloodRequest bloodRequest =
                reservation.getBloodRequest();

        bloodRequest.setStatus(
                BloodRequest.Status.FULFILLED
        );

        hospitalBloodInventoryRepository.save(
                inventory
        );

        hospitalBloodReservationRepository.save(
                reservation
        );

        bloodRequestRepository.save(
                bloodRequest
        );

        notificationService.createNotification(
                bloodRequest.getPatient(),
                Notification.NotificationType
                        .HOSPITAL_RESERVATION_FULFILLED,
                "Blood Request Fulfilled",
                hospitalProfile.getHospitalName()
                        + " fulfilled your blood request.",
                bloodRequest.getId()
        );
    }

    @Transactional
    public void cancelReservationsForRequest(Long requestId) {
        List<HospitalBloodReservation> reservations = hospitalBloodReservationRepository
                .findByBloodRequestIdOrderByCreatedAtDesc(requestId);
        for (HospitalBloodReservation reservation : reservations) {
            if (reservation.getStatus() != HospitalBloodReservation.ReservationStatus.RESERVED) continue;
            HospitalBloodInventory.BloodGroup group = HospitalBloodInventory.BloodGroup.valueOf(
                    reservation.getBloodGroup().name());
            HospitalBloodInventory inventory = hospitalBloodInventoryRepository
                    .findForUpdate(reservation.getHospitalProfile().getId(), group)
                    .orElseThrow(() -> new IllegalStateException("Reserved inventory not found"));
            if (inventory.getReservedUnits() < reservation.getUnitsReserved()) {
                throw new IllegalStateException("Reservation exceeds held inventory");
            }
            inventory.setReservedUnits(inventory.getReservedUnits() - reservation.getUnitsReserved());
            reservation.setStatus(HospitalBloodReservation.ReservationStatus.CANCELLED);
            reservation.setReleasedAt(LocalDateTime.now());
            hospitalBloodInventoryRepository.save(inventory);
            hospitalBloodReservationRepository.save(reservation);
        }
    }

    // =========================================================
    // ADMIN HOSPITAL VERIFICATION
    // =========================================================

    @Transactional(readOnly = true)
    public Page<HospitalProfileResponse> listUnverifiedHospitals(int page, int size) {
        return hospitalProfileRepository.findByVerifiedFalse(PageRequest.of(page, size))
                .map(this::toProfileResponse);
    }

    @Transactional
    public HospitalProfileResponse verifyHospital(
            String authenticatedEmail,
            Long hospitalProfileId
    ) {
        getAdminUser(authenticatedEmail);

        HospitalProfile hospitalProfile =
                hospitalProfileRepository
                        .findById(hospitalProfileId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Hospital profile not found"
                                )
                        );

        hospitalProfile.setVerified(true);

        HospitalProfile saved =
                hospitalProfileRepository.save(
                        hospitalProfile
                );

        return toProfileResponse(saved);
    }

    @Transactional
    public HospitalProfileResponse unverifyHospital(
            String authenticatedEmail,
            Long hospitalProfileId
    ) {
        getAdminUser(authenticatedEmail);

        HospitalProfile hospitalProfile =
                hospitalProfileRepository
                        .findById(hospitalProfileId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Hospital profile not found"
                                )
                        );

        hospitalProfile.setVerified(false);

        HospitalProfile saved =
                hospitalProfileRepository.save(
                        hospitalProfile
                );

        return toProfileResponse(saved);
    }

    // =========================================================
    // USER HELPERS
    // =========================================================

    private User getHospitalUser(
            String authenticatedEmail
    ) {
        User user =
                userRepository.findByEmail(
                        authenticatedEmail
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );

        if (user.getRole() != User.Role.HOSPITAL) {
            throw new IllegalArgumentException(
                    "Only hospital users can perform this operation"
            );
        }

        if (!Boolean.TRUE.equals(
                user.getActive()
        )) {
            throw new IllegalArgumentException(
                    "User account is inactive"
            );
        }

        return user;
    }

    private User getAdminUser(
            String authenticatedEmail
    ) {
        User user =
                userRepository.findByEmail(
                        authenticatedEmail
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );

        if (user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException(
                    "Only administrators can perform this operation"
            );
        }

        if (!Boolean.TRUE.equals(
                user.getActive()
        )) {
            throw new IllegalArgumentException(
                    "Administrator account is inactive"
            );
        }

        return user;
    }

    private HospitalProfile
    getHospitalProfileForHospitalUser(
            String authenticatedEmail
    ) {
        User user =
                getHospitalUser(authenticatedEmail);

        return hospitalProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Hospital profile not found"
                        )
                );
    }

    // =========================================================
    // BLOOD GROUP PARSING
    // =========================================================

    private HospitalBloodInventory.BloodGroup
    parseInventoryBloodGroup(
            String value
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Blood group is required"
            );
        }

        String normalized =
                value.trim()
                        .toUpperCase()
                        .replace(" ", "_");

        switch (normalized) {

            case "A+":
                normalized = "A_POSITIVE";
                break;

            case "A-":
                normalized = "A_NEGATIVE";
                break;

            case "B+":
                normalized = "B_POSITIVE";
                break;

            case "B-":
                normalized = "B_NEGATIVE";
                break;

            case "AB+":
                normalized = "AB_POSITIVE";
                break;

            case "AB-":
                normalized = "AB_NEGATIVE";
                break;

            case "O+":
                normalized = "O_POSITIVE";
                break;

            case "O-":
                normalized = "O_NEGATIVE";
                break;

            default:
                break;
        }

        try {
            return HospitalBloodInventory.BloodGroup
                    .valueOf(normalized);

        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Invalid blood group: " + value
            );
        }
    }

    // =========================================================
    // RESPONSE MAPPERS
    // =========================================================

    private HospitalProfileResponse
    toProfileResponse(
            HospitalProfile profile
    ) {
        return HospitalProfileResponse
                .builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .email(profile.getUser().getEmail())
                .hospitalName(
                        profile.getHospitalName()
                )
                .registrationNumber(
                        profile.getRegistrationNumber()
                )
                .address(
                        profile.getAddress()
                )
                .city(
                        profile.getCity()
                )
                .state(
                        profile.getState()
                )
                .phone(
                        profile.getPhone()
                )
                .verified(
                        profile.getVerified()
                )
                .build();
    }

    private HospitalBloodInventoryResponse
    toInventoryResponse(
            HospitalBloodInventory inventory
    ) {
        int availableUnits =
                inventory.getAvailableUnits();

        int reservedUnits =
                inventory.getReservedUnits();

        return HospitalBloodInventoryResponse
                .builder()
                .id(inventory.getId())
                .hospitalProfileId(
                        inventory
                                .getHospitalProfile()
                                .getId()
                )
                .hospitalName(
                        inventory
                                .getHospitalProfile()
                                .getHospitalName()
                )
                .bloodGroup(
                        inventory
                                .getBloodGroup()
                                .name()
                )
                .availableUnits(
                        availableUnits
                )
                .reservedUnits(
                        reservedUnits
                )
                .totalUnits(
                        availableUnits + reservedUnits
                )
                .updatedAt(
                        inventory.getUpdatedAt()
                )
                .build();
    }

    private HospitalBloodReservationResponse
    toReservationResponse(
            HospitalBloodReservation reservation
    ) {
        return HospitalBloodReservationResponse
                .builder()
                .id(
                        reservation.getId()
                )
                .bloodRequestId(
                        reservation
                                .getBloodRequest()
                                .getId()
                )
                .hospitalProfileId(
                        reservation
                                .getHospitalProfile()
                                .getId()
                )
                .hospitalName(
                        reservation
                                .getHospitalProfile()
                                .getHospitalName()
                )
                .bloodGroup(
                        reservation
                                .getBloodGroup()
                                .name()
                )
                .unitsReserved(
                        reservation
                                .getUnitsReserved()
                )
                .status(
                        reservation
                                .getStatus()
                )
                .createdAt(
                        reservation
                                .getCreatedAt()
                )
                .releasedAt(
                        reservation
                                .getReleasedAt()
                )
                .build();
    }

    // =========================================================
    // BLOOD GROUP DISPLAY
    // =========================================================

    private String formatBloodGroup(
            String bloodGroup
    ) {
        if (bloodGroup == null) {
            return "";
        }

        return bloodGroup
                .replace("_POSITIVE", "+")
                .replace("_NEGATIVE", "-");
    }
}