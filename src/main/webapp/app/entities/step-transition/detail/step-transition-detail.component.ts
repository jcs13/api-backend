import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStepTransition } from '../step-transition.model';

@Component({
  selector: 'jhi-step-transition-detail',
  templateUrl: './step-transition-detail.component.html',
})
export class StepTransitionDetailComponent implements OnInit {
  stepTransition: IStepTransition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stepTransition }) => {
      this.stepTransition = stepTransition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
