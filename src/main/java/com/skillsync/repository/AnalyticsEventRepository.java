package com.skillsync.repository;

import com.skillsync.model.AnalyticsEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsEventRepository extends MongoRepository<AnalyticsEvent, String> {
    List<AnalyticsEvent> findByUserIdAndTimestampAfter(String userId, LocalDateTime startDate);

    @Query(value = "{'userId': ?0, 'timestamp': {$gte: ?1}}", fields = "{'ipAddress': 1}")
    List<AnalyticsEvent> findDistinctIpAddressesByUserIdAndTimestampAfter(String userId, LocalDateTime startDate);

    default long countUniqueVisitors(String userId, LocalDateTime startDate) {
        return findDistinctIpAddressesByUserIdAndTimestampAfter(userId, startDate)
                .stream()
                .map(AnalyticsEvent::getIpAddress)
                .distinct()
                .count();
    }
}