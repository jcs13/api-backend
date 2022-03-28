package com.mycompany.process.web.rest;

import com.mycompany.process.domain.OfferComposition;
import com.mycompany.process.repository.OfferCompositionRepository;
import com.mycompany.process.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.process.domain.OfferComposition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OfferCompositionResource {

    private final Logger log = LoggerFactory.getLogger(OfferCompositionResource.class);

    private static final String ENTITY_NAME = "offerComposition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OfferCompositionRepository offerCompositionRepository;

    public OfferCompositionResource(OfferCompositionRepository offerCompositionRepository) {
        this.offerCompositionRepository = offerCompositionRepository;
    }

    /**
     * {@code POST  /offer-compositions} : Create a new offerComposition.
     *
     * @param offerComposition the offerComposition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offerComposition, or with status {@code 400 (Bad Request)} if the offerComposition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offer-compositions")
    public ResponseEntity<OfferComposition> createOfferComposition(@Valid @RequestBody OfferComposition offerComposition)
        throws URISyntaxException {
        log.debug("REST request to save OfferComposition : {}", offerComposition);
        if (offerComposition.getId() != null) {
            throw new BadRequestAlertException("A new offerComposition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OfferComposition result = offerCompositionRepository.save(offerComposition);
        return ResponseEntity
            .created(new URI("/api/offer-compositions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offer-compositions/:id} : Updates an existing offerComposition.
     *
     * @param id the id of the offerComposition to save.
     * @param offerComposition the offerComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offerComposition,
     * or with status {@code 400 (Bad Request)} if the offerComposition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offerComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offer-compositions/{id}")
    public ResponseEntity<OfferComposition> updateOfferComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OfferComposition offerComposition
    ) throws URISyntaxException {
        log.debug("REST request to update OfferComposition : {}, {}", id, offerComposition);
        if (offerComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offerComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offerCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OfferComposition result = offerCompositionRepository.save(offerComposition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, offerComposition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /offer-compositions/:id} : Partial updates given fields of an existing offerComposition, field will ignore if it is null
     *
     * @param id the id of the offerComposition to save.
     * @param offerComposition the offerComposition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offerComposition,
     * or with status {@code 400 (Bad Request)} if the offerComposition is not valid,
     * or with status {@code 404 (Not Found)} if the offerComposition is not found,
     * or with status {@code 500 (Internal Server Error)} if the offerComposition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offer-compositions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OfferComposition> partialUpdateOfferComposition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OfferComposition offerComposition
    ) throws URISyntaxException {
        log.debug("REST request to partial update OfferComposition partially : {}, {}", id, offerComposition);
        if (offerComposition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offerComposition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offerCompositionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OfferComposition> result = offerCompositionRepository
            .findById(offerComposition.getId())
            .map(existingOfferComposition -> {
                if (offerComposition.getInheritanceOrder() != null) {
                    existingOfferComposition.setInheritanceOrder(offerComposition.getInheritanceOrder());
                }

                return existingOfferComposition;
            })
            .map(offerCompositionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, offerComposition.getId().toString())
        );
    }

    /**
     * {@code GET  /offer-compositions} : get all the offerCompositions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offerCompositions in body.
     */
    @GetMapping("/offer-compositions")
    public List<OfferComposition> getAllOfferCompositions() {
        log.debug("REST request to get all OfferCompositions");
        return offerCompositionRepository.findAll();
    }

    /**
     * {@code GET  /offer-compositions/:id} : get the "id" offerComposition.
     *
     * @param id the id of the offerComposition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offerComposition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offer-compositions/{id}")
    public ResponseEntity<OfferComposition> getOfferComposition(@PathVariable Long id) {
        log.debug("REST request to get OfferComposition : {}", id);
        Optional<OfferComposition> offerComposition = offerCompositionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(offerComposition);
    }

    /**
     * {@code DELETE  /offer-compositions/:id} : delete the "id" offerComposition.
     *
     * @param id the id of the offerComposition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offer-compositions/{id}")
    public ResponseEntity<Void> deleteOfferComposition(@PathVariable Long id) {
        log.debug("REST request to delete OfferComposition : {}", id);
        offerCompositionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
