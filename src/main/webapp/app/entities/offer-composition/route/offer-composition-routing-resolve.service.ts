import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOfferComposition, OfferComposition } from '../offer-composition.model';
import { OfferCompositionService } from '../service/offer-composition.service';

@Injectable({ providedIn: 'root' })
export class OfferCompositionRoutingResolveService implements Resolve<IOfferComposition> {
  constructor(protected service: OfferCompositionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOfferComposition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((offerComposition: HttpResponse<OfferComposition>) => {
          if (offerComposition.body) {
            return of(offerComposition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OfferComposition());
  }
}
