package com.mycompany.process.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.process.IntegrationTest;
import com.mycompany.process.domain.Simulation;
import com.mycompany.process.repository.SimulationRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link SimulationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SimulationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AFFAIRE = "AAAAAAAAAA";
    private static final String UPDATED_AFFAIRE = "BBBBBBBBBB";

    private static final String DEFAULT_CLIENT = "AAAAAAAAAA";
    private static final String UPDATED_CLIENT = "BBBBBBBBBB";

    private static final String DEFAULT_PARC = "AAAAAAAAAA";
    private static final String UPDATED_PARC = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_MODIFIED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MODIFIED = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_USER_CREATION = "AAAAAAAAAA";
    private static final String UPDATED_USER_CREATION = "BBBBBBBBBB";

    private static final String DEFAULT_USER_CURRENT = "AAAAAAAAAA";
    private static final String UPDATED_USER_CURRENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/simulations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SimulationRepository simulationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSimulationMockMvc;

    private Simulation simulation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Simulation createEntity(EntityManager em) {
        Simulation simulation = new Simulation()
            .name(DEFAULT_NAME)
            .affaire(DEFAULT_AFFAIRE)
            .client(DEFAULT_CLIENT)
            .parc(DEFAULT_PARC)
            .status(DEFAULT_STATUS)
            .created(DEFAULT_CREATED)
            .modified(DEFAULT_MODIFIED)
            .userCreation(DEFAULT_USER_CREATION)
            .userCurrent(DEFAULT_USER_CURRENT);
        return simulation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Simulation createUpdatedEntity(EntityManager em) {
        Simulation simulation = new Simulation()
            .name(UPDATED_NAME)
            .affaire(UPDATED_AFFAIRE)
            .client(UPDATED_CLIENT)
            .parc(UPDATED_PARC)
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .userCreation(UPDATED_USER_CREATION)
            .userCurrent(UPDATED_USER_CURRENT);
        return simulation;
    }

    @BeforeEach
    public void initTest() {
        simulation = createEntity(em);
    }

    @Test
    @Transactional
    void createSimulation() throws Exception {
        int databaseSizeBeforeCreate = simulationRepository.findAll().size();
        // Create the Simulation
        restSimulationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(simulation)))
            .andExpect(status().isCreated());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeCreate + 1);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSimulation.getAffaire()).isEqualTo(DEFAULT_AFFAIRE);
        assertThat(testSimulation.getClient()).isEqualTo(DEFAULT_CLIENT);
        assertThat(testSimulation.getParc()).isEqualTo(DEFAULT_PARC);
        assertThat(testSimulation.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSimulation.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testSimulation.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testSimulation.getUserCreation()).isEqualTo(DEFAULT_USER_CREATION);
        assertThat(testSimulation.getUserCurrent()).isEqualTo(DEFAULT_USER_CURRENT);
    }

    @Test
    @Transactional
    void createSimulationWithExistingId() throws Exception {
        // Create the Simulation with an existing ID
        simulation.setId(1L);

        int databaseSizeBeforeCreate = simulationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSimulationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(simulation)))
            .andExpect(status().isBadRequest());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = simulationRepository.findAll().size();
        // set the field null
        simulation.setName(null);

        // Create the Simulation, which fails.

        restSimulationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(simulation)))
            .andExpect(status().isBadRequest());

        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = simulationRepository.findAll().size();
        // set the field null
        simulation.setCreated(null);

        // Create the Simulation, which fails.

        restSimulationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(simulation)))
            .andExpect(status().isBadRequest());

        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSimulations() throws Exception {
        // Initialize the database
        simulationRepository.saveAndFlush(simulation);

        // Get all the simulationList
        restSimulationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(simulation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].affaire").value(hasItem(DEFAULT_AFFAIRE)))
            .andExpect(jsonPath("$.[*].client").value(hasItem(DEFAULT_CLIENT)))
            .andExpect(jsonPath("$.[*].parc").value(hasItem(DEFAULT_PARC)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(DEFAULT_MODIFIED.toString())))
            .andExpect(jsonPath("$.[*].userCreation").value(hasItem(DEFAULT_USER_CREATION)))
            .andExpect(jsonPath("$.[*].userCurrent").value(hasItem(DEFAULT_USER_CURRENT)));
    }

    @Test
    @Transactional
    void getSimulation() throws Exception {
        // Initialize the database
        simulationRepository.saveAndFlush(simulation);

        // Get the simulation
        restSimulationMockMvc
            .perform(get(ENTITY_API_URL_ID, simulation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(simulation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.affaire").value(DEFAULT_AFFAIRE))
            .andExpect(jsonPath("$.client").value(DEFAULT_CLIENT))
            .andExpect(jsonPath("$.parc").value(DEFAULT_PARC))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()))
            .andExpect(jsonPath("$.modified").value(DEFAULT_MODIFIED.toString()))
            .andExpect(jsonPath("$.userCreation").value(DEFAULT_USER_CREATION))
            .andExpect(jsonPath("$.userCurrent").value(DEFAULT_USER_CURRENT));
    }

    @Test
    @Transactional
    void getNonExistingSimulation() throws Exception {
        // Get the simulation
        restSimulationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSimulation() throws Exception {
        // Initialize the database
        simulationRepository.saveAndFlush(simulation);

        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();

        // Update the simulation
        Simulation updatedSimulation = simulationRepository.findById(simulation.getId()).get();
        // Disconnect from session so that the updates on updatedSimulation are not directly saved in db
        em.detach(updatedSimulation);
        updatedSimulation
            .name(UPDATED_NAME)
            .affaire(UPDATED_AFFAIRE)
            .client(UPDATED_CLIENT)
            .parc(UPDATED_PARC)
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .userCreation(UPDATED_USER_CREATION)
            .userCurrent(UPDATED_USER_CURRENT);

        restSimulationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSimulation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSimulation))
            )
            .andExpect(status().isOk());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSimulation.getAffaire()).isEqualTo(UPDATED_AFFAIRE);
        assertThat(testSimulation.getClient()).isEqualTo(UPDATED_CLIENT);
        assertThat(testSimulation.getParc()).isEqualTo(UPDATED_PARC);
        assertThat(testSimulation.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSimulation.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testSimulation.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testSimulation.getUserCreation()).isEqualTo(UPDATED_USER_CREATION);
        assertThat(testSimulation.getUserCurrent()).isEqualTo(UPDATED_USER_CURRENT);
    }

    @Test
    @Transactional
    void putNonExistingSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();
        simulation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSimulationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, simulation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(simulation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();
        simulation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimulationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(simulation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();
        simulation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimulationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(simulation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSimulationWithPatch() throws Exception {
        // Initialize the database
        simulationRepository.saveAndFlush(simulation);

        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();

        // Update the simulation using partial update
        Simulation partialUpdatedSimulation = new Simulation();
        partialUpdatedSimulation.setId(simulation.getId());

        partialUpdatedSimulation.affaire(UPDATED_AFFAIRE).client(UPDATED_CLIENT).created(UPDATED_CREATED).userCurrent(UPDATED_USER_CURRENT);

        restSimulationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSimulation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSimulation))
            )
            .andExpect(status().isOk());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSimulation.getAffaire()).isEqualTo(UPDATED_AFFAIRE);
        assertThat(testSimulation.getClient()).isEqualTo(UPDATED_CLIENT);
        assertThat(testSimulation.getParc()).isEqualTo(DEFAULT_PARC);
        assertThat(testSimulation.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSimulation.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testSimulation.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testSimulation.getUserCreation()).isEqualTo(DEFAULT_USER_CREATION);
        assertThat(testSimulation.getUserCurrent()).isEqualTo(UPDATED_USER_CURRENT);
    }

    @Test
    @Transactional
    void fullUpdateSimulationWithPatch() throws Exception {
        // Initialize the database
        simulationRepository.saveAndFlush(simulation);

        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();

        // Update the simulation using partial update
        Simulation partialUpdatedSimulation = new Simulation();
        partialUpdatedSimulation.setId(simulation.getId());

        partialUpdatedSimulation
            .name(UPDATED_NAME)
            .affaire(UPDATED_AFFAIRE)
            .client(UPDATED_CLIENT)
            .parc(UPDATED_PARC)
            .status(UPDATED_STATUS)
            .created(UPDATED_CREATED)
            .modified(UPDATED_MODIFIED)
            .userCreation(UPDATED_USER_CREATION)
            .userCurrent(UPDATED_USER_CURRENT);

        restSimulationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSimulation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSimulation))
            )
            .andExpect(status().isOk());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
        Simulation testSimulation = simulationList.get(simulationList.size() - 1);
        assertThat(testSimulation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSimulation.getAffaire()).isEqualTo(UPDATED_AFFAIRE);
        assertThat(testSimulation.getClient()).isEqualTo(UPDATED_CLIENT);
        assertThat(testSimulation.getParc()).isEqualTo(UPDATED_PARC);
        assertThat(testSimulation.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSimulation.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testSimulation.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testSimulation.getUserCreation()).isEqualTo(UPDATED_USER_CREATION);
        assertThat(testSimulation.getUserCurrent()).isEqualTo(UPDATED_USER_CURRENT);
    }

    @Test
    @Transactional
    void patchNonExistingSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();
        simulation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSimulationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, simulation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(simulation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();
        simulation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimulationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(simulation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSimulation() throws Exception {
        int databaseSizeBeforeUpdate = simulationRepository.findAll().size();
        simulation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimulationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(simulation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Simulation in the database
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSimulation() throws Exception {
        // Initialize the database
        simulationRepository.saveAndFlush(simulation);

        int databaseSizeBeforeDelete = simulationRepository.findAll().size();

        // Delete the simulation
        restSimulationMockMvc
            .perform(delete(ENTITY_API_URL_ID, simulation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Simulation> simulationList = simulationRepository.findAll();
        assertThat(simulationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
