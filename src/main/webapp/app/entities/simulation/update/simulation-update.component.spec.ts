import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SimulationService } from '../service/simulation.service';
import { ISimulation, Simulation } from '../simulation.model';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

import { SimulationUpdateComponent } from './simulation-update.component';

describe('Simulation Management Update Component', () => {
  let comp: SimulationUpdateComponent;
  let fixture: ComponentFixture<SimulationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let simulationService: SimulationService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SimulationUpdateComponent],
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
      .overrideTemplate(SimulationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SimulationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    simulationService = TestBed.inject(SimulationService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call course query and add missing value', () => {
      const simulation: ISimulation = { id: 456 };
      const course: ICourse = { id: 58354 };
      simulation.course = course;

      const courseCollection: ICourse[] = [{ id: 96618 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const expectedCollection: ICourse[] = [course, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(courseCollection, course);
      expect(comp.coursesCollection).toEqual(expectedCollection);
    });

    it('Should call parent query and add missing value', () => {
      const simulation: ISimulation = { id: 456 };
      const parent: ISimulation = { id: 51138 };
      simulation.parent = parent;

      const parentCollection: ISimulation[] = [{ id: 64264 }];
      jest.spyOn(simulationService, 'query').mockReturnValue(of(new HttpResponse({ body: parentCollection })));
      const expectedCollection: ISimulation[] = [parent, ...parentCollection];
      jest.spyOn(simulationService, 'addSimulationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      expect(simulationService.query).toHaveBeenCalled();
      expect(simulationService.addSimulationToCollectionIfMissing).toHaveBeenCalledWith(parentCollection, parent);
      expect(comp.parentsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const simulation: ISimulation = { id: 456 };
      const course: ICourse = { id: 56486 };
      simulation.course = course;
      const parent: ISimulation = { id: 59485 };
      simulation.parent = parent;

      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(simulation));
      expect(comp.coursesCollection).toContain(course);
      expect(comp.parentsCollection).toContain(parent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Simulation>>();
      const simulation = { id: 123 };
      jest.spyOn(simulationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: simulation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(simulationService.update).toHaveBeenCalledWith(simulation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Simulation>>();
      const simulation = new Simulation();
      jest.spyOn(simulationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: simulation }));
      saveSubject.complete();

      // THEN
      expect(simulationService.create).toHaveBeenCalledWith(simulation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Simulation>>();
      const simulation = { id: 123 };
      jest.spyOn(simulationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(simulationService.update).toHaveBeenCalledWith(simulation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCourseById', () => {
      it('Should return tracked Course primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCourseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSimulationById', () => {
      it('Should return tracked Simulation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSimulationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
