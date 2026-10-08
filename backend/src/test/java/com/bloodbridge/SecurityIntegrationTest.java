package com.bloodbridge;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // =========================================================
    // PUBLIC ENDPOINTS
    // =========================================================

    @Test
    void healthEndpointShouldBePublic() throws Exception {

        mockMvc.perform(
                get("/actuator/health")
        )
        .andExpect(status().isOk());
    }

    @Test
    void loginEndpointShouldBePublic() throws Exception {

        mockMvc.perform(
                org.springframework.test.web.servlet.request
                        .MockMvcRequestBuilders
                        .post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {
                                    "email": "invalid@example.com",
                                    "password": "wrongpassword"
                                }
                                """)
        )
        .andExpect(result -> {

            int status =
                    result.getResponse().getStatus();

            /*
             * Invalid credentials are expected.
             *
             * What must NOT happen is Spring Security rejecting
             * the endpoint with an authorization 403 before the
             * AuthService receives the request.
             */
            if (status == 403) {
                throw new AssertionError(
                        "Login endpoint must be publicly accessible"
                );
            }
        });
    }

    // =========================================================
    // UNAUTHENTICATED ACCESS
    // =========================================================

    /*
     * This application currently returns 403 for anonymous
     * requests to protected endpoints.
     */

    @Test
    void protectedBloodRequestEndpointShouldRejectAnonymousUser()
            throws Exception {

        mockMvc.perform(
                get("/api/blood-requests/my")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void protectedDonorEndpointShouldRejectAnonymousUser()
            throws Exception {

        mockMvc.perform(
                get("/api/donor/matches")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void protectedHospitalEndpointShouldRejectAnonymousUser()
            throws Exception {

        mockMvc.perform(
                get("/api/hospital/profile")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void protectedAdminEndpointShouldRejectAnonymousUser()
            throws Exception {

        mockMvc.perform(
                patch("/api/admin/hospitals/1/verify")
        )
        .andExpect(status().isForbidden());
    }

    // =========================================================
    // PATIENT ROLE
    // =========================================================

    @Test
    @WithMockUser(
            username = "test-patient",
            roles = "PATIENT"
    )
    void patientIsAuthorizedForBloodRequests()
            throws Exception {

        mockMvc.perform(
                get("/api/blood-requests/my")
        )
        .andExpect(result -> {

            int status =
                    result.getResponse().getStatus();

            /*
             * Authorization succeeded if we don't receive 401/403.
             *
             * The controller may return 400 because this mocked
             * username does not exist in the application database.
             */
            if (status == 401 || status == 403) {
                throw new AssertionError(
                        "PATIENT should be authorized for blood requests"
                );
            }
        });
    }

    @Test
    @WithMockUser(
            username = "test-patient",
            roles = "PATIENT"
    )
    void patientCannotAccessDonorOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/donor/matches")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-patient",
            roles = "PATIENT"
    )
    void patientCannotAccessHospitalOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/hospital/profile")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-patient",
            roles = "PATIENT"
    )
    void patientCannotAccessAdminOperations()
            throws Exception {

        mockMvc.perform(
                patch("/api/admin/hospitals/1/verify")
        )
        .andExpect(status().isForbidden());
    }

    // =========================================================
    // DONOR ROLE
    // =========================================================

    @Test
    @WithMockUser(
            username = "test-donor",
            roles = "DONOR"
    )
    void donorIsAuthorizedForDonorOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/donor/matches")
        )
        .andExpect(result -> {

            int status =
                    result.getResponse().getStatus();

            if (status == 401 || status == 403) {
                throw new AssertionError(
                        "DONOR should be authorized for donor operations"
                );
            }
        });
    }

    @Test
    @WithMockUser(
            username = "test-donor",
            roles = "DONOR"
    )
    void donorCannotAccessPatientBloodRequests()
            throws Exception {

        mockMvc.perform(
                get("/api/blood-requests/my")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-donor",
            roles = "DONOR"
    )
    void donorCannotAccessHospitalOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/hospital/profile")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-donor",
            roles = "DONOR"
    )
    void donorCannotAccessAdminOperations()
            throws Exception {

        mockMvc.perform(
                patch("/api/admin/hospitals/1/verify")
        )
        .andExpect(status().isForbidden());
    }

    // =========================================================
    // HOSPITAL ROLE
    // =========================================================

    @Test
    @WithMockUser(
            username = "test-hospital",
            roles = "HOSPITAL"
    )
    void hospitalIsAuthorizedForHospitalOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/hospital/profile")
        )
        .andExpect(result -> {

            int status =
                    result.getResponse().getStatus();

            if (status == 401 || status == 403) {
                throw new AssertionError(
                        "HOSPITAL should be authorized for hospital operations"
                );
            }
        });
    }

    @Test
    @WithMockUser(
            username = "test-hospital",
            roles = "HOSPITAL"
    )
    void hospitalCannotAccessPatientBloodRequests()
            throws Exception {

        mockMvc.perform(
                get("/api/blood-requests/my")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-hospital",
            roles = "HOSPITAL"
    )
    void hospitalCannotAccessDonorOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/donor/matches")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-hospital",
            roles = "HOSPITAL"
    )
    void hospitalCannotAccessAdminOperations()
            throws Exception {

        mockMvc.perform(
                patch("/api/admin/hospitals/1/verify")
        )
        .andExpect(status().isForbidden());
    }

    // =========================================================
    // ADMIN ROLE
    // =========================================================

    @Test
    @WithMockUser(
            username = "test-admin",
            roles = "ADMIN"
    )
    void adminIsAuthorizedForAdminOperations()
            throws Exception {

        mockMvc.perform(
                patch("/api/admin/hospitals/1/verify")
        )
        .andExpect(result -> {

            int status =
                    result.getResponse().getStatus();

            /*
             * The endpoint may return 400/404 because hospital
             * profile 1 may not exist and the mocked username
             * does not exist in the database.
             *
             * 401/403 would indicate an authorization problem.
             */
            if (status == 401 || status == 403) {
                throw new AssertionError(
                        "ADMIN should be authorized for admin operations"
                );
            }
        });
    }

    @Test
    @WithMockUser(
            username = "test-admin",
            roles = "ADMIN"
    )
    void adminCannotAccessPatientBloodRequests()
            throws Exception {

        mockMvc.perform(
                get("/api/blood-requests/my")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-admin",
            roles = "ADMIN"
    )
    void adminCannotAccessDonorOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/donor/matches")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "test-admin",
            roles = "ADMIN"
    )
    void adminCannotAccessHospitalOperations()
            throws Exception {

        mockMvc.perform(
                get("/api/hospital/profile")
        )
        .andExpect(status().isForbidden());
    }

    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    @Test
    @WithMockUser(
            username = "test-user",
            roles = "PATIENT"
    )
    void authenticatedUserIsAuthorizedForNotifications()
            throws Exception {

        mockMvc.perform(
                get("/api/notifications")
        )
        .andExpect(result -> {

            int status =
                    result.getResponse().getStatus();

            if (status == 401 || status == 403) {
                throw new AssertionError(
                        "Authenticated users should be authorized for notifications"
                );
            }
        });
    }

    // =========================================================
    // UNKNOWN ENDPOINT
    // =========================================================

    @Test
    void anonymousUserCannotAccessUnknownProtectedEndpoint()
            throws Exception {

        mockMvc.perform(
                get("/api/does-not-exist")
        )
        .andExpect(status().isForbidden());
    }
}