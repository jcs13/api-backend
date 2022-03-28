package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.ItemComponent;
import com.mycompany.process.repository.ItemComponentRepository;
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
 * Integration tests for the {@link ItemComponentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemComponentResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/item-components";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemComponentRepository itemComponentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemComponentMockMvc;

    private ItemComponent itemComponent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemComponent createEntity(EntityManager em) {
        ItemComponent itemComponent = new ItemComponent().name(DEFAULT_NAME);
        return itemComponent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemComponent createUpdatedEntity(EntityManager em) {
        ItemComponent itemComponent = new ItemComponent().name(UPDATED_NAME);
        return itemComponent;
    }

    @BeforeEach
    public void initTest() {
        itemComponent = createEntity(em);
    }

    @Test
    @Transactional
    void createItemComponent() throws Exception {
        int databaseSizeBeforeCreate = itemComponentRepository.findAll().size();
        // Create the ItemComponent
        restItemComponentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemComponent)))
            .andExpect(status().isCreated());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeCreate + 1);
        ItemComponent testItemComponent = itemComponentList.get(itemComponentList.size() - 1);
        assertThat(testItemComponent.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createItemComponentWithExistingId() throws Exception {
        // Create the ItemComponent with an existing ID
        itemComponent.setId(1L);

        int databaseSizeBeforeCreate = itemComponentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemComponentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemComponent)))
            .andExpect(status().isBadRequest());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemComponentRepository.findAll().size();
        // set the field null
        itemComponent.setName(null);

        // Create the ItemComponent, which fails.

        restItemComponentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemComponent)))
            .andExpect(status().isBadRequest());

        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllItemComponents() throws Exception {
        // Initialize the database
        itemComponentRepository.saveAndFlush(itemComponent);

        // Get all the itemComponentList
        restItemComponentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemComponent.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getItemComponent() throws Exception {
        // Initialize the database
        itemComponentRepository.saveAndFlush(itemComponent);

        // Get the itemComponent
        restItemComponentMockMvc
            .perform(get(ENTITY_API_URL_ID, itemComponent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemComponent.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingItemComponent() throws Exception {
        // Get the itemComponent
        restItemComponentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewItemComponent() throws Exception {
        // Initialize the database
        itemComponentRepository.saveAndFlush(itemComponent);

        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();

        // Update the itemComponent
        ItemComponent updatedItemComponent = itemComponentRepository.findById(itemComponent.getId()).get();
        // Disconnect from session so that the updates on updatedItemComponent are not directly saved in db
        em.detach(updatedItemComponent);
        updatedItemComponent.name(UPDATED_NAME);

        restItemComponentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemComponent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemComponent))
            )
            .andExpect(status().isOk());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
        ItemComponent testItemComponent = itemComponentList.get(itemComponentList.size() - 1);
        assertThat(testItemComponent.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingItemComponent() throws Exception {
        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();
        itemComponent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemComponentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemComponent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemComponent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemComponent() throws Exception {
        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();
        itemComponent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemComponentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemComponent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemComponent() throws Exception {
        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();
        itemComponent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemComponentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemComponent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemComponentWithPatch() throws Exception {
        // Initialize the database
        itemComponentRepository.saveAndFlush(itemComponent);

        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();

        // Update the itemComponent using partial update
        ItemComponent partialUpdatedItemComponent = new ItemComponent();
        partialUpdatedItemComponent.setId(itemComponent.getId());

        partialUpdatedItemComponent.name(UPDATED_NAME);

        restItemComponentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemComponent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemComponent))
            )
            .andExpect(status().isOk());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
        ItemComponent testItemComponent = itemComponentList.get(itemComponentList.size() - 1);
        assertThat(testItemComponent.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateItemComponentWithPatch() throws Exception {
        // Initialize the database
        itemComponentRepository.saveAndFlush(itemComponent);

        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();

        // Update the itemComponent using partial update
        ItemComponent partialUpdatedItemComponent = new ItemComponent();
        partialUpdatedItemComponent.setId(itemComponent.getId());

        partialUpdatedItemComponent.name(UPDATED_NAME);

        restItemComponentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemComponent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemComponent))
            )
            .andExpect(status().isOk());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
        ItemComponent testItemComponent = itemComponentList.get(itemComponentList.size() - 1);
        assertThat(testItemComponent.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingItemComponent() throws Exception {
        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();
        itemComponent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemComponentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemComponent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemComponent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemComponent() throws Exception {
        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();
        itemComponent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemComponentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemComponent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemComponent() throws Exception {
        int databaseSizeBeforeUpdate = itemComponentRepository.findAll().size();
        itemComponent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemComponentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemComponent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemComponent in the database
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemComponent() throws Exception {
        // Initialize the database
        itemComponentRepository.saveAndFlush(itemComponent);

        int databaseSizeBeforeDelete = itemComponentRepository.findAll().size();

        // Delete the itemComponent
        restItemComponentMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemComponent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemComponent> itemComponentList = itemComponentRepository.findAll();
        assertThat(itemComponentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
