import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStepTransition, StepTransition } from '../step-transition.model';
import { StepTransitionService } from '../service/step-transition.service';

@Injectable({ providedIn: 'root' })
export class StepTransitionRoutingResolveService implements Resolve<IStepTransition> {
  constructor(protected service: StepTransitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStepTransition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stepTransition: HttpResponse<StepTransition>) => {
          if (stepTransition.body) {
            return of(stepTransition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StepTransition());
  }
}
