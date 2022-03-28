import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISimulation, Simulation } from '../simulation.model';
import { SimulationService } from '../service/simulation.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

@Component({
  selector: 'jhi-simulation-update',
  templateUrl: './simulation-update.component.html',
})
export class SimulationUpdateComponent implements OnInit {
  isSaving = false;

  coursesCollection: ICourse[] = [];
  parentsCollection: ISimulation[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    affaire: [],
    client: [],
    parc: [],
    status: [],
    created: [null, [Validators.required]],
    modified: [],
    userCreation: [],
    userCurrent: [],
    course: [],
    parent: [],
  });

  constructor(
    protected simulationService: SimulationService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ simulation }) => {
      this.updateForm(simulation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const simulation = this.createFromForm();
    if (simulation.id !== undefined) {
      this.subscribeToSaveResponse(this.simulationService.update(simulation));
    } else {
      this.subscribeToSaveResponse(this.simulationService.create(simulation));
    }
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  trackSimulationById(index: number, item: ISimulation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISimulation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(simulation: ISimulation): void {
    this.editForm.patchValue({
      id: simulation.id,
      name: simulation.name,
      affaire: simulation.affaire,
      client: simulation.client,
      parc: simulation.parc,
      status: simulation.status,
      created: simulation.created,
      modified: simulation.modified,
      userCreation: simulation.userCreation,
      userCurrent: simulation.userCurrent,
      course: simulation.course,
      parent: simulation.parent,
    });

    this.coursesCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesCollection, simulation.course);
    this.parentsCollection = this.simulationService.addSimulationToCollectionIfMissing(this.parentsCollection, simulation.parent);
  }

  protected loadRelationshipsOptions(): void {
    this.courseService
      .query({ filter: 'simulation-is-null' })
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesCollection = courses));

    this.simulationService
      .query({ filter: 'simulation-is-null' })
      .pipe(map((res: HttpResponse<ISimulation[]>) => res.body ?? []))
      .pipe(
        map((simulations: ISimulation[]) =>
          this.simulationService.addSimulationToCollectionIfMissing(simulations, this.editForm.get('parent')!.value)
        )
      )
      .subscribe((simulations: ISimulation[]) => (this.parentsCollection = simulations));
  }

  protected createFromForm(): ISimulation {
    return {
      ...new Simulation(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      affaire: this.editForm.get(['affaire'])!.value,
      client: this.editForm.get(['client'])!.value,
      parc: this.editForm.get(['parc'])!.value,
      status: this.editForm.get(['status'])!.value,
      created: this.editForm.get(['created'])!.value,
      modified: this.editForm.get(['modified'])!.value,
      userCreation: this.editForm.get(['userCreation'])!.value,
      userCurrent: this.editForm.get(['userCurrent'])!.value,
      course: this.editForm.get(['course'])!.value,
      parent: this.editForm.get(['parent'])!.value,
    };
  }
}
