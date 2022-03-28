import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlockDefinition, BlockDefinition } from '../block-definition.model';
import { BlockDefinitionService } from '../service/block-definition.service';

@Injectable({ providedIn: 'root' })
export class BlockDefinitionRoutingResolveService implements Resolve<IBlockDefinition> {
  constructor(protected service: BlockDefinitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlockDefinition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blockDefinition: HttpResponse<BlockDefinition>) => {
          if (blockDefinition.body) {
            return of(blockDefinition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlockDefinition());
  }
}
