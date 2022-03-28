import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StepDefinitionService } from '../service/step-definition.service';
import { IStepDefinition, StepDefinition } from '../step-definition.model';

import { StepDefinitionUpdateComponent } from './step-definition-update.component';

describe('StepDefinition Management Update Component', () => {
  let comp: StepDefinitionUpdateComponent;
  let fixture: ComponentFixture<StepDefinitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stepDefinitionService: StepDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StepDefinitionUpdateComponent],
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
      .overrideTemplate(StepDefinitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StepDefinitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stepDefinitionService = TestBed.inject(StepDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const stepDefinition: IStepDefinition = { id: 456 };

      activatedRoute.data = of({ stepDefinition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(stepDefinition));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StepDefinition>>();
      const stepDefinition = { id: 123 };
      jest.spyOn(stepDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stepDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stepDefinition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(stepDefinitionService.update).toHaveBeenCalledWith(stepDefinition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StepDefinition>>();
      const stepDefinition = new StepDefinition();
      jest.spyOn(stepDefinitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stepDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stepDefinition }));
      saveSubject.complete();

      // THEN
      expect(stepDefinitionService.create).toHaveBeenCalledWith(stepDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<StepDefinition>>();
      const stepDefinition = { id: 123 };
      jest.spyOn(stepDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stepDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stepDefinitionService.update).toHaveBeenCalledWith(stepDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
