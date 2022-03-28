import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStepTransition } from '../step-transition.model';
import { StepTransitionService } from '../service/step-transition.service';
import { StepTransitionDeleteDialogComponent } from '../delete/step-transition-delete-dialog.component';

@Component({
  selector: 'jhi-step-transition',
  templateUrl: './step-transition.component.html',
})
export class StepTransitionComponent implements OnInit {
  stepTransitions?: IStepTransition[];
  isLoading = false;

  constructor(protected stepTransitionService: StepTransitionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.stepTransitionService.query().subscribe({
      next: (res: HttpResponse<IStepTransition[]>) => {
        this.isLoading = false;
        this.stepTransitions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStepTransition): number {
    return item.id!;
  }

  delete(stepTransition: IStepTransition): void {
    const modalRef = this.modalService.open(StepTransitionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stepTransition = stepTransition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
