import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StepTransitionService } from '../service/step-transition.service';
import { IStepTransition, StepTransition } from '../step-transition.model';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { CourseDefinitionService } from 'app/entities/course-definition/service/course-definition.service';
import { IStepDefinition } from 'app/entities/step-definition/step-definition.model';
import { StepDefinitionService } from 'app/entities/step-definition/service/step-definition.service';

import { StepTransitionUpdateComponent } from './step-transition-update.component';

describe('StepTransition Management Update Component', () => {
  let comp: StepTransitionUpdateComponent;
  let fixture: ComponentFixture<StepTransitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stepTransitionService: StepTransitionService;
  let courseDefinitionService: CourseDefinitionService;
  let stepDefinitionService: StepDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StepTransitionUpdateComponent],
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
      .overrideTemplate(StepTransitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StepTransitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stepTransitionService = TestBed.inject(StepTransitionService);
    courseDefinitionService = TestBed.inject(CourseDefinitionService);
    stepDefinitionService = TestBed.inject(StepDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call courseDefinition query and add missing value', () => {
      const stepTransition: IStepTransition = { id: 456 };
      const courseDefinition: ICourseDefinition = { id: 80806 };
      stepTransition.courseDefinition = courseDefinition;

      const courseDefinitionCollection: ICourseDefinition[] = [{ id: 87727 }];
      jest.spyOn(courseDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: courseDefinitionCollection })));
      const expectedCollection: ICourseDefinition[] = [courseDefinition, ...courseDefinitionCollection];
      jest.spyOn(courseDefinitionService, 'addCourseDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      expect(courseDefinitionService.query).toHaveBeenCalled();
      expect(courseDefinitionService.addCourseDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        courseDefinitionCollection,
        courseDefinition
      );
      expect(comp.courseDefinitionsCollection).toEqual(expectedCollection);
    });

    it('Should call current query and add missing value', () => {
      const stepTransition: IStepTransition = { id: 456 };
      const current: IStepDefinition = { id: 1191 };
      stepTransition.current = current;

      const currentCollection: IStepDefinition[] = [{ id: 8752 }];
      jest.spyOn(stepDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: currentCollection })));
      const expectedCollection: IStepDefinition[] = [current, ...currentCollection];
      jest.spyOn(stepDefinitionService, 'addStepDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      expect(stepDefinitionService.query).toHaveBeenCalled();
      expect(stepDefinitionService.addStepDefinitionToCollectionIfMissing).toHaveBeenCalledWith(currentCollection, current);
      expect(comp.currentsCollection).toEqual(expectedCollection);
    });

    it('Should call next query and add missing value', () => {
      const stepTransition: IStepTransition = { id: 456 };
      const next: IStepDefinition = { id: 37127 };
      stepTransition.next = next;

      const nextCollection: IStepDefinition[] = [{ id: 41718 }];
      jest.spyOn(stepDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: nextCollection })));
      const expectedCollection: IStepDefinition[] = [next, ...nextCollection];
      jest.spyOn(stepDefinitionService, 'addStepDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      expect(stepDefinitionService.query).toHaveBeenCalled();
      expect(stepDefinitionService.addStepDefinitionToCollectionIfMissing).toHaveBeenCalledWith(nextCollection, next);
      expect(comp.nextsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const stepTransition: IStepTransition = { id: 456 };
      const courseDefinition: ICourseDefinition = { id: 62895 };
      stepTransition.courseDefinition = courseDefinition;
      const current: IStepDefinition = { id: 37967 };
      stepTransition.current = current;
      const next: IStepDefinition = { id: 61213 };
      stepTransition.next = next;

      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(stepTransition));
      expect(comp.courseDefinitionsCollection).toContain(courseDefinition);
      expect(comp.currentsCollection).toContain(current);
      expect(comp.nextsCollection).toContain(next);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StepTransition>>();
      const stepTransition = { id: 123 };
      jest.spyOn(stepTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stepTransition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(stepTransitionService.update).toHaveBeenCalledWith(stepTransition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StepTransition>>();
      const stepTransition = new StepTransition();
      jest.spyOn(stepTransitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stepTransition }));
      saveSubject.complete();

      // THEN
      expect(stepTransitionService.create).toHaveBeenCalledWith(stepTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StepTransition>>();
      const stepTransition = { id: 123 };
      jest.spyOn(stepTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stepTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stepTransitionService.update).toHaveBeenCalledWith(stepTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCourseDefinitionById', () => {
      it('Should return tracked CourseDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCourseDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackStepDefinitionById', () => {
      it('Should return tracked StepDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStepDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
