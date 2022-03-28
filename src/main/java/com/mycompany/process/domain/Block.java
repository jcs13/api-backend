package com.mycompany.process.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Block.
 */
@Entity
@Table(name = "block")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Block implements Serializable {

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
    @Column(name = "component_name", nullable = false)
    private String componentName;

    @NotNull
    @Column(name = "step_definition_id", nullable = false)
    private String stepDefinitionId;

    @NotNull
    @Column(name = "block_definition_id", nullable = false)
    private String blockDefinitionId;

    @NotNull
    @Column(name = "display", nullable = false)
    private Boolean display;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private Integer order;

    @ManyToOne
    @JsonIgnoreProperties(value = { "blocks", "course" }, allowSetters = true)
    private Step step;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Block id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Block name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public Block label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getComponentName() {
        return this.componentName;
    }

    public Block componentName(String componentName) {
        this.setComponentName(componentName);
        return this;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public String getStepDefinitionId() {
        return this.stepDefinitionId;
    }

    public Block stepDefinitionId(String stepDefinitionId) {
        this.setStepDefinitionId(stepDefinitionId);
        return this;
    }

    public void setStepDefinitionId(String stepDefinitionId) {
        this.stepDefinitionId = stepDefinitionId;
    }

    public String getBlockDefinitionId() {
        return this.blockDefinitionId;
    }

    public Block blockDefinitionId(String blockDefinitionId) {
        this.setBlockDefinitionId(blockDefinitionId);
        return this;
    }

    public void setBlockDefinitionId(String blockDefinitionId) {
        this.blockDefinitionId = blockDefinitionId;
    }

    public Boolean getDisplay() {
        return this.display;
    }

    public Block display(Boolean display) {
        this.setDisplay(display);
        return this;
    }

    public void setDisplay(Boolean display) {
        this.display = display;
    }

    public Integer getOrder() {
        return this.order;
    }

    public Block order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Step getStep() {
        return this.step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public Block step(Step step) {
        this.setStep(step);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Block)) {
            return false;
        }
        return id != null && id.equals(((Block) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Block{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            ", componentName='" + getComponentName() + "'" +
            ", stepDefinitionId='" + getStepDefinitionId() + "'" +
            ", blockDefinitionId='" + getBlockDefinitionId() + "'" +
            ", display='" + getDisplay() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
