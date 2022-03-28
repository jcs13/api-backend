import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlockTransitionService } from '../service/block-transition.service';
import { IBlockTransition, BlockTransition } from '../block-transition.model';
import { IStepDefinition } from 'app/entities/step-definition/step-definition.model';
import { StepDefinitionService } from 'app/entities/step-definition/service/step-definition.service';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { CourseDefinitionService } from 'app/entities/course-definition/service/course-definition.service';
import { IBlockDefinition } from 'app/entities/block-definition/block-definition.model';
import { BlockDefinitionService } from 'app/entities/block-definition/service/block-definition.service';

import { BlockTransitionUpdateComponent } from './block-transition-update.component';

describe('BlockTransition Management Update Component', () => {
  let comp: BlockTransitionUpdateComponent;
  let fixture: ComponentFixture<BlockTransitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blockTransitionService: BlockTransitionService;
  let stepDefinitionService: StepDefinitionService;
  let courseDefinitionService: CourseDefinitionService;
  let blockDefinitionService: BlockDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlockTransitionUpdateComponent],
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
      .overrideTemplate(BlockTransitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlockTransitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blockTransitionService = TestBed.inject(BlockTransitionService);
    stepDefinitionService = TestBed.inject(StepDefinitionService);
    courseDefinitionService = TestBed.inject(CourseDefinitionService);
    blockDefinitionService = TestBed.inject(BlockDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call stepDefinition query and add missing value', () => {
      const blockTransition: IBlockTransition = { id: 456 };
      const stepDefinition: IStepDefinition = { id: 65832 };
      blockTransition.stepDefinition = stepDefinition;

      const stepDefinitionCollection: IStepDefinition[] = [{ id: 70494 }];
      jest.spyOn(stepDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: stepDefinitionCollection })));
      const expectedCollection: IStepDefinition[] = [stepDefinition, ...stepDefinitionCollection];
      jest.spyOn(stepDefinitionService, 'addStepDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      expect(stepDefinitionService.query).toHaveBeenCalled();
      expect(stepDefinitionService.addStepDefinitionToCollectionIfMissing).toHaveBeenCalledWith(stepDefinitionCollection, stepDefinition);
      expect(comp.stepDefinitionsCollection).toEqual(expectedCollection);
    });

    it('Should call courseDefinition query and add missing value', () => {
      const blockTransition: IBlockTransition = { id: 456 };
      const courseDefinition: ICourseDefinition = { id: 20477 };
      blockTransition.courseDefinition = courseDefinition;

      const courseDefinitionCollection: ICourseDefinition[] = [{ id: 82228 }];
      jest.spyOn(courseDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: courseDefinitionCollection })));
      const expectedCollection: ICourseDefinition[] = [courseDefinition, ...courseDefinitionCollection];
      jest.spyOn(courseDefinitionService, 'addCourseDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      expect(courseDefinitionService.query).toHaveBeenCalled();
      expect(courseDefinitionService.addCourseDefinitionToCollectionIfMissing).toHaveBeenCalledWith(
        courseDefinitionCollection,
        courseDefinition
      );
      expect(comp.courseDefinitionsCollection).toEqual(expectedCollection);
    });

    it('Should call current query and add missing value', () => {
      const blockTransition: IBlockTransition = { id: 456 };
      const current: IBlockDefinition = { id: 15880 };
      blockTransition.current = current;

      const currentCollection: IBlockDefinition[] = [{ id: 42400 }];
      jest.spyOn(blockDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: currentCollection })));
      const expectedCollection: IBlockDefinition[] = [current, ...currentCollection];
      jest.spyOn(blockDefinitionService, 'addBlockDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      expect(blockDefinitionService.query).toHaveBeenCalled();
      expect(blockDefinitionService.addBlockDefinitionToCollectionIfMissing).toHaveBeenCalledWith(currentCollection, current);
      expect(comp.currentsCollection).toEqual(expectedCollection);
    });

    it('Should call next query and add missing value', () => {
      const blockTransition: IBlockTransition = { id: 456 };
      const next: IBlockDefinition = { id: 82786 };
      blockTransition.next = next;

      const nextCollection: IBlockDefinition[] = [{ id: 96449 }];
      jest.spyOn(blockDefinitionService, 'query').mockReturnValue(of(new HttpResponse({ body: nextCollection })));
      const expectedCollection: IBlockDefinition[] = [next, ...nextCollection];
      jest.spyOn(blockDefinitionService, 'addBlockDefinitionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      expect(blockDefinitionService.query).toHaveBeenCalled();
      expect(blockDefinitionService.addBlockDefinitionToCollectionIfMissing).toHaveBeenCalledWith(nextCollection, next);
      expect(comp.nextsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const blockTransition: IBlockTransition = { id: 456 };
      const stepDefinition: IStepDefinition = { id: 96047 };
      blockTransition.stepDefinition = stepDefinition;
      const courseDefinition: ICourseDefinition = { id: 83363 };
      blockTransition.courseDefinition = courseDefinition;
      const current: IBlockDefinition = { id: 92750 };
      blockTransition.current = current;
      const next: IBlockDefinition = { id: 50896 };
      blockTransition.next = next;

      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(blockTransition));
      expect(comp.stepDefinitionsCollection).toContain(stepDefinition);
      expect(comp.courseDefinitionsCollection).toContain(courseDefinition);
      expect(comp.currentsCollection).toContain(current);
      expect(comp.nextsCollection).toContain(next);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlockTransition>>();
      const blockTransition = { id: 123 };
      jest.spyOn(blockTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blockTransition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blockTransitionService.update).toHaveBeenCalledWith(blockTransition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlockTransition>>();
      const blockTransition = new BlockTransition();
      jest.spyOn(blockTransitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blockTransition }));
      saveSubject.complete();

      // THEN
      expect(blockTransitionService.create).toHaveBeenCalledWith(blockTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlockTransition>>();
      const blockTransition = { id: 123 };
      jest.spyOn(blockTransitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blockTransition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blockTransitionService.update).toHaveBeenCalledWith(blockTransition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackStepDefinitionById', () => {
      it('Should return tracked StepDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStepDefinitionById(0, entity);
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

    describe('trackBlockDefinitionById', () => {
      it('Should return tracked BlockDefinition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBlockDefinitionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
