package com.mycompany.process.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.process.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OfferCompositionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OfferComposition.class);
        OfferComposition offerComposition1 = new OfferComposition();
        offerComposition1.setId(1L);
        OfferComposition offerComposition2 = new OfferComposition();
        offerComposition2.setId(offerComposition1.getId());
        assertThat(offerComposition1).isEqualTo(offerComposition2);
        offerComposition2.setId(2L);
        assertThat(offerComposition1).isNotEqualTo(offerComposition2);
        offerComposition1.setId(null);
        assertThat(offerComposition1).isNotEqualTo(offerComposition2);
    }
}
