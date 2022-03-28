package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemComponentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemComponent.class);
        ItemComponent itemComponent1 = new ItemComponent();
        itemComponent1.setId(1L);
        ItemComponent itemComponent2 = new ItemComponent();
        itemComponent2.setId(itemComponent1.getId());
        assertThat(itemComponent1).isEqualTo(itemComponent2);
        itemComponent2.setId(2L);
        assertThat(itemComponent1).isNotEqualTo(itemComponent2);
        itemComponent1.setId(null);
        assertThat(itemComponent1).isNotEqualTo(itemComponent2);
    }
}
