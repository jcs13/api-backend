package com.mycompany.process.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StepTransition.
 */
@Entity
@Table(name = "step_transition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StepTransition implements Serializable {

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
    private CourseDefinition courseDefinition;

    @OneToOne
    @JoinColumn(unique = true)
    private StepDefinition current;

    @OneToOne
    @JoinColumn(unique = true)
    private StepDefinition next;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StepTransition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTransition() {
        return this.transition;
    }

    public StepTransition transition(Integer transition) {
        this.setTransition(transition);
        return this;
    }

    public void setTransition(Integer transition) {
        this.transition = transition;
    }

    public CourseDefinition getCourseDefinition() {
        return this.courseDefinition;
    }

    public void setCourseDefinition(CourseDefinition courseDefinition) {
        this.courseDefinition = courseDefinition;
    }

    public StepTransition courseDefinition(CourseDefinition courseDefinition) {
        this.setCourseDefinition(courseDefinition);
        return this;
    }

    public StepDefinition getCurrent() {
        return this.current;
    }

    public void setCurrent(StepDefinition stepDefinition) {
        this.current = stepDefinition;
    }

    public StepTransition current(StepDefinition stepDefinition) {
        this.setCurrent(stepDefinition);
        return this;
    }

    public StepDefinition getNext() {
        return this.next;
    }

    public void setNext(StepDefinition stepDefinition) {
        this.next = stepDefinition;
    }

    public StepTransition next(StepDefinition stepDefinition) {
        this.setNext(stepDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StepTransition)) {
            return false;
        }
        return id != null && id.equals(((StepTransition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StepTransition{" +
            "id=" + getId() +
            ", transition=" + getTransition() +
            "}";
    }
}
