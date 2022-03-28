package com.mycompany.process.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @NotNull
    @Column(name = "offer_id", nullable = false)
    private String offerId;

    @OneToMany(mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blocks", "course" }, allowSetters = true)
    private Set<Step> steps = new HashSet<>();

    @JsonIgnoreProperties(value = { "course", "parent" }, allowSetters = true)
    @OneToOne(mappedBy = "course")
    private Simulation simulation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Course id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Course name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public Course label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getOfferId() {
        return this.offerId;
    }

    public Course offerId(String offerId) {
        this.setOfferId(offerId);
        return this;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public Set<Step> getSteps() {
        return this.steps;
    }

    public void setSteps(Set<Step> steps) {
        if (this.steps != null) {
            this.steps.forEach(i -> i.setCourse(null));
        }
        if (steps != null) {
            steps.forEach(i -> i.setCourse(this));
        }
        this.steps = steps;
    }

    public Course steps(Set<Step> steps) {
        this.setSteps(steps);
        return this;
    }

    public Course addStep(Step step) {
        this.steps.add(step);
        step.setCourse(this);
        return this;
    }

    public Course removeStep(Step step) {
        this.steps.remove(step);
        step.setCourse(null);
        return this;
    }

    public Simulation getSimulation() {
        return this.simulation;
    }

    public void setSimulation(Simulation simulation) {
        if (this.simulation != null) {
            this.simulation.setCourse(null);
        }
        if (simulation != null) {
            simulation.setCourse(this);
        }
        this.simulation = simulation;
    }

    public Course simulation(Simulation simulation) {
        this.setSimulation(simulation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            ", offerId='" + getOfferId() + "'" +
            "}";
    }
}
