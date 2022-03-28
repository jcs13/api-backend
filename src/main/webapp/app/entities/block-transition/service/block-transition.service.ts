import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlockTransition, getBlockTransitionIdentifier } from '../block-transition.model';

export type EntityResponseType = HttpResponse<IBlockTransition>;
export type EntityArrayResponseType = HttpResponse<IBlockTransition[]>;

@Injectable({ providedIn: 'root' })
export class BlockTransitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/block-transitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blockTransition: IBlockTransition): Observable<EntityResponseType> {
    return this.http.post<IBlockTransition>(this.resourceUrl, blockTransition, { observe: 'response' });
  }

  update(blockTransition: IBlockTransition): Observable<EntityResponseType> {
    return this.http.put<IBlockTransition>(
      `${this.resourceUrl}/${getBlockTransitionIdentifier(blockTransition) as number}`,
      blockTransition,
      { observe: 'response' }
    );
  }

  partialUpdate(blockTransition: IBlockTransition): Observable<EntityResponseType> {
    return this.http.patch<IBlockTransition>(
      `${this.resourceUrl}/${getBlockTransitionIdentifier(blockTransition) as number}`,
      blockTransition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlockTransition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlockTransition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlockTransitionToCollectionIfMissing(
    blockTransitionCollection: IBlockTransition[],
    ...blockTransitionsToCheck: (IBlockTransition | null | undefined)[]
  ): IBlockTransition[] {
    const blockTransitions: IBlockTransition[] = blockTransitionsToCheck.filter(isPresent);
    if (blockTransitions.length > 0) {
      const blockTransitionCollectionIdentifiers = blockTransitionCollection.map(
        blockTransitionItem => getBlockTransitionIdentifier(blockTransitionItem)!
      );
      const blockTransitionsToAdd = blockTransitions.filter(blockTransitionItem => {
        const blockTransitionIdentifier = getBlockTransitionIdentifier(blockTransitionItem);
        if (blockTransitionIdentifier == null || blockTransitionCollectionIdentifiers.includes(blockTransitionIdentifier)) {
          return false;
        }
        blockTransitionCollectionIdentifiers.push(blockTransitionIdentifier);
        return true;
      });
      return [...blockTransitionsToAdd, ...blockTransitionCollection];
    }
    return blockTransitionCollection;
  }
}
