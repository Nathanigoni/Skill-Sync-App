package com.skillsync.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@Document(collection = "analytics_events")
public class AnalyticsEvent {
    @Id
    private String id;
    private String userId;
    private String projectId;
    private String eventType;
    private String ipAddress;
    private Map<String, Object> metadata;
    private LocalDateTime timestamp;
}