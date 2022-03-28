import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OfferCompositionService } from '../service/offer-composition.service';

import { OfferCompositionComponent } from './offer-composition.component';

describe('OfferComposition Management Component', () => {
  let comp: OfferCompositionComponent;
  let fixture: ComponentFixture<OfferCompositionComponent>;
  let service: OfferCompositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OfferCompositionComponent],
    })
      .overrideTemplate(OfferCompositionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferCompositionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfferCompositionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.offerCompositions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
