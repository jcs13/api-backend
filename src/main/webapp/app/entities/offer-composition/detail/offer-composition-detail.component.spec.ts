import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfferCompositionDetailComponent } from './offer-composition-detail.component';

describe('OfferComposition Management Detail Component', () => {
  let comp: OfferCompositionDetailComponent;
  let fixture: ComponentFixture<OfferCompositionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferCompositionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offerComposition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OfferCompositionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OfferCompositionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offerComposition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offerComposition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
