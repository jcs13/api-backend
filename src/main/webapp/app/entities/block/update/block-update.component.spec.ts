import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlockService } from '../service/block.service';
import { IBlock, Block } from '../block.model';
import { IStep } from 'app/entities/step/step.model';
import { StepService } from 'app/entities/step/service/step.service';

import { BlockUpdateComponent } from './block-update.component';

describe('Block Management Update Component', () => {
  let comp: BlockUpdateComponent;
  let fixture: ComponentFixture<BlockUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blockService: BlockService;
  let stepService: StepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlockUpdateComponent],
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
      .overrideTemplate(BlockUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlockUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blockService = TestBed.inject(BlockService);
    stepService = TestBed.inject(StepService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Step query and add missing value', () => {
      const block: IBlock = { id: 456 };
      const step: IStep = { id: 68177 };
      block.step = step;

      const stepCollection: IStep[] = [{ id: 71516 }];
      jest.spyOn(stepService, 'query').mockReturnValue(of(new HttpResponse({ body: stepCollection })));
      const additionalSteps = [step];
      const expectedCollection: IStep[] = [...additionalSteps, ...stepCollection];
      jest.spyOn(stepService, 'addStepToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(stepService.query).toHaveBeenCalled();
      expect(stepService.addStepToCollectionIfMissing).toHaveBeenCalledWith(stepCollection, ...additionalSteps);
      expect(comp.stepsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const block: IBlock = { id: 456 };
      const step: IStep = { id: 64264 };
      block.step = step;

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(block));
      expect(comp.stepsSharedCollection).toContain(step);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Block>>();
      const block = { id: 123 };
      jest.spyOn(blockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ block });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: block }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blockService.update).toHaveBeenCalledWith(block);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Block>>();
      const block = new Block();
      jest.spyOn(blockService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ block });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: block }));
      saveSubject.complete();

      // THEN
      expect(blockService.create).toHaveBeenCalledWith(block);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Block>>();
      const block = { id: 123 };
      jest.spyOn(blockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ block });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blockService.update).toHaveBeenCalledWith(block);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackStepById', () => {
      it('Should return tracked Step primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStepById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
