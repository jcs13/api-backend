import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStepDefinition, StepDefinition } from '../step-definition.model';
import { StepDefinitionService } from '../service/step-definition.service';

@Injectable({ providedIn: 'root' })
export class StepDefinitionRoutingResolveService implements Resolve<IStepDefinition> {
  constructor(protected service: StepDefinitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStepDefinition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stepDefinition: HttpResponse<StepDefinition>) => {
          if (stepDefinition.body) {
            return of(stepDefinition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StepDefinition());
  }
}
