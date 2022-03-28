import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OfferService } from '../service/offer.service';

import { OfferComponent } from './offer.component';

describe('Offer Management Component', () => {
  let comp: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;
  let service: OfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OfferComponent],
    })
      .overrideTemplate(OfferComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OfferService);

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
    expect(comp.offers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
