package com.skillsync.service;

import com.skillsync.dto.response.AnalyticsResponse;
import com.skillsync.model.AnalyticsEvent;
import com.skillsync.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map; // Add this import
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;

    public AnalyticsResponse getUserAnalytics(String userId, int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);

        List<AnalyticsEvent> userEvents = analyticsEventRepository.findByUserIdAndTimestampAfter(userId, since);

        long profileViews = userEvents.stream()
                .filter(event -> "PROFILE_VIEW".equals(event.getEventType()))
                .count();

        long projectViews = userEvents.stream()
                .filter(event -> "PROJECT_VIEW".equals(event.getEventType()))
                .count();

        long projectClicks = userEvents.stream()
                .filter(event -> "PROJECT_CLICK".equals(event.getEventType()))
                .count();

        long totalVisitors = userEvents.stream()
                .map(AnalyticsEvent::getIpAddress)
                .distinct()
                .count();

        return AnalyticsResponse.builder()
                .profileViews(profileViews)
                .projectViews(projectViews)
                .projectClicks(projectClicks)
                .totalVisitors(totalVisitors)
                .build();
    }

    public void trackProfileView(String userId, String ipAddress) {
        AnalyticsEvent event = AnalyticsEvent.builder()
                .userId(userId)
                .eventType("PROFILE_VIEW")
                .ipAddress(ipAddress)
                .timestamp(LocalDateTime.now())
                .build();
        analyticsEventRepository.save(event);
    }

    public void trackProjectView(String userId, String projectId, String ipAddress) {
        AnalyticsEvent event = AnalyticsEvent.builder()
                .userId(userId)
                .projectId(projectId)
                .eventType("PROJECT_VIEW")
                .ipAddress(ipAddress)
                .timestamp(LocalDateTime.now())
                .build();
        analyticsEventRepository.save(event);
    }

    public void trackProjectClick(String userId, String projectId, String clickType) {
        AnalyticsEvent event = AnalyticsEvent.builder()
                .userId(userId)
                .projectId(projectId)
                .eventType("PROJECT_CLICK")
                .metadata(Map.of("clickType", clickType))
                .timestamp(LocalDateTime.now())
                .build();
        analyticsEventRepository.save(event);
    }
}