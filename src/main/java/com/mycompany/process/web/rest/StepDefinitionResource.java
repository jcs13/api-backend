package com.mycompany.process.web.rest;

import com.mycompany.process.domain.StepDefinition;
import com.mycompany.process.repository.StepDefinitionRepository;
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
 * REST controller for managing {@link com.mycompany.process.domain.StepDefinition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StepDefinitionResource {

    private final Logger log = LoggerFactory.getLogger(StepDefinitionResource.class);

    private static final String ENTITY_NAME = "stepDefinition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StepDefinitionRepository stepDefinitionRepository;

    public StepDefinitionResource(StepDefinitionRepository stepDefinitionRepository) {
        this.stepDefinitionRepository = stepDefinitionRepository;
    }

    /**
     * {@code POST  /step-definitions} : Create a new stepDefinition.
     *
     * @param stepDefinition the stepDefinition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stepDefinition, or with status {@code 400 (Bad Request)} if the stepDefinition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/step-definitions")
    public ResponseEntity<StepDefinition> createStepDefinition(@Valid @RequestBody StepDefinition stepDefinition)
        throws URISyntaxException {
        log.debug("REST request to save StepDefinition : {}", stepDefinition);
        if (stepDefinition.getId() != null) {
            throw new BadRequestAlertException("A new stepDefinition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StepDefinition result = stepDefinitionRepository.save(stepDefinition);
        return ResponseEntity
            .created(new URI("/api/step-definitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /step-definitions/:id} : Updates an existing stepDefinition.
     *
     * @param id the id of the stepDefinition to save.
     * @param stepDefinition the stepDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stepDefinition,
     * or with status {@code 400 (Bad Request)} if the stepDefinition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stepDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/step-definitions/{id}")
    public ResponseEntity<StepDefinition> updateStepDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StepDefinition stepDefinition
    ) throws URISyntaxException {
        log.debug("REST request to update StepDefinition : {}, {}", id, stepDefinition);
        if (stepDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stepDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stepDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StepDefinition result = stepDefinitionRepository.save(stepDefinition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stepDefinition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /step-definitions/:id} : Partial updates given fields of an existing stepDefinition, field will ignore if it is null
     *
     * @param id the id of the stepDefinition to save.
     * @param stepDefinition the stepDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stepDefinition,
     * or with status {@code 400 (Bad Request)} if the stepDefinition is not valid,
     * or with status {@code 404 (Not Found)} if the stepDefinition is not found,
     * or with status {@code 500 (Internal Server Error)} if the stepDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/step-definitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StepDefinition> partialUpdateStepDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StepDefinition stepDefinition
    ) throws URISyntaxException {
        log.debug("REST request to partial update StepDefinition partially : {}, {}", id, stepDefinition);
        if (stepDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stepDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stepDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StepDefinition> result = stepDefinitionRepository
            .findById(stepDefinition.getId())
            .map(existingStepDefinition -> {
                if (stepDefinition.getName() != null) {
                    existingStepDefinition.setName(stepDefinition.getName());
                }
                if (stepDefinition.getLabel() != null) {
                    existingStepDefinition.setLabel(stepDefinition.getLabel());
                }
                if (stepDefinition.getDisplay() != null) {
                    existingStepDefinition.setDisplay(stepDefinition.getDisplay());
                }

                return existingStepDefinition;
            })
            .map(stepDefinitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stepDefinition.getId().toString())
        );
    }

    /**
     * {@code GET  /step-definitions} : get all the stepDefinitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stepDefinitions in body.
     */
    @GetMapping("/step-definitions")
    public List<StepDefinition> getAllStepDefinitions() {
        log.debug("REST request to get all StepDefinitions");
        return stepDefinitionRepository.findAll();
    }

    /**
     * {@code GET  /step-definitions/:id} : get the "id" stepDefinition.
     *
     * @param id the id of the stepDefinition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stepDefinition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/step-definitions/{id}")
    public ResponseEntity<StepDefinition> getStepDefinition(@PathVariable Long id) {
        log.debug("REST request to get StepDefinition : {}", id);
        Optional<StepDefinition> stepDefinition = stepDefinitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stepDefinition);
    }

    /**
     * {@code DELETE  /step-definitions/:id} : delete the "id" stepDefinition.
     *
     * @param id the id of the stepDefinition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/step-definitions/{id}")
    public ResponseEntity<Void> deleteStepDefinition(@PathVariable Long id) {
        log.debug("REST request to delete StepDefinition : {}", id);
        stepDefinitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
