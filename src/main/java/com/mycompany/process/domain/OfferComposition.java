package com.mycompany.process.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OfferComposition.
 */
@Entity
@Table(name = "offer_composition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OfferComposition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "inheritance_order", nullable = false)
    private Integer inheritanceOrder;

    @JsonIgnoreProperties(value = { "businessUnit" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Offer offer;

    @OneToOne
    @JoinColumn(unique = true)
    private CourseDefinition courseParent;

    @OneToOne
    @JoinColumn(unique = true)
    private CourseDefinition courseChild;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OfferComposition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getInheritanceOrder() {
        return this.inheritanceOrder;
    }

    public OfferComposition inheritanceOrder(Integer inheritanceOrder) {
        this.setInheritanceOrder(inheritanceOrder);
        return this;
    }

    public void setInheritanceOrder(Integer inheritanceOrder) {
        this.inheritanceOrder = inheritanceOrder;
    }

    public Offer getOffer() {
        return this.offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }

    public OfferComposition offer(Offer offer) {
        this.setOffer(offer);
        return this;
    }

    public CourseDefinition getCourseParent() {
        return this.courseParent;
    }

    public void setCourseParent(CourseDefinition courseDefinition) {
        this.courseParent = courseDefinition;
    }

    public OfferComposition courseParent(CourseDefinition courseDefinition) {
        this.setCourseParent(courseDefinition);
        return this;
    }

    public CourseDefinition getCourseChild() {
        return this.courseChild;
    }

    public void setCourseChild(CourseDefinition courseDefinition) {
        this.courseChild = courseDefinition;
    }

    public OfferComposition courseChild(CourseDefinition courseDefinition) {
        this.setCourseChild(courseDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OfferComposition)) {
            return false;
        }
        return id != null && id.equals(((OfferComposition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OfferComposition{" +
            "id=" + getId() +
            ", inheritanceOrder=" + getInheritanceOrder() +
            "}";
    }
}
