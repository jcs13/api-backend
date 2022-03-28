import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OfferCompositionService } from '../service/offer-composition.service';
import { IOfferComposition, OfferComposition } from '../offer-composition.model';
import { IOffer } from 'app/entities/offer/offer.model';
import { OfferService } from 'app/entities/offer/service/offer.service';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { CourseDefinitionService } from 'app/entities/course-definition/service/course-definition.service';

import { OfferCompositionUpdateComponent } from './offer-composition-update.component';

describe('OfferComposition Management Update Component', () => {
  let comp: OfferCompositionUpdateComponent;
  let fixture: ComponentFixture<OfferCompositionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offerCompositionService: OfferCompositionService;
  let offerService: OfferService;
  let courseDefinitionService: CourseDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OfferCompositionUpdateComponent],
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
      .overrideTemplate(OfferCompositionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OfferCompositionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offerCompositionService = TestBed.inject(OfferCompositionService);
    offerService = TestBed.inject(OfferService);
    courseDefinitionService = TestBed.inject(CourseDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call offer query and add missing value', () => {
      const offerComposition: IOfferComposition = { id: 456 };
      const offer: IOffer = { id: 77820 };
      offerComposition.offer = offer;

      const offerCollection: IOffer[] = [{ id: 49909 }];
      jest.spyOn(offerService, 'query').mockReturnValue(of(new HttpResponse({ body: offerCollection })));
      const expectedCollection: IOffer[] = [offer, ...offerCollection];
      jest.spyOn(offerService, 'addOfferToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      expect(offerService.query).toHaveBeenCalled();
      expect(offerService.addOfferToCollectionIfMissing).toHaveBeenCalledWith(offerCollection, offer);
      expect(comp.offersCollection).toEqual(expectedCollection);
    });

    it('Should call courseParent query and add missing value', () => {
      const offerComposition: IOfferComposition = { id: 456 };
      const courseParent: ICourseDefinition = { id: 26254 };
      offerComposition.courseParent = courseParent;

      const courseParentCollection: ICourseDefinition[] = [{ id: 87775 }];
      jest.spyOn(courseDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: courseParentCollection })));
      const expectedCollection: ICourseDefinition[] = [courseParent, ...courseParentCollection];
      jest.spyOn(courseDefinitionService, 'addCourseDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      expect(courseDefinitionService.query).toHaveBeenCalled();
      expect(courseDefinitionService.addCourseDefinitionToCollectionIfMissing).toHaveBeenCalledWith(courseParentCollection, courseParent);
      expect(comp.courseParentsCollection).toEqual(expectedCollection);
    });

    it('Should call courseChild query and add missing value', () => {
      const offerComposition: IOfferComposition = { id: 456 };
      const courseChild: ICourseDefinition = { id: 39791 };
      offerComposition.courseChild = courseChild;

      const courseChildCollection: ICourseDefinition[] = [{ id: 50134 }];
      jest.spyOn(courseDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: courseChildCollection })));
      const expectedCollection: ICourseDefinition[] = [courseChild, ...courseChildCollection];
      jest.spyOn(courseDefinitionService, 'addCourseDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      expect(courseDefinitionService.query).toHaveBeenCalled();
      expect(courseDefinitionService.addCourseDefinitionToCollectionIfMissing).toHaveBeenCalledWith(courseChildCollection, courseChild);
      expect(comp.courseChildrenCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offerComposition: IOfferComposition = { id: 456 };
      const offer: IOffer = { id: 1878 };
      offerComposition.offer = offer;
      const courseParent: ICourseDefinition = { id: 99372 };
      offerComposition.courseParent = courseParent;
      const courseChild: ICourseDefinition = { id: 44405 };
      offerComposition.courseChild = courseChild;

      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(offerComposition));
      expect(comp.offersCollection).toContain(offer);
      expect(comp.courseParentsCollection).toContain(courseParent);
      expect(comp.courseChildrenCollection).toContain(courseChild);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OfferComposition>>();
      const offerComposition = { id: 123 };
      jest.spyOn(offerCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offerComposition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(offerCompositionService.update).toHaveBeenCalledWith(offerComposition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OfferComposition>>();
      const offerComposition = new OfferComposition();
      jest.spyOn(offerCompositionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offerComposition }));
      saveSubject.complete();

      // THEN
      expect(offerCompositionService.create).toHaveBeenCalledWith(offerComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OfferComposition>>();
      const offerComposition = { id: 123 };
      jest.spyOn(offerCompositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offerComposition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offerCompositionService.update).toHaveBeenCalledWith(offerComposition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOfferById', () => {
      it('Should return tracked Offer primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOfferById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCourseDefinitionById', () => {
      it('Should return tracked CourseDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCourseDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
