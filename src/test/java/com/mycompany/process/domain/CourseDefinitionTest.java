package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CourseDefinitionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CourseDefinition.class);
        CourseDefinition courseDefinition1 = new CourseDefinition();
        courseDefinition1.setId(1L);
        CourseDefinition courseDefinition2 = new CourseDefinition();
        courseDefinition2.setId(courseDefinition1.getId());
        assertThat(courseDefinition1).isEqualTo(courseDefinition2);
        courseDefinition2.setId(2L);
        assertThat(courseDefinition1).isNotEqualTo(courseDefinition2);
        courseDefinition1.setId(null);
        assertThat(courseDefinition1).isNotEqualTo(courseDefinition2);
    }
}
