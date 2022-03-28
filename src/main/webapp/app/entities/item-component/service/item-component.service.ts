import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemComponent, getItemComponentIdentifier } from '../item-component.model';

export type EntityResponseType = HttpResponse<IItemComponent>;
export type EntityArrayResponseType = HttpResponse<IItemComponent[]>;

@Injectable({ providedIn: 'root' })
export class ItemComponentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-components');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemComponent: IItemComponent): Observable<EntityResponseType> {
    return this.http.post<IItemComponent>(this.resourceUrl, itemComponent, { observe: 'response' });
  }

  update(itemComponent: IItemComponent): Observable<EntityResponseType> {
    return this.http.put<IItemComponent>(`${this.resourceUrl}/${getItemComponentIdentifier(itemComponent) as number}`, itemComponent, {
      observe: 'response',
    });
  }

  partialUpdate(itemComponent: IItemComponent): Observable<EntityResponseType> {
    return this.http.patch<IItemComponent>(`${this.resourceUrl}/${getItemComponentIdentifier(itemComponent) as number}`, itemComponent, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemComponent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemComponent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addItemComponentToCollectionIfMissing(
    itemComponentCollection: IItemComponent[],
    ...itemComponentsToCheck: (IItemComponent | null | undefined)[]
  ): IItemComponent[] {
    const itemComponents: IItemComponent[] = itemComponentsToCheck.filter(isPresent);
    if (itemComponents.length > 0) {
      const itemComponentCollectionIdentifiers = itemComponentCollection.map(
        itemComponentItem => getItemComponentIdentifier(itemComponentItem)!
      );
      const itemComponentsToAdd = itemComponents.filter(itemComponentItem => {
        const itemComponentIdentifier = getItemComponentIdentifier(itemComponentItem);
        if (itemComponentIdentifier == null || itemComponentCollectionIdentifiers.includes(itemComponentIdentifier)) {
          return false;
        }
        itemComponentCollectionIdentifiers.push(itemComponentIdentifier);
        return true;
      });
      return [...itemComponentsToAdd, ...itemComponentCollection];
    }
    return itemComponentCollection;
  }
}
