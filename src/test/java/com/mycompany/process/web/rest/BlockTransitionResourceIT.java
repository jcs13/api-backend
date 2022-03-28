package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.BlockTransition;
import com.mycompany.process.repository.BlockTransitionRepository;
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
 * Integration tests for the {@link BlockTransitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlockTransitionResourceIT {

    private static final Integer DEFAULT_TRANSITION = 1;
    private static final Integer UPDATED_TRANSITION = 2;

    private static final String ENTITY_API_URL = "/api/block-transitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlockTransitionRepository blockTransitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlockTransitionMockMvc;

    private BlockTransition blockTransition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlockTransition createEntity(EntityManager em) {
        BlockTransition blockTransition = new BlockTransition().transition(DEFAULT_TRANSITION);
        return blockTransition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlockTransition createUpdatedEntity(EntityManager em) {
        BlockTransition blockTransition = new BlockTransition().transition(UPDATED_TRANSITION);
        return blockTransition;
    }

    @BeforeEach
    public void initTest() {
        blockTransition = createEntity(em);
    }

    @Test
    @Transactional
    void createBlockTransition() throws Exception {
        int databaseSizeBeforeCreate = blockTransitionRepository.findAll().size();
        // Create the BlockTransition
        restBlockTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isCreated());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeCreate + 1);
        BlockTransition testBlockTransition = blockTransitionList.get(blockTransitionList.size() - 1);
        assertThat(testBlockTransition.getTransition()).isEqualTo(DEFAULT_TRANSITION);
    }

    @Test
    @Transactional
    void createBlockTransitionWithExistingId() throws Exception {
        // Create the BlockTransition with an existing ID
        blockTransition.setId(1L);

        int databaseSizeBeforeCreate = blockTransitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlockTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTransitionIsRequired() throws Exception {
        int databaseSizeBeforeTest = blockTransitionRepository.findAll().size();
        // set the field null
        blockTransition.setTransition(null);

        // Create the BlockTransition, which fails.

        restBlockTransitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isBadRequest());

        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlockTransitions() throws Exception {
        // Initialize the database
        blockTransitionRepository.saveAndFlush(blockTransition);

        // Get all the blockTransitionList
        restBlockTransitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blockTransition.getId().intValue())))
            .andExpect(jsonPath("$.[*].transition").value(hasItem(DEFAULT_TRANSITION)));
    }

    @Test
    @Transactional
    void getBlockTransition() throws Exception {
        // Initialize the database
        blockTransitionRepository.saveAndFlush(blockTransition);

        // Get the blockTransition
        restBlockTransitionMockMvc
            .perform(get(ENTITY_API_URL_ID, blockTransition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blockTransition.getId().intValue()))
            .andExpect(jsonPath("$.transition").value(DEFAULT_TRANSITION));
    }

    @Test
    @Transactional
    void getNonExistingBlockTransition() throws Exception {
        // Get the blockTransition
        restBlockTransitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlockTransition() throws Exception {
        // Initialize the database
        blockTransitionRepository.saveAndFlush(blockTransition);

        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();

        // Update the blockTransition
        BlockTransition updatedBlockTransition = blockTransitionRepository.findById(blockTransition.getId()).get();
        // Disconnect from session so that the updates on updatedBlockTransition are not directly saved in db
        em.detach(updatedBlockTransition);
        updatedBlockTransition.transition(UPDATED_TRANSITION);

        restBlockTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlockTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlockTransition))
            )
            .andExpect(status().isOk());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
        BlockTransition testBlockTransition = blockTransitionList.get(blockTransitionList.size() - 1);
        assertThat(testBlockTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void putNonExistingBlockTransition() throws Exception {
        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();
        blockTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlockTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blockTransition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlockTransition() throws Exception {
        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();
        blockTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockTransitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlockTransition() throws Exception {
        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();
        blockTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockTransitionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlockTransitionWithPatch() throws Exception {
        // Initialize the database
        blockTransitionRepository.saveAndFlush(blockTransition);

        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();

        // Update the blockTransition using partial update
        BlockTransition partialUpdatedBlockTransition = new BlockTransition();
        partialUpdatedBlockTransition.setId(blockTransition.getId());

        partialUpdatedBlockTransition.transition(UPDATED_TRANSITION);

        restBlockTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlockTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlockTransition))
            )
            .andExpect(status().isOk());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
        BlockTransition testBlockTransition = blockTransitionList.get(blockTransitionList.size() - 1);
        assertThat(testBlockTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void fullUpdateBlockTransitionWithPatch() throws Exception {
        // Initialize the database
        blockTransitionRepository.saveAndFlush(blockTransition);

        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();

        // Update the blockTransition using partial update
        BlockTransition partialUpdatedBlockTransition = new BlockTransition();
        partialUpdatedBlockTransition.setId(blockTransition.getId());

        partialUpdatedBlockTransition.transition(UPDATED_TRANSITION);

        restBlockTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlockTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlockTransition))
            )
            .andExpect(status().isOk());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
        BlockTransition testBlockTransition = blockTransitionList.get(blockTransitionList.size() - 1);
        assertThat(testBlockTransition.getTransition()).isEqualTo(UPDATED_TRANSITION);
    }

    @Test
    @Transactional
    void patchNonExistingBlockTransition() throws Exception {
        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();
        blockTransition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlockTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blockTransition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlockTransition() throws Exception {
        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();
        blockTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlockTransition() throws Exception {
        int databaseSizeBeforeUpdate = blockTransitionRepository.findAll().size();
        blockTransition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockTransitionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockTransition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlockTransition in the database
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlockTransition() throws Exception {
        // Initialize the database
        blockTransitionRepository.saveAndFlush(blockTransition);

        int databaseSizeBeforeDelete = blockTransitionRepository.findAll().size();

        // Delete the blockTransition
        restBlockTransitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, blockTransition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlockTransition> blockTransitionList = blockTransitionRepository.findAll();
        assertThat(blockTransitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
