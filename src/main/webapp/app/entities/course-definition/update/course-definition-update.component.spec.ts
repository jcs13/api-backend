import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CourseDefinitionService } from '../service/course-definition.service';
import { ICourseDefinition, CourseDefinition } from '../course-definition.model';

import { CourseDefinitionUpdateComponent } from './course-definition-update.component';

describe('CourseDefinition Management Update Component', () => {
  let comp: CourseDefinitionUpdateComponent;
  let fixture: ComponentFixture<CourseDefinitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let courseDefinitionService: CourseDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CourseDefinitionUpdateComponent],
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
      .overrideTemplate(CourseDefinitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CourseDefinitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    courseDefinitionService = TestBed.inject(CourseDefinitionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const courseDefinition: ICourseDefinition = { id: 456 };

      activatedRoute.data = of({ courseDefinition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(courseDefinition));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CourseDefinition>>();
      const courseDefinition = { id: 123 };
      jest.spyOn(courseDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courseDefinition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(courseDefinitionService.update).toHaveBeenCalledWith(courseDefinition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CourseDefinition>>();
      const courseDefinition = new CourseDefinition();
      jest.spyOn(courseDefinitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: courseDefinition }));
      saveSubject.complete();

      // THEN
      expect(courseDefinitionService.create).toHaveBeenCalledWith(courseDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CourseDefinition>>();
      const courseDefinition = { id: 123 };
      jest.spyOn(courseDefinitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseDefinition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(courseDefinitionService.update).toHaveBeenCalledWith(courseDefinition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
