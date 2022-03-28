package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.StepDefinition;
import com.mycompany.process.repository.StepDefinitionRepository;
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
 * Integration tests for the {@link StepDefinitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StepDefinitionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DISPLAY = false;
    private static final Boolean UPDATED_DISPLAY = true;

    private static final String ENTITY_API_URL = "/api/step-definitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StepDefinitionRepository stepDefinitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStepDefinitionMockMvc;

    private StepDefinition stepDefinition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StepDefinition createEntity(EntityManager em) {
        StepDefinition stepDefinition = new StepDefinition().name(DEFAULT_NAME).label(DEFAULT_LABEL).display(DEFAULT_DISPLAY);
        return stepDefinition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StepDefinition createUpdatedEntity(EntityManager em) {
        StepDefinition stepDefinition = new StepDefinition().name(UPDATED_NAME).label(UPDATED_LABEL).display(UPDATED_DISPLAY);
        return stepDefinition;
    }

    @BeforeEach
    public void initTest() {
        stepDefinition = createEntity(em);
    }

    @Test
    @Transactional
    void createStepDefinition() throws Exception {
        int databaseSizeBeforeCreate = stepDefinitionRepository.findAll().size();
        // Create the StepDefinition
        restStepDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isCreated());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeCreate + 1);
        StepDefinition testStepDefinition = stepDefinitionList.get(stepDefinitionList.size() - 1);
        assertThat(testStepDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStepDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testStepDefinition.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
    }

    @Test
    @Transactional
    void createStepDefinitionWithExistingId() throws Exception {
        // Create the StepDefinition with an existing ID
        stepDefinition.setId(1L);

        int databaseSizeBeforeCreate = stepDefinitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStepDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = stepDefinitionRepository.findAll().size();
        // set the field null
        stepDefinition.setName(null);

        // Create the StepDefinition, which fails.

        restStepDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = stepDefinitionRepository.findAll().size();
        // set the field null
        stepDefinition.setLabel(null);

        // Create the StepDefinition, which fails.

        restStepDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDisplayIsRequired() throws Exception {
        int databaseSizeBeforeTest = stepDefinitionRepository.findAll().size();
        // set the field null
        stepDefinition.setDisplay(null);

        // Create the StepDefinition, which fails.

        restStepDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStepDefinitions() throws Exception {
        // Initialize the database
        stepDefinitionRepository.saveAndFlush(stepDefinition);

        // Get all the stepDefinitionList
        restStepDefinitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stepDefinition.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].display").value(hasItem(DEFAULT_DISPLAY.booleanValue())));
    }

    @Test
    @Transactional
    void getStepDefinition() throws Exception {
        // Initialize the database
        stepDefinitionRepository.saveAndFlush(stepDefinition);

        // Get the stepDefinition
        restStepDefinitionMockMvc
            .perform(get(ENTITY_API_URL_ID, stepDefinition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stepDefinition.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.display").value(DEFAULT_DISPLAY.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingStepDefinition() throws Exception {
        // Get the stepDefinition
        restStepDefinitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStepDefinition() throws Exception {
        // Initialize the database
        stepDefinitionRepository.saveAndFlush(stepDefinition);

        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();

        // Update the stepDefinition
        StepDefinition updatedStepDefinition = stepDefinitionRepository.findById(stepDefinition.getId()).get();
        // Disconnect from session so that the updates on updatedStepDefinition are not directly saved in db
        em.detach(updatedStepDefinition);
        updatedStepDefinition.name(UPDATED_NAME).label(UPDATED_LABEL).display(UPDATED_DISPLAY);

        restStepDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStepDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStepDefinition))
            )
            .andExpect(status().isOk());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
        StepDefinition testStepDefinition = stepDefinitionList.get(stepDefinitionList.size() - 1);
        assertThat(testStepDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStepDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testStepDefinition.getDisplay()).isEqualTo(UPDATED_DISPLAY);
    }

    @Test
    @Transactional
    void putNonExistingStepDefinition() throws Exception {
        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();
        stepDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStepDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stepDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStepDefinition() throws Exception {
        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();
        stepDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStepDefinition() throws Exception {
        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();
        stepDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepDefinitionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepDefinition)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStepDefinitionWithPatch() throws Exception {
        // Initialize the database
        stepDefinitionRepository.saveAndFlush(stepDefinition);

        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();

        // Update the stepDefinition using partial update
        StepDefinition partialUpdatedStepDefinition = new StepDefinition();
        partialUpdatedStepDefinition.setId(stepDefinition.getId());

        partialUpdatedStepDefinition.name(UPDATED_NAME);

        restStepDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStepDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStepDefinition))
            )
            .andExpect(status().isOk());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
        StepDefinition testStepDefinition = stepDefinitionList.get(stepDefinitionList.size() - 1);
        assertThat(testStepDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStepDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testStepDefinition.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
    }

    @Test
    @Transactional
    void fullUpdateStepDefinitionWithPatch() throws Exception {
        // Initialize the database
        stepDefinitionRepository.saveAndFlush(stepDefinition);

        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();

        // Update the stepDefinition using partial update
        StepDefinition partialUpdatedStepDefinition = new StepDefinition();
        partialUpdatedStepDefinition.setId(stepDefinition.getId());

        partialUpdatedStepDefinition.name(UPDATED_NAME).label(UPDATED_LABEL).display(UPDATED_DISPLAY);

        restStepDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStepDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStepDefinition))
            )
            .andExpect(status().isOk());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
        StepDefinition testStepDefinition = stepDefinitionList.get(stepDefinitionList.size() - 1);
        assertThat(testStepDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStepDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testStepDefinition.getDisplay()).isEqualTo(UPDATED_DISPLAY);
    }

    @Test
    @Transactional
    void patchNonExistingStepDefinition() throws Exception {
        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();
        stepDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStepDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stepDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStepDefinition() throws Exception {
        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();
        stepDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStepDefinition() throws Exception {
        int databaseSizeBeforeUpdate = stepDefinitionRepository.findAll().size();
        stepDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stepDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StepDefinition in the database
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStepDefinition() throws Exception {
        // Initialize the database
        stepDefinitionRepository.saveAndFlush(stepDefinition);

        int databaseSizeBeforeDelete = stepDefinitionRepository.findAll().size();

        // Delete the stepDefinition
        restStepDefinitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, stepDefinition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StepDefinition> stepDefinitionList = stepDefinitionRepository.findAll();
        assertThat(stepDefinitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
