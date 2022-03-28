import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OfferService } from '../service/offer.service';
import { IOffer, Offer } from '../offer.model';
import { IBusinessUnit } from 'app/entities/business-unit/business-unit.model';
import { BusinessUnitService } from 'app/entities/business-unit/service/business-unit.service';

import { OfferUpdateComponent } from './offer-update.component';

describe('Offer Management Update Component', () => {
  let comp: OfferUpdateComponent;
  let fixture: ComponentFixture<OfferUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offerService: OfferService;
  let businessUnitService: BusinessUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OfferUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OfferUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offerService = TestBed.inject(OfferService);
    businessUnitService = TestBed.inject(BusinessUnitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BusinessUnit query and add missing value', () => {
      const offer: IOffer = { id: 456 };
      const businessUnit: IBusinessUnit = { id: 3081 };
      offer.businessUnit = businessUnit;

      const businessUnitCollection: IBusinessUnit[] = [{ id: 91075 }];
      jest.spyOn(businessUnitService, 'query').mockReturnValue(of(new HttpResponse({ body: businessUnitCollection })));
      const additionalBusinessUnits = [businessUnit];
      const expectedCollection: IBusinessUnit[] = [...additionalBusinessUnits, ...businessUnitCollection];
      jest.spyOn(businessUnitService, 'addBusinessUnitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      expect(businessUnitService.query).toHaveBeenCalled();
      expect(businessUnitService.addBusinessUnitToCollectionIfMissing).toHaveBeenCalledWith(
        businessUnitCollection,
        ...additionalBusinessUnits
      );
      expect(comp.businessUnitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offer: IOffer = { id: 456 };
      const businessUnit: IBusinessUnit = { id: 44054 };
      offer.businessUnit = businessUnit;

      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(offer));
      expect(comp.businessUnitsSharedCollection).toContain(businessUnit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Offer>>();
      const offer = { id: 123 };
      jest.spyOn(offerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(offerService.update).toHaveBeenCalledWith(offer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Offer>>();
      const offer = new Offer();
      jest.spyOn(offerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offer }));
      saveSubject.complete();

      // THEN
      expect(offerService.create).toHaveBeenCalledWith(offer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Offer>>();
      const offer = { id: 123 };
      jest.spyOn(offerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offerService.update).toHaveBeenCalledWith(offer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBusinessUnitById', () => {
      it('Should return tracked BusinessUnit primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBusinessUnitById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
