package com.mycompany.process.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BlockTransition.
 */
@Entity
@Table(name = "block_transition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BlockTransition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "transition", nullable = false)
    private Integer transition;

    @OneToOne
    @JoinColumn(unique = true)
    private StepDefinition stepDefinition;

    @OneToOne
    @JoinColumn(unique = true)
    private CourseDefinition courseDefinition;

    @JsonIgnoreProperties(value = { "itemComponent" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BlockDefinition current;

    @JsonIgnoreProperties(value = { "itemComponent" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BlockDefinition next;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BlockTransition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTransition() {
        return this.transition;
    }

    public BlockTransition transition(Integer transition) {
        this.setTransition(transition);
        return this;
    }

    public void setTransition(Integer transition) {
        this.transition = transition;
    }

    public StepDefinition getStepDefinition() {
        return this.stepDefinition;
    }

    public void setStepDefinition(StepDefinition stepDefinition) {
        this.stepDefinition = stepDefinition;
    }

    public BlockTransition stepDefinition(StepDefinition stepDefinition) {
        this.setStepDefinition(stepDefinition);
        return this;
    }

    public CourseDefinition getCourseDefinition() {
        return this.courseDefinition;
    }

    public void setCourseDefinition(CourseDefinition courseDefinition) {
        this.courseDefinition = courseDefinition;
    }

    public BlockTransition courseDefinition(CourseDefinition courseDefinition) {
        this.setCourseDefinition(courseDefinition);
        return this;
    }

    public BlockDefinition getCurrent() {
        return this.current;
    }

    public void setCurrent(BlockDefinition blockDefinition) {
        this.current = blockDefinition;
    }

    public BlockTransition current(BlockDefinition blockDefinition) {
        this.setCurrent(blockDefinition);
        return this;
    }

    public BlockDefinition getNext() {
        return this.next;
    }

    public void setNext(BlockDefinition blockDefinition) {
        this.next = blockDefinition;
    }

    public BlockTransition next(BlockDefinition blockDefinition) {
        this.setNext(blockDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BlockTransition)) {
            return false;
        }
        return id != null && id.equals(((BlockTransition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BlockTransition{" +
            "id=" + getId() +
            ", transition=" + getTransition() +
            "}";
    }
}
