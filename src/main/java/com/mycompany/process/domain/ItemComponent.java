package com.mycompany.process.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemComponent.
 */
@Entity
@Table(name = "item_component")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ItemComponent implements Serializable {

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

    @JsonIgnoreProperties(value = { "itemComponent" }, allowSetters = true)
    @OneToOne(mappedBy = "itemComponent")
    private BlockDefinition blockDefinition;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemComponent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ItemComponent name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BlockDefinition getBlockDefinition() {
        return this.blockDefinition;
    }

    public void setBlockDefinition(BlockDefinition blockDefinition) {
        if (this.blockDefinition != null) {
            this.blockDefinition.setItemComponent(null);
        }
        if (blockDefinition != null) {
            blockDefinition.setItemComponent(this);
        }
        this.blockDefinition = blockDefinition;
    }

    public ItemComponent blockDefinition(BlockDefinition blockDefinition) {
        this.setBlockDefinition(blockDefinition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemComponent)) {
            return false;
        }
        return id != null && id.equals(((ItemComponent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemComponent{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
