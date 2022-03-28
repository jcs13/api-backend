package com.mycompany.process.repository;

import com.mycompany.process.domain.OfferComposition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OfferComposition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OfferCompositionRepository extends JpaRepository<OfferComposition, Long> {}
