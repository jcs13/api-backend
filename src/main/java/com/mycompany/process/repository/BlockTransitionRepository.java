package com.mycompany.process.repository;

import com.mycompany.process.domain.BlockTransition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BlockTransition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlockTransitionRepository extends JpaRepository<BlockTransition, Long> {}
