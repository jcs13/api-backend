import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlockTransition, BlockTransition } from '../block-transition.model';
import { BlockTransitionService } from '../service/block-transition.service';

@Injectable({ providedIn: 'root' })
export class BlockTransitionRoutingResolveService implements Resolve<IBlockTransition> {
  constructor(protected service: BlockTransitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlockTransition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blockTransition: HttpResponse<BlockTransition>) => {
          if (blockTransition.body) {
            return of(blockTransition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlockTransition());
  }
}
