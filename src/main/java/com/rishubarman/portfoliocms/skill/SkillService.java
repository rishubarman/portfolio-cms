package com.rishubarman.portfoliocms.skill;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found with id: " + id
                        )
                );
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public Skill updateSkill(Long id, Skill updatedSkill) {

        Skill existingSkill = getSkillById(id);

        existingSkill.setName(updatedSkill.getName());
        existingSkill.setCategory(updatedSkill.getCategory());
        existingSkill.setIconUrl(updatedSkill.getIconUrl());
        existingSkill.setDisplayOrder(updatedSkill.getDisplayOrder());
        existingSkill.setPublished(updatedSkill.getPublished());

        return skillRepository.save(existingSkill);
    }

    public void deleteSkill(Long id) {
        Skill skill = getSkillById(id);
        skillRepository.delete(skill);
    }
}