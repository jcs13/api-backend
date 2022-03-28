package com.mycompany.process.repository;

import com.mycompany.process.domain.StepDefinition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the StepDefinition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StepDefinitionRepository extends JpaRepository<StepDefinition, Long> {}
