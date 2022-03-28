package com.mycompany.process.web.rest;

import com.mycompany.process.domain.CourseDefinition;
import com.mycompany.process.repository.CourseDefinitionRepository;
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
 * REST controller for managing {@link com.mycompany.process.domain.CourseDefinition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CourseDefinitionResource {

    private final Logger log = LoggerFactory.getLogger(CourseDefinitionResource.class);

    private static final String ENTITY_NAME = "courseDefinition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseDefinitionRepository courseDefinitionRepository;

    public CourseDefinitionResource(CourseDefinitionRepository courseDefinitionRepository) {
        this.courseDefinitionRepository = courseDefinitionRepository;
    }

    /**
     * {@code POST  /course-definitions} : Create a new courseDefinition.
     *
     * @param courseDefinition the courseDefinition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courseDefinition, or with status {@code 400 (Bad Request)} if the courseDefinition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/course-definitions")
    public ResponseEntity<CourseDefinition> createCourseDefinition(@Valid @RequestBody CourseDefinition courseDefinition)
        throws URISyntaxException {
        log.debug("REST request to save CourseDefinition : {}", courseDefinition);
        if (courseDefinition.getId() != null) {
            throw new BadRequestAlertException("A new courseDefinition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CourseDefinition result = courseDefinitionRepository.save(courseDefinition);
        return ResponseEntity
            .created(new URI("/api/course-definitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /course-definitions/:id} : Updates an existing courseDefinition.
     *
     * @param id the id of the courseDefinition to save.
     * @param courseDefinition the courseDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseDefinition,
     * or with status {@code 400 (Bad Request)} if the courseDefinition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courseDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/course-definitions/{id}")
    public ResponseEntity<CourseDefinition> updateCourseDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CourseDefinition courseDefinition
    ) throws URISyntaxException {
        log.debug("REST request to update CourseDefinition : {}, {}", id, courseDefinition);
        if (courseDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CourseDefinition result = courseDefinitionRepository.save(courseDefinition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, courseDefinition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /course-definitions/:id} : Partial updates given fields of an existing courseDefinition, field will ignore if it is null
     *
     * @param id the id of the courseDefinition to save.
     * @param courseDefinition the courseDefinition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseDefinition,
     * or with status {@code 400 (Bad Request)} if the courseDefinition is not valid,
     * or with status {@code 404 (Not Found)} if the courseDefinition is not found,
     * or with status {@code 500 (Internal Server Error)} if the courseDefinition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/course-definitions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CourseDefinition> partialUpdateCourseDefinition(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CourseDefinition courseDefinition
    ) throws URISyntaxException {
        log.debug("REST request to partial update CourseDefinition partially : {}, {}", id, courseDefinition);
        if (courseDefinition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseDefinition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseDefinitionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CourseDefinition> result = courseDefinitionRepository
            .findById(courseDefinition.getId())
            .map(existingCourseDefinition -> {
                if (courseDefinition.getName() != null) {
                    existingCourseDefinition.setName(courseDefinition.getName());
                }
                if (courseDefinition.getLabel() != null) {
                    existingCourseDefinition.setLabel(courseDefinition.getLabel());
                }

                return existingCourseDefinition;
            })
            .map(courseDefinitionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, courseDefinition.getId().toString())
        );
    }

    /**
     * {@code GET  /course-definitions} : get all the courseDefinitions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courseDefinitions in body.
     */
    @GetMapping("/course-definitions")
    public List<CourseDefinition> getAllCourseDefinitions() {
        log.debug("REST request to get all CourseDefinitions");
        return courseDefinitionRepository.findAll();
    }

    /**
     * {@code GET  /course-definitions/:id} : get the "id" courseDefinition.
     *
     * @param id the id of the courseDefinition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courseDefinition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/course-definitions/{id}")
    public ResponseEntity<CourseDefinition> getCourseDefinition(@PathVariable Long id) {
        log.debug("REST request to get CourseDefinition : {}", id);
        Optional<CourseDefinition> courseDefinition = courseDefinitionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(courseDefinition);
    }

    /**
     * {@code DELETE  /course-definitions/:id} : delete the "id" courseDefinition.
     *
     * @param id the id of the courseDefinition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/course-definitions/{id}")
    public ResponseEntity<Void> deleteCourseDefinition(@PathVariable Long id) {
        log.debug("REST request to delete CourseDefinition : {}", id);
        courseDefinitionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
