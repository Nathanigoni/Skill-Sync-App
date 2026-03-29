package com.skillsync.service;

import com.skillsync.model.Skill;
import com.skillsync.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> getUserSkills(String userId) {
        return skillRepository.findByUserId(userId);
    }

    public List<Skill> getUserVerifiedSkills(String userId) {
        return skillRepository.findByUserIdAndVerifiedTrue(userId);
    }

    public Skill verifySkill(String skillId, String userId, boolean verified) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to modify this skill");
        }

        skill.setVerified(verified);
        return skillRepository.save(skill);
    }

    public void deleteSkill(String skillId, String userId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this skill");
        }

        skillRepository.delete(skill);
    }
}