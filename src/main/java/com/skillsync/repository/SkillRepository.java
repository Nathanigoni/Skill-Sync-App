package com.skillsync.repository;

import com.skillsync.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {
    List<Skill> findByUserId(String userId);
    List<Skill> findByUserIdAndVerifiedTrue(String userId);
    Optional<Skill> findByUserIdAndName(String userId, String name);
    void deleteByUserId(String userId);
}