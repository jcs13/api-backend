import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStepDefinition } from '../step-definition.model';

@Component({
  selector: 'jhi-step-definition-detail',
  templateUrl: './step-definition-detail.component.html',
})
export class StepDefinitionDetailComponent implements OnInit {
  stepDefinition: IStepDefinition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stepDefinition }) => {
      this.stepDefinition = stepDefinition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
