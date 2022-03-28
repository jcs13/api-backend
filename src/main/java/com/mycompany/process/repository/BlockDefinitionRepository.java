package com.mycompany.process.repository;

import com.mycompany.process.domain.BlockDefinition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BlockDefinition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlockDefinitionRepository extends JpaRepository<BlockDefinition, Long> {}
