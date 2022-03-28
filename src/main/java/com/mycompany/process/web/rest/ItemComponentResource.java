package com.mycompany.process.web.rest;

import com.mycompany.process.domain.ItemComponent;
import com.mycompany.process.repository.ItemComponentRepository;
import com.mycompany.process.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.mycompany.process.domain.ItemComponent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemComponentResource {

    private final Logger log = LoggerFactory.getLogger(ItemComponentResource.class);

    private static final String ENTITY_NAME = "itemComponent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemComponentRepository itemComponentRepository;

    public ItemComponentResource(ItemComponentRepository itemComponentRepository) {
        this.itemComponentRepository = itemComponentRepository;
    }

    /**
     * {@code POST  /item-components} : Create a new itemComponent.
     *
     * @param itemComponent the itemComponent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemComponent, or with status {@code 400 (Bad Request)} if the itemComponent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/item-components")
    public ResponseEntity<ItemComponent> createItemComponent(@Valid @RequestBody ItemComponent itemComponent) throws URISyntaxException {
        log.debug("REST request to save ItemComponent : {}", itemComponent);
        if (itemComponent.getId() != null) {
            throw new BadRequestAlertException("A new itemComponent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemComponent result = itemComponentRepository.save(itemComponent);
        return ResponseEntity
            .created(new URI("/api/item-components/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-components/:id} : Updates an existing itemComponent.
     *
     * @param id the id of the itemComponent to save.
     * @param itemComponent the itemComponent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemComponent,
     * or with status {@code 400 (Bad Request)} if the itemComponent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemComponent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/item-components/{id}")
    public ResponseEntity<ItemComponent> updateItemComponent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ItemComponent itemComponent
    ) throws URISyntaxException {
        log.debug("REST request to update ItemComponent : {}, {}", id, itemComponent);
        if (itemComponent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemComponent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemComponentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemComponent result = itemComponentRepository.save(itemComponent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itemComponent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-components/:id} : Partial updates given fields of an existing itemComponent, field will ignore if it is null
     *
     * @param id the id of the itemComponent to save.
     * @param itemComponent the itemComponent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemComponent,
     * or with status {@code 400 (Bad Request)} if the itemComponent is not valid,
     * or with status {@code 404 (Not Found)} if the itemComponent is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemComponent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/item-components/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemComponent> partialUpdateItemComponent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ItemComponent itemComponent
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemComponent partially : {}, {}", id, itemComponent);
        if (itemComponent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemComponent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemComponentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemComponent> result = itemComponentRepository
            .findById(itemComponent.getId())
            .map(existingItemComponent -> {
                if (itemComponent.getName() != null) {
                    existingItemComponent.setName(itemComponent.getName());
                }

                return existingItemComponent;
            })
            .map(itemComponentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itemComponent.getId().toString())
        );
    }

    /**
     * {@code GET  /item-components} : get all the itemComponents.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemComponents in body.
     */
    @GetMapping("/item-components")
    public List<ItemComponent> getAllItemComponents(@RequestParam(required = false) String filter) {
        if ("blockdefinition-is-null".equals(filter)) {
            log.debug("REST request to get all ItemComponents where blockDefinition is null");
            return StreamSupport
                .stream(itemComponentRepository.findAll().spliterator(), false)
                .filter(itemComponent -> itemComponent.getBlockDefinition() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all ItemComponents");
        return itemComponentRepository.findAll();
    }

    /**
     * {@code GET  /item-components/:id} : get the "id" itemComponent.
     *
     * @param id the id of the itemComponent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemComponent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/item-components/{id}")
    public ResponseEntity<ItemComponent> getItemComponent(@PathVariable Long id) {
        log.debug("REST request to get ItemComponent : {}", id);
        Optional<ItemComponent> itemComponent = itemComponentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemComponent);
    }

    /**
     * {@code DELETE  /item-components/:id} : delete the "id" itemComponent.
     *
     * @param id the id of the itemComponent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/item-components/{id}")
    public ResponseEntity<Void> deleteItemComponent(@PathVariable Long id) {
        log.debug("REST request to delete ItemComponent : {}", id);
        itemComponentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
