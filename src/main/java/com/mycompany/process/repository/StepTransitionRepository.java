package com.mycompany.process.repository;

import com.mycompany.process.domain.StepTransition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the StepTransition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StepTransitionRepository extends JpaRepository<StepTransition, Long> {}
