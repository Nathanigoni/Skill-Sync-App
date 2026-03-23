package com.skillsync.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

// FIX 2: Removed the duplicate addResourceHandlers override that was conflicting
// with WebConfig.java. WebClientConfig now only does what its name says:
// provide the WebClient bean. WebConfig.java remains the single place that
// maps /api/images/** to the upload directory.
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}
