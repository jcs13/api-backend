package com.mycompany.process.web.rest;

import com.mycompany.process.domain.BlockTransition;
import com.mycompany.process.repository.BlockTransitionRepository;
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
 * REST controller for managing {@link com.mycompany.process.domain.BlockTransition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlockTransitionResource {

    private final Logger log = LoggerFactory.getLogger(BlockTransitionResource.class);

    private static final String ENTITY_NAME = "blockTransition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlockTransitionRepository blockTransitionRepository;

    public BlockTransitionResource(BlockTransitionRepository blockTransitionRepository) {
        this.blockTransitionRepository = blockTransitionRepository;
    }

    /**
     * {@code POST  /block-transitions} : Create a new blockTransition.
     *
     * @param blockTransition the blockTransition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blockTransition, or with status {@code 400 (Bad Request)} if the blockTransition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/block-transitions")
    public ResponseEntity<BlockTransition> createBlockTransition(@Valid @RequestBody BlockTransition blockTransition)
        throws URISyntaxException {
        log.debug("REST request to save BlockTransition : {}", blockTransition);
        if (blockTransition.getId() != null) {
            throw new BadRequestAlertException("A new blockTransition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlockTransition result = blockTransitionRepository.save(blockTransition);
        return ResponseEntity
            .created(new URI("/api/block-transitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /block-transitions/:id} : Updates an existing blockTransition.
     *
     * @param id the id of the blockTransition to save.
     * @param blockTransition the blockTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blockTransition,
     * or with status {@code 400 (Bad Request)} if the blockTransition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blockTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/block-transitions/{id}")
    public ResponseEntity<BlockTransition> updateBlockTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BlockTransition blockTransition
    ) throws URISyntaxException {
        log.debug("REST request to update BlockTransition : {}, {}", id, blockTransition);
        if (blockTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blockTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blockTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BlockTransition result = blockTransitionRepository.save(blockTransition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blockTransition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /block-transitions/:id} : Partial updates given fields of an existing blockTransition, field will ignore if it is null
     *
     * @param id the id of the blockTransition to save.
     * @param blockTransition the blockTransition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blockTransition,
     * or with status {@code 400 (Bad Request)} if the blockTransition is not valid,
     * or with status {@code 404 (Not Found)} if the blockTransition is not found,
     * or with status {@code 500 (Internal Server Error)} if the blockTransition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/block-transitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BlockTransition> partialUpdateBlockTransition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BlockTransition blockTransition
    ) throws URISyntaxException {
        log.debug("REST request to partial update BlockTransition partially : {}, {}", id, blockTransition);
        if (blockTransition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blockTransition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blockTransitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BlockTransition> result = blockTransitionRepository
            .findById(blockTransition.getId())
            .map(existingBlockTransition -> {
                if (blockTransition.getTransition() != null) {
                    existingBlockTransition.setTransition(blockTransition.getTransition());
                }

                return existingBlockTransition;
            })
            .map(blockTransitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, blockTransition.getId().toString())
        );
    }

    /**
     * {@code GET  /block-transitions} : get all the blockTransitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blockTransitions in body.
     */
    @GetMapping("/block-transitions")
    public List<BlockTransition> getAllBlockTransitions() {
        log.debug("REST request to get all BlockTransitions");
        return blockTransitionRepository.findAll();
    }

    /**
     * {@code GET  /block-transitions/:id} : get the "id" blockTransition.
     *
     * @param id the id of the blockTransition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blockTransition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/block-transitions/{id}")
    public ResponseEntity<BlockTransition> getBlockTransition(@PathVariable Long id) {
        log.debug("REST request to get BlockTransition : {}", id);
        Optional<BlockTransition> blockTransition = blockTransitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blockTransition);
    }

    /**
     * {@code DELETE  /block-transitions/:id} : delete the "id" blockTransition.
     *
     * @param id the id of the blockTransition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/block-transitions/{id}")
    public ResponseEntity<Void> deleteBlockTransition(@PathVariable Long id) {
        log.debug("REST request to delete BlockTransition : {}", id);
        blockTransitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
