package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.BlockDefinition;
import com.mycompany.process.repository.BlockDefinitionRepository;
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
 * Integration tests for the {@link BlockDefinitionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlockDefinitionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DISPLAY = false;
    private static final Boolean UPDATED_DISPLAY = true;

    private static final String ENTITY_API_URL = "/api/block-definitions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlockDefinitionRepository blockDefinitionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlockDefinitionMockMvc;

    private BlockDefinition blockDefinition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlockDefinition createEntity(EntityManager em) {
        BlockDefinition blockDefinition = new BlockDefinition().name(DEFAULT_NAME).label(DEFAULT_LABEL).display(DEFAULT_DISPLAY);
        return blockDefinition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlockDefinition createUpdatedEntity(EntityManager em) {
        BlockDefinition blockDefinition = new BlockDefinition().name(UPDATED_NAME).label(UPDATED_LABEL).display(UPDATED_DISPLAY);
        return blockDefinition;
    }

    @BeforeEach
    public void initTest() {
        blockDefinition = createEntity(em);
    }

    @Test
    @Transactional
    void createBlockDefinition() throws Exception {
        int databaseSizeBeforeCreate = blockDefinitionRepository.findAll().size();
        // Create the BlockDefinition
        restBlockDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isCreated());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeCreate + 1);
        BlockDefinition testBlockDefinition = blockDefinitionList.get(blockDefinitionList.size() - 1);
        assertThat(testBlockDefinition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBlockDefinition.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testBlockDefinition.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
    }

    @Test
    @Transactional
    void createBlockDefinitionWithExistingId() throws Exception {
        // Create the BlockDefinition with an existing ID
        blockDefinition.setId(1L);

        int databaseSizeBeforeCreate = blockDefinitionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlockDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = blockDefinitionRepository.findAll().size();
        // set the field null
        blockDefinition.setName(null);

        // Create the BlockDefinition, which fails.

        restBlockDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = blockDefinitionRepository.findAll().size();
        // set the field null
        blockDefinition.setLabel(null);

        // Create the BlockDefinition, which fails.

        restBlockDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDisplayIsRequired() throws Exception {
        int databaseSizeBeforeTest = blockDefinitionRepository.findAll().size();
        // set the field null
        blockDefinition.setDisplay(null);

        // Create the BlockDefinition, which fails.

        restBlockDefinitionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlockDefinitions() throws Exception {
        // Initialize the database
        blockDefinitionRepository.saveAndFlush(blockDefinition);

        // Get all the blockDefinitionList
        restBlockDefinitionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blockDefinition.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].display").value(hasItem(DEFAULT_DISPLAY.booleanValue())));
    }

    @Test
    @Transactional
    void getBlockDefinition() throws Exception {
        // Initialize the database
        blockDefinitionRepository.saveAndFlush(blockDefinition);

        // Get the blockDefinition
        restBlockDefinitionMockMvc
            .perform(get(ENTITY_API_URL_ID, blockDefinition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blockDefinition.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.display").value(DEFAULT_DISPLAY.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingBlockDefinition() throws Exception {
        // Get the blockDefinition
        restBlockDefinitionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlockDefinition() throws Exception {
        // Initialize the database
        blockDefinitionRepository.saveAndFlush(blockDefinition);

        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();

        // Update the blockDefinition
        BlockDefinition updatedBlockDefinition = blockDefinitionRepository.findById(blockDefinition.getId()).get();
        // Disconnect from session so that the updates on updatedBlockDefinition are not directly saved in db
        em.detach(updatedBlockDefinition);
        updatedBlockDefinition.name(UPDATED_NAME).label(UPDATED_LABEL).display(UPDATED_DISPLAY);

        restBlockDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlockDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlockDefinition))
            )
            .andExpect(status().isOk());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
        BlockDefinition testBlockDefinition = blockDefinitionList.get(blockDefinitionList.size() - 1);
        assertThat(testBlockDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBlockDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBlockDefinition.getDisplay()).isEqualTo(UPDATED_DISPLAY);
    }

    @Test
    @Transactional
    void putNonExistingBlockDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();
        blockDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlockDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blockDefinition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlockDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();
        blockDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlockDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();
        blockDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockDefinitionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlockDefinitionWithPatch() throws Exception {
        // Initialize the database
        blockDefinitionRepository.saveAndFlush(blockDefinition);

        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();

        // Update the blockDefinition using partial update
        BlockDefinition partialUpdatedBlockDefinition = new BlockDefinition();
        partialUpdatedBlockDefinition.setId(blockDefinition.getId());

        partialUpdatedBlockDefinition.name(UPDATED_NAME).label(UPDATED_LABEL);

        restBlockDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlockDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlockDefinition))
            )
            .andExpect(status().isOk());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
        BlockDefinition testBlockDefinition = blockDefinitionList.get(blockDefinitionList.size() - 1);
        assertThat(testBlockDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBlockDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBlockDefinition.getDisplay()).isEqualTo(DEFAULT_DISPLAY);
    }

    @Test
    @Transactional
    void fullUpdateBlockDefinitionWithPatch() throws Exception {
        // Initialize the database
        blockDefinitionRepository.saveAndFlush(blockDefinition);

        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();

        // Update the blockDefinition using partial update
        BlockDefinition partialUpdatedBlockDefinition = new BlockDefinition();
        partialUpdatedBlockDefinition.setId(blockDefinition.getId());

        partialUpdatedBlockDefinition.name(UPDATED_NAME).label(UPDATED_LABEL).display(UPDATED_DISPLAY);

        restBlockDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlockDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlockDefinition))
            )
            .andExpect(status().isOk());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
        BlockDefinition testBlockDefinition = blockDefinitionList.get(blockDefinitionList.size() - 1);
        assertThat(testBlockDefinition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBlockDefinition.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBlockDefinition.getDisplay()).isEqualTo(UPDATED_DISPLAY);
    }

    @Test
    @Transactional
    void patchNonExistingBlockDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();
        blockDefinition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlockDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blockDefinition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlockDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();
        blockDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlockDefinition() throws Exception {
        int databaseSizeBeforeUpdate = blockDefinitionRepository.findAll().size();
        blockDefinition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlockDefinitionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blockDefinition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlockDefinition in the database
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlockDefinition() throws Exception {
        // Initialize the database
        blockDefinitionRepository.saveAndFlush(blockDefinition);

        int databaseSizeBeforeDelete = blockDefinitionRepository.findAll().size();

        // Delete the blockDefinition
        restBlockDefinitionMockMvc
            .perform(delete(ENTITY_API_URL_ID, blockDefinition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlockDefinition> blockDefinitionList = blockDefinitionRepository.findAll();
        assertThat(blockDefinitionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
