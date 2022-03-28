package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.StepTransition;
import com.mycompany.process.repository.StepTransitionRepository;
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
 * Integration tests for the {@link StepTransitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StepTransitionResourceIT {

    private static final Integer DEFAULT_TRANSITION = 1;
    private static final Integer UPDATED_TRANSITION = 2;

    private static final String ENTITY_API_URL = "/api/step-transitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StepTransitionRepository stepTransitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStepTransitionMockMvc;

    private StepTransition stepTransition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StepTransition createEntity(EntityManager em) {
        StepTransition stepTransition = new StepTransition().transition(DEFAULT_TRANSITION);
        return stepTransition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StepTransition createUpdatedEntity(EntityManager em) {
        StepTransition stepTransition = new StepTransition().transition(UPDATED_TRANSITION);
        return stepTransition;
    }

    @BeforeEach
    public void initTest() {
        stepTransition = createEntity(em);
    }

    @Test
    @Transactional
    void createStepTransition() throws Exception {
        int databaseSizeBeforeCreate = stepTransitionRepository.findAll().size();
        // Create the StepTransition
        restStepTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isCreated());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeCreate + 1);
        StepTransition testStepTransition = stepTransitionList.get(stepTransitionList.size() - 1);
        assertThat(testStepTransition.getTransition()).isEqualTo(DEFAULT_TRANSITION);
    }

    @Test
    @Transactional
    void createStepTransitionWithExistingId() throws Exception {
        // Create the StepTransition with an existing ID
        stepTransition.setId(1L);

        int databaseSizeBeforeCreate = stepTransitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStepTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTransitionIsRequired() throws Exception {
        int databaseSizeBeforeTest = stepTransitionRepository.findAll().size();
        // set the field null
        stepTransition.setTransition(null);

        // Create the StepTransition, which fails.

        restStepTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isBadRequest());

        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStepTransitions() throws Exception {
        // Initialize the database
        stepTransitionRepository.saveAndFlush(stepTransition);

        // Get all the stepTransitionList
        restStepTransitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stepTransition.getId().intValue())))
            .andExpect(jsonPath("$.[*].transition").value(hasItem(DEFAULT_TRANSITION)));
    }

    @Test
    @Transactional
    void getStepTransition() throws Exception {
        // Initialize the database
        stepTransitionRepository.saveAndFlush(stepTransition);

        // Get the stepTransition
        restStepTransitionMockMvc
            .perform(get(ENTITY_API_URL_ID, stepTransition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stepTransition.getId().intValue()))
            .andExpect(jsonPath("$.transition").value(DEFAULT_TRANSITION));
    }

    @Test
    @Transactional
    void getNonExistingStepTransition() throws Exception {
        // Get the stepTransition
        restStepTransitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStepTransition() throws Exception {
        // Initialize the database
        stepTransitionRepository.saveAndFlush(stepTransition);

        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();

        // Update the stepTransition
        StepTransition updatedStepTransition = stepTransitionRepository.findById(stepTransition.getId()).get();
        // Disconnect from session so that the updates on updatedStepTransition are not directly saved in db
        em.detach(updatedStepTransition);
        updatedStepTransition.transition(UPDATED_TRANSITION);

        restStepTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStepTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStepTransition))
            )
            .andExpect(status().isOk());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
        StepTransition testStepTransition = stepTransitionList.get(stepTransitionList.size() - 1);
        assertThat(testStepTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void putNonExistingStepTransition() throws Exception {
        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();
        stepTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStepTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stepTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStepTransition() throws Exception {
        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();
        stepTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStepTransition() throws Exception {
        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();
        stepTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepTransitionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stepTransition)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStepTransitionWithPatch() throws Exception {
        // Initialize the database
        stepTransitionRepository.saveAndFlush(stepTransition);

        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();

        // Update the stepTransition using partial update
        StepTransition partialUpdatedStepTransition = new StepTransition();
        partialUpdatedStepTransition.setId(stepTransition.getId());

        restStepTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStepTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStepTransition))
            )
            .andExpect(status().isOk());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
        StepTransition testStepTransition = stepTransitionList.get(stepTransitionList.size() - 1);
        assertThat(testStepTransition.getTransition()).isEqualTo(DEFAULT_TRANSITION);
    }

    @Test
    @Transactional
    void fullUpdateStepTransitionWithPatch() throws Exception {
        // Initialize the database
        stepTransitionRepository.saveAndFlush(stepTransition);

        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();

        // Update the stepTransition using partial update
        StepTransition partialUpdatedStepTransition = new StepTransition();
        partialUpdatedStepTransition.setId(stepTransition.getId());

        partialUpdatedStepTransition.transition(UPDATED_TRANSITION);

        restStepTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStepTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStepTransition))
            )
            .andExpect(status().isOk());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
        StepTransition testStepTransition = stepTransitionList.get(stepTransitionList.size() - 1);
        assertThat(testStepTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void patchNonExistingStepTransition() throws Exception {
        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();
        stepTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStepTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stepTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStepTransition() throws Exception {
        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();
        stepTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStepTransition() throws Exception {
        int databaseSizeBeforeUpdate = stepTransitionRepository.findAll().size();
        stepTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStepTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stepTransition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StepTransition in the database
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStepTransition() throws Exception {
        // Initialize the database
        stepTransitionRepository.saveAndFlush(stepTransition);

        int databaseSizeBeforeDelete = stepTransitionRepository.findAll().size();

        // Delete the stepTransition
        restStepTransitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, stepTransition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StepTransition> stepTransitionList = stepTransitionRepository.findAll();
        assertThat(stepTransitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
