package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StepTransitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StepTransition.class);
        StepTransition stepTransition1 = new StepTransition();
        stepTransition1.setId(1L);
        StepTransition stepTransition2 = new StepTransition();
        stepTransition2.setId(stepTransition1.getId());
        assertThat(stepTransition1).isEqualTo(stepTransition2);
        stepTransition2.setId(2L);
        assertThat(stepTransition1).isNotEqualTo(stepTransition2);
        stepTransition1.setId(null);
        assertThat(stepTransition1).isNotEqualTo(stepTransition2);
    }
}
