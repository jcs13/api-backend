import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemComponent, ItemComponent } from '../item-component.model';
import { ItemComponentService } from '../service/item-component.service';

@Injectable({ providedIn: 'root' })
export class ItemComponentRoutingResolveService implements Resolve<IItemComponent> {
  constructor(protected service: ItemComponentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemComponent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemComponent: HttpResponse<ItemComponent>) => {
          if (itemComponent.body) {
            return of(itemComponent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ItemComponent());
  }
}
