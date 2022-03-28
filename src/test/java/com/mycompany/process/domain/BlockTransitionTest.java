package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BlockTransitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlockTransition.class);
        BlockTransition blockTransition1 = new BlockTransition();
        blockTransition1.setId(1L);
        BlockTransition blockTransition2 = new BlockTransition();
        blockTransition2.setId(blockTransition1.getId());
        assertThat(blockTransition1).isEqualTo(blockTransition2);
        blockTransition2.setId(2L);
        assertThat(blockTransition1).isNotEqualTo(blockTransition2);
        blockTransition1.setId(null);
        assertThat(blockTransition1).isNotEqualTo(blockTransition2);
    }
}
