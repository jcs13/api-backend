package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StepDefinitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StepDefinition.class);
        StepDefinition stepDefinition1 = new StepDefinition();
        stepDefinition1.setId(1L);
        StepDefinition stepDefinition2 = new StepDefinition();
        stepDefinition2.setId(stepDefinition1.getId());
        assertThat(stepDefinition1).isEqualTo(stepDefinition2);
        stepDefinition2.setId(2L);
        assertThat(stepDefinition1).isNotEqualTo(stepDefinition2);
        stepDefinition1.setId(null);
        assertThat(stepDefinition1).isNotEqualTo(stepDefinition2);
    }
}
