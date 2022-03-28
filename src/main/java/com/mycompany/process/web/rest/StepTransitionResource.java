package com.mycompany.process.web.rest;

import com.mycompany.process.domain.StepTransition;
import com.mycompany.process.repository.StepTransitionRepository;
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
 * REST controller for managing {@link com.mycompany.process.domain.StepTransition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StepTransitionResource {

    private final Logger log = LoggerFactory.getLogger(StepTransitionResource.class);

    private static final String ENTITY_NAME = "stepTransition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StepTransitionRepository stepTransitionRepository;

    public StepTransitionResource(StepTransitionRepository stepTransitionRepository) {
        this.stepTransitionRepository = stepTransitionRepository;
    }

    /**
     * {@code POST  /step-transitions} : Create a new stepTransition.
     *
     * @param stepTransition the stepTransition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stepTransition, or with status {@code 400 (Bad Request)} if the stepTransition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/step-transitions")
    public ResponseEntity<StepTransition> createStepTransition(@Valid @RequestBody StepTransition stepTransition)
        throws URISyntaxException {
        log.debug("REST request to save StepTransition : {}", stepTransition);
        if (stepTransition.getId() != null) {
            throw new BadRequestAlertException("A new stepTransition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StepTransition result = stepTransitionRepository.save(stepTransition);
        return ResponseEntity
            .created(new URI("/api/step-transitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /step-transitions/:id} : Updates an existing stepTransition.
     *
     * @param id the id of the stepTransition to save.
     * @param stepTransition the stepTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stepTransition,
     * or with status {@code 400 (Bad Request)} if the stepTransition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stepTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/step-transitions/{id}")
    public ResponseEntity<StepTransition> updateStepTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StepTransition stepTransition
    ) throws URISyntaxException {
        log.debug("REST request to update StepTransition : {}, {}", id, stepTransition);
        if (stepTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stepTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stepTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StepTransition result = stepTransitionRepository.save(stepTransition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stepTransition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /step-transitions/:id} : Partial updates given fields of an existing stepTransition, field will ignore if it is null
     *
     * @param id the id of the stepTransition to save.
     * @param stepTransition the stepTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stepTransition,
     * or with status {@code 400 (Bad Request)} if the stepTransition is not valid,
     * or with status {@code 404 (Not Found)} if the stepTransition is not found,
     * or with status {@code 500 (Internal Server Error)} if the stepTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/step-transitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StepTransition> partialUpdateStepTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StepTransition stepTransition
    ) throws URISyntaxException {
        log.debug("REST request to partial update StepTransition partially : {}, {}", id, stepTransition);
        if (stepTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stepTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stepTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StepTransition> result = stepTransitionRepository
            .findById(stepTransition.getId())
            .map(existingStepTransition -> {
                if (stepTransition.getTransition() != null) {
                    existingStepTransition.setTransition(stepTransition.getTransition());
                }

                return existingStepTransition;
            })
            .map(stepTransitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stepTransition.getId().toString())
        );
    }

    /**
     * {@code GET  /step-transitions} : get all the stepTransitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stepTransitions in body.
     */
    @GetMapping("/step-transitions")
    public List<StepTransition> getAllStepTransitions() {
        log.debug("REST request to get all StepTransitions");
        return stepTransitionRepository.findAll();
    }

    /**
     * {@code GET  /step-transitions/:id} : get the "id" stepTransition.
     *
     * @param id the id of the stepTransition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stepTransition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/step-transitions/{id}")
    public ResponseEntity<StepTransition> getStepTransition(@PathVariable Long id) {
        log.debug("REST request to get StepTransition : {}", id);
        Optional<StepTransition> stepTransition = stepTransitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stepTransition);
    }

    /**
     * {@code DELETE  /step-transitions/:id} : delete the "id" stepTransition.
     *
     * @param id the id of the stepTransition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/step-transitions/{id}")
    public ResponseEntity<Void> deleteStepTransition(@PathVariable Long id) {
        log.debug("REST request to delete StepTransition : {}", id);
        stepTransitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
