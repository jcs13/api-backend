package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlockDefinitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlockDefinition.class);
        BlockDefinition blockDefinition1 = new BlockDefinition();
        blockDefinition1.setId(1L);
        BlockDefinition blockDefinition2 = new BlockDefinition();
        blockDefinition2.setId(blockDefinition1.getId());
        assertThat(blockDefinition1).isEqualTo(blockDefinition2);
        blockDefinition2.setId(2L);
        assertThat(blockDefinition1).isNotEqualTo(blockDefinition2);
        blockDefinition1.setId(null);
        assertThat(blockDefinition1).isNotEqualTo(blockDefinition2);
    }
}
