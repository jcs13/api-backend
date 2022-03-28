package com.mycompany.process.repository;

import com.mycompany.process.domain.CourseDefinition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CourseDefinition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseDefinitionRepository extends JpaRepository<CourseDefinition, Long> {}
