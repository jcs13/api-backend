package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.OfferComposition;
import com.mycompany.process.repository.OfferCompositionRepository;
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
 * Integration tests for the {@link OfferCompositionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OfferCompositionResourceIT {

    private static final Integer DEFAULT_INHERITANCE_ORDER = 1;
    private static final Integer UPDATED_INHERITANCE_ORDER = 2;

    private static final String ENTITY_API_URL = "/api/offer-compositions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OfferCompositionRepository offerCompositionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOfferCompositionMockMvc;

    private OfferComposition offerComposition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OfferComposition createEntity(EntityManager em) {
        OfferComposition offerComposition = new OfferComposition().inheritanceOrder(DEFAULT_INHERITANCE_ORDER);
        return offerComposition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OfferComposition createUpdatedEntity(EntityManager em) {
        OfferComposition offerComposition = new OfferComposition().inheritanceOrder(UPDATED_INHERITANCE_ORDER);
        return offerComposition;
    }

    @BeforeEach
    public void initTest() {
        offerComposition = createEntity(em);
    }

    @Test
    @Transactional
    void createOfferComposition() throws Exception {
        int databaseSizeBeforeCreate = offerCompositionRepository.findAll().size();
        // Create the OfferComposition
        restOfferCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isCreated());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeCreate + 1);
        OfferComposition testOfferComposition = offerCompositionList.get(offerCompositionList.size() - 1);
        assertThat(testOfferComposition.getInheritanceOrder()).isEqualTo(DEFAULT_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void createOfferCompositionWithExistingId() throws Exception {
        // Create the OfferComposition with an existing ID
        offerComposition.setId(1L);

        int databaseSizeBeforeCreate = offerCompositionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOfferCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkInheritanceOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = offerCompositionRepository.findAll().size();
        // set the field null
        offerComposition.setInheritanceOrder(null);

        // Create the OfferComposition, which fails.

        restOfferCompositionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isBadRequest());

        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOfferCompositions() throws Exception {
        // Initialize the database
        offerCompositionRepository.saveAndFlush(offerComposition);

        // Get all the offerCompositionList
        restOfferCompositionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offerComposition.getId().intValue())))
            .andExpect(jsonPath("$.[*].inheritanceOrder").value(hasItem(DEFAULT_INHERITANCE_ORDER)));
    }

    @Test
    @Transactional
    void getOfferComposition() throws Exception {
        // Initialize the database
        offerCompositionRepository.saveAndFlush(offerComposition);

        // Get the offerComposition
        restOfferCompositionMockMvc
            .perform(get(ENTITY_API_URL_ID, offerComposition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offerComposition.getId().intValue()))
            .andExpect(jsonPath("$.inheritanceOrder").value(DEFAULT_INHERITANCE_ORDER));
    }

    @Test
    @Transactional
    void getNonExistingOfferComposition() throws Exception {
        // Get the offerComposition
        restOfferCompositionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOfferComposition() throws Exception {
        // Initialize the database
        offerCompositionRepository.saveAndFlush(offerComposition);

        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();

        // Update the offerComposition
        OfferComposition updatedOfferComposition = offerCompositionRepository.findById(offerComposition.getId()).get();
        // Disconnect from session so that the updates on updatedOfferComposition are not directly saved in db
        em.detach(updatedOfferComposition);
        updatedOfferComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restOfferCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOfferComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOfferComposition))
            )
            .andExpect(status().isOk());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
        OfferComposition testOfferComposition = offerCompositionList.get(offerCompositionList.size() - 1);
        assertThat(testOfferComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingOfferComposition() throws Exception {
        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();
        offerComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offerComposition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOfferComposition() throws Exception {
        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();
        offerComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferCompositionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOfferComposition() throws Exception {
        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();
        offerComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferCompositionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOfferCompositionWithPatch() throws Exception {
        // Initialize the database
        offerCompositionRepository.saveAndFlush(offerComposition);

        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();

        // Update the offerComposition using partial update
        OfferComposition partialUpdatedOfferComposition = new OfferComposition();
        partialUpdatedOfferComposition.setId(offerComposition.getId());

        partialUpdatedOfferComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restOfferCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOfferComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOfferComposition))
            )
            .andExpect(status().isOk());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
        OfferComposition testOfferComposition = offerCompositionList.get(offerCompositionList.size() - 1);
        assertThat(testOfferComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateOfferCompositionWithPatch() throws Exception {
        // Initialize the database
        offerCompositionRepository.saveAndFlush(offerComposition);

        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();

        // Update the offerComposition using partial update
        OfferComposition partialUpdatedOfferComposition = new OfferComposition();
        partialUpdatedOfferComposition.setId(offerComposition.getId());

        partialUpdatedOfferComposition.inheritanceOrder(UPDATED_INHERITANCE_ORDER);

        restOfferCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOfferComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOfferComposition))
            )
            .andExpect(status().isOk());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
        OfferComposition testOfferComposition = offerCompositionList.get(offerCompositionList.size() - 1);
        assertThat(testOfferComposition.getInheritanceOrder()).isEqualTo(UPDATED_INHERITANCE_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingOfferComposition() throws Exception {
        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();
        offerComposition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offerComposition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOfferComposition() throws Exception {
        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();
        offerComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOfferComposition() throws Exception {
        int databaseSizeBeforeUpdate = offerCompositionRepository.findAll().size();
        offerComposition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferCompositionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offerComposition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OfferComposition in the database
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOfferComposition() throws Exception {
        // Initialize the database
        offerCompositionRepository.saveAndFlush(offerComposition);

        int databaseSizeBeforeDelete = offerCompositionRepository.findAll().size();

        // Delete the offerComposition
        restOfferCompositionMockMvc
            .perform(delete(ENTITY_API_URL_ID, offerComposition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OfferComposition> offerCompositionList = offerCompositionRepository.findAll();
        assertThat(offerCompositionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
