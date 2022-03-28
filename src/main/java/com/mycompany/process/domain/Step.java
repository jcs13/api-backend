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
 * A Step.
 */
@Entity
@Table(name = "step")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Step implements Serializable {

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
    @Column(name = "step_definition_id", nullable = false)
    private String stepDefinitionId;

    @NotNull
    @Column(name = "display", nullable = false)
    private Boolean display;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private Integer order;

    @OneToMany(mappedBy = "step")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "step" }, allowSetters = true)
    private Set<Block> blocks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "steps", "simulation" }, allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Step id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Step name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public Step label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStepDefinitionId() {
        return this.stepDefinitionId;
    }

    public Step stepDefinitionId(String stepDefinitionId) {
        this.setStepDefinitionId(stepDefinitionId);
        return this;
    }

    public void setStepDefinitionId(String stepDefinitionId) {
        this.stepDefinitionId = stepDefinitionId;
    }

    public Boolean getDisplay() {
        return this.display;
    }

    public Step display(Boolean display) {
        this.setDisplay(display);
        return this;
    }

    public void setDisplay(Boolean display) {
        this.display = display;
    }

    public Integer getOrder() {
        return this.order;
    }

    public Step order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Set<Block> getBlocks() {
        return this.blocks;
    }

    public void setBlocks(Set<Block> blocks) {
        if (this.blocks != null) {
            this.blocks.forEach(i -> i.setStep(null));
        }
        if (blocks != null) {
            blocks.forEach(i -> i.setStep(this));
        }
        this.blocks = blocks;
    }

    public Step blocks(Set<Block> blocks) {
        this.setBlocks(blocks);
        return this;
    }

    public Step addBlock(Block block) {
        this.blocks.add(block);
        block.setStep(this);
        return this;
    }

    public Step removeBlock(Block block) {
        this.blocks.remove(block);
        block.setStep(null);
        return this;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Step course(Course course) {
        this.setCourse(course);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Step)) {
            return false;
        }
        return id != null && id.equals(((Step) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Step{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            ", stepDefinitionId='" + getStepDefinitionId() + "'" +
            ", display='" + getDisplay() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
