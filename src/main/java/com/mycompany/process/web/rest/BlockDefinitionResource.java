package com.mycompany.process.web.rest;

import com.mycompany.process.domain.BlockDefinition;
import com.mycompany.process.repository.BlockDefinitionRepository;
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
 * REST controller for managing {@link com.mycompany.process.domain.BlockDefinition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlockDefinitionResource {

    private final Logger log = LoggerFactory.getLogger(BlockDefinitionResource.class);

    private static final String ENTITY_NAME = "blockDefinition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlockDefinitionRepository blockDefinitionRepository;

    public BlockDefinitionResource(BlockDefinitionRepository blockDefinitionRepository) {
        this.blockDefinitionRepository = blockDefinitionRepository;
    }

    /**
     * {@code POST  /block-definitions} : Create a new blockDefinition.
     *
     * @param blockDefinition the blockDefinition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blockDefinition, or with status {@code 400 (Bad Request)} if the blockDefinition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/block-definitions")
    public ResponseEntity<BlockDefinition> createBlockDefinition(@Valid @RequestBody BlockDefinition blockDefinition)
        throws URISyntaxException {
        log.debug("REST request to save BlockDefinition : {}", blockDefinition);
        if (blockDefinition.getId() != null) {
            throw new BadRequestAlertException("A new blockDefinition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlockDefinition result = blockDefinitionRepository.save(blockDefinition);
        return ResponseEntity
            .created(new URI("/api/block-definitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /block-definitions/:id} : Updates an existing blockDefinition.
     *
     * @param id the id of the blockDefinition to save.
     * @param blockDefinition the blockDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blockDefinition,
     * or with status {@code 400 (Bad Request)} if the blockDefinition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blockDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/block-definitions/{id}")
    public ResponseEntity<BlockDefinition> updateBlockDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BlockDefinition blockDefinition
    ) throws URISyntaxException {
        log.debug("REST request to update BlockDefinition : {}, {}", id, blockDefinition);
        if (blockDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blockDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blockDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BlockDefinition result = blockDefinitionRepository.save(blockDefinition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blockDefinition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /block-definitions/:id} : Partial updates given fields of an existing blockDefinition, field will ignore if it is null
     *
     * @param id the id of the blockDefinition to save.
     * @param blockDefinition the blockDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blockDefinition,
     * or with status {@code 400 (Bad Request)} if the blockDefinition is not valid,
     * or with status {@code 404 (Not Found)} if the blockDefinition is not found,
     * or with status {@code 500 (Internal Server Error)} if the blockDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/block-definitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BlockDefinition> partialUpdateBlockDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BlockDefinition blockDefinition
    ) throws URISyntaxException {
        log.debug("REST request to partial update BlockDefinition partially : {}, {}", id, blockDefinition);
        if (blockDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blockDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blockDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BlockDefinition> result = blockDefinitionRepository
            .findById(blockDefinition.getId())
            .map(existingBlockDefinition -> {
                if (blockDefinition.getName() != null) {
                    existingBlockDefinition.setName(blockDefinition.getName());
                }
                if (blockDefinition.getLabel() != null) {
                    existingBlockDefinition.setLabel(blockDefinition.getLabel());
                }
                if (blockDefinition.getDisplay() != null) {
                    existingBlockDefinition.setDisplay(blockDefinition.getDisplay());
                }

                return existingBlockDefinition;
            })
            .map(blockDefinitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blockDefinition.getId().toString())
        );
    }

    /**
     * {@code GET  /block-definitions} : get all the blockDefinitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blockDefinitions in body.
     */
    @GetMapping("/block-definitions")
    public List<BlockDefinition> getAllBlockDefinitions() {
        log.debug("REST request to get all BlockDefinitions");
        return blockDefinitionRepository.findAll();
    }

    /**
     * {@code GET  /block-definitions/:id} : get the "id" blockDefinition.
     *
     * @param id the id of the blockDefinition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blockDefinition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/block-definitions/{id}")
    public ResponseEntity<BlockDefinition> getBlockDefinition(@PathVariable Long id) {
        log.debug("REST request to get BlockDefinition : {}", id);
        Optional<BlockDefinition> blockDefinition = blockDefinitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blockDefinition);
    }

    /**
     * {@code DELETE  /block-definitions/:id} : delete the "id" blockDefinition.
     *
     * @param id the id of the blockDefinition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/block-definitions/{id}")
    public ResponseEntity<Void> deleteBlockDefinition(@PathVariable Long id) {
        log.debug("REST request to delete BlockDefinition : {}", id);
        blockDefinitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
