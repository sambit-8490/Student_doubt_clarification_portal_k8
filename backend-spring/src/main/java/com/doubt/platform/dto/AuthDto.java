package com.doubt.platform.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
        private String role;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private UserInfo user;

        @Data
        public static class UserInfo {
            private Long id;
            private String name;
            private String email;
            private String role;
            private String department;
        }
    }
}
