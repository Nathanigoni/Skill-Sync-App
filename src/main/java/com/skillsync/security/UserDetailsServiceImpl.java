package com.skillsync.security;

import com.skillsync.model.User;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username can be either email (from login) or userId (from JWT)
        User user;

        if (username.contains("@")) {
            // It's an email - used during login
            user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        } else {
            // It's a user ID - used during JWT authentication
            user = userRepository.findById(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + username));
        }

        return UserPrincipal.create(user);
    }
}