package com.skillsync.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsResponse {
    private Long profileViews;
    private Long projectViews;
    private Long projectClicks;
    private Long totalVisitors;
}