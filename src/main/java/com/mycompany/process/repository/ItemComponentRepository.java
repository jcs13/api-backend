package com.mycompany.process.repository;

import com.mycompany.process.domain.ItemComponent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ItemComponent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemComponentRepository extends JpaRepository<ItemComponent, Long> {}
