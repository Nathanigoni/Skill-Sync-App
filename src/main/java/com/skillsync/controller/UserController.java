    package com.skillsync.controller;

    import com.skillsync.dto.request.ProfileUpdateRequest;
    import com.skillsync.dto.response.ApiResponse;
    import com.skillsync.dto.response.UserResponse;
    import com.skillsync.service.UserService;
    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/users")
    public class UserController {

        @Autowired
        private UserService userService;

        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
            UserResponse user = userService.getCurrentUser();
            return ResponseEntity.ok(ApiResponse.success(user));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user));
        }

        @PutMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
                @Valid @RequestBody ProfileUpdateRequest request) {
            UserResponse user = userService.updateProfile(request);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", user));
        }
    }