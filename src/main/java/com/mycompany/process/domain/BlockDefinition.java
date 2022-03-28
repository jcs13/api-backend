package com.mycompany.process.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BlockDefinition.
 */
@Entity
@Table(name = "block_definition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BlockDefinition implements Serializable {

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
    @Column(name = "display", nullable = false)
    private Boolean display;

    @JsonIgnoreProperties(value = { "blockDefinition" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ItemComponent itemComponent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BlockDefinition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BlockDefinition name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public BlockDefinition label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Boolean getDisplay() {
        return this.display;
    }

    public BlockDefinition display(Boolean display) {
        this.setDisplay(display);
        return this;
    }

    public void setDisplay(Boolean display) {
        this.display = display;
    }

    public ItemComponent getItemComponent() {
        return this.itemComponent;
    }

    public void setItemComponent(ItemComponent itemComponent) {
        this.itemComponent = itemComponent;
    }

    public BlockDefinition itemComponent(ItemComponent itemComponent) {
        this.setItemComponent(itemComponent);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BlockDefinition)) {
            return false;
        }
        return id != null && id.equals(((BlockDefinition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BlockDefinition{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", label='" + getLabel() + "'" +
            ", display='" + getDisplay() + "'" +
            "}";
    }
}
