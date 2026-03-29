package com.skillsync.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CreatePostRequest {
    private String content;
    private String articleTitle;
    private String articleContent;
    private String codeSnippet;
    private String language;
    private List<String> tags;
}