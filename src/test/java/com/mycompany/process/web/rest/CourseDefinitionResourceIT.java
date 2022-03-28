package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.CourseDefinition;
import com.mycompany.process.repository.CourseDefinitionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CourseDefinitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CourseDefinitionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/course-definitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CourseDefinitionRepository courseDefinitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCourseDefinitionMockMvc;

    private CourseDefinition courseDefinition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseDefinition createEntity(EntityManager em) {
        CourseDefinition courseDefinition = new CourseDefinition().name(DEFAULT_NAME).label(DEFAULT_LABEL);
        return courseDefinition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CourseDefinition createUpdatedEntity(EntityManager em) {
        CourseDefinition courseDefinition = new CourseDefinition().name(UPDATED_NAME).label(UPDATED_LABEL);
        return courseDefinition;
    }

    @BeforeEach
    public void initTest() {
        courseDefinition = createEntity(em);
    }

    @Test
    @Transactional
    void createCourseDefinition() throws Exception {
        int databaseSizeBeforeCreate = courseDefinitionRepository.findAll().size();
        // Create the CourseDefinition
        restCourseDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isCreated());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeCreate + 1);
        CourseDefinition testCourseDefinition = courseDefinitionList.get(courseDefinitionList.size() - 1);
        assertThat(testCourseDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCourseDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void createCourseDefinitionWithExistingId() throws Exception {
        // Create the CourseDefinition with an existing ID
        courseDefinition.setId(1L);

        int databaseSizeBeforeCreate = courseDefinitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCourseDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = courseDefinitionRepository.findAll().size();
        // set the field null
        courseDefinition.setName(null);

        // Create the CourseDefinition, which fails.

        restCourseDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = courseDefinitionRepository.findAll().size();
        // set the field null
        courseDefinition.setLabel(null);

        // Create the CourseDefinition, which fails.

        restCourseDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCourseDefinitions() throws Exception {
        // Initialize the database
        courseDefinitionRepository.saveAndFlush(courseDefinition);

        // Get all the courseDefinitionList
        restCourseDefinitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(courseDefinition.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getCourseDefinition() throws Exception {
        // Initialize the database
        courseDefinitionRepository.saveAndFlush(courseDefinition);

        // Get the courseDefinition
        restCourseDefinitionMockMvc
            .perform(get(ENTITY_API_URL_ID, courseDefinition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(courseDefinition.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingCourseDefinition() throws Exception {
        // Get the courseDefinition
        restCourseDefinitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCourseDefinition() throws Exception {
        // Initialize the database
        courseDefinitionRepository.saveAndFlush(courseDefinition);

        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();

        // Update the courseDefinition
        CourseDefinition updatedCourseDefinition = courseDefinitionRepository.findById(courseDefinition.getId()).get();
        // Disconnect from session so that the updates on updatedCourseDefinition are not directly saved in db
        em.detach(updatedCourseDefinition);
        updatedCourseDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restCourseDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCourseDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCourseDefinition))
            )
            .andExpect(status().isOk());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
        CourseDefinition testCourseDefinition = courseDefinitionList.get(courseDefinitionList.size() - 1);
        assertThat(testCourseDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourseDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingCourseDefinition() throws Exception {
        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();
        courseDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courseDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCourseDefinition() throws Exception {
        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();
        courseDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCourseDefinition() throws Exception {
        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();
        courseDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCourseDefinitionWithPatch() throws Exception {
        // Initialize the database
        courseDefinitionRepository.saveAndFlush(courseDefinition);

        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();

        // Update the courseDefinition using partial update
        CourseDefinition partialUpdatedCourseDefinition = new CourseDefinition();
        partialUpdatedCourseDefinition.setId(courseDefinition.getId());

        partialUpdatedCourseDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restCourseDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourseDefinition))
            )
            .andExpect(status().isOk());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
        CourseDefinition testCourseDefinition = courseDefinitionList.get(courseDefinitionList.size() - 1);
        assertThat(testCourseDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourseDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateCourseDefinitionWithPatch() throws Exception {
        // Initialize the database
        courseDefinitionRepository.saveAndFlush(courseDefinition);

        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();

        // Update the courseDefinition using partial update
        CourseDefinition partialUpdatedCourseDefinition = new CourseDefinition();
        partialUpdatedCourseDefinition.setId(courseDefinition.getId());

        partialUpdatedCourseDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restCourseDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourseDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourseDefinition))
            )
            .andExpect(status().isOk());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
        CourseDefinition testCourseDefinition = courseDefinitionList.get(courseDefinitionList.size() - 1);
        assertThat(testCourseDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourseDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingCourseDefinition() throws Exception {
        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();
        courseDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, courseDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCourseDefinition() throws Exception {
        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();
        courseDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCourseDefinition() throws Exception {
        int databaseSizeBeforeUpdate = courseDefinitionRepository.findAll().size();
        courseDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courseDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CourseDefinition in the database
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCourseDefinition() throws Exception {
        // Initialize the database
        courseDefinitionRepository.saveAndFlush(courseDefinition);

        int databaseSizeBeforeDelete = courseDefinitionRepository.findAll().size();

        // Delete the courseDefinition
        restCourseDefinitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, courseDefinition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CourseDefinition> courseDefinitionList = courseDefinitionRepository.findAll();
        assertThat(courseDefinitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
