import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlockDefinition, getBlockDefinitionIdentifier } from '../block-definition.model';

export type EntityResponseType = HttpResponse<IBlockDefinition>;
export type EntityArrayResponseType = HttpResponse<IBlockDefinition[]>;

@Injectable({ providedIn: 'root' })
export class BlockDefinitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/block-definitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blockDefinition: IBlockDefinition): Observable<EntityResponseType> {
    return this.http.post<IBlockDefinition>(this.resourceUrl, blockDefinition, { observe: 'response' });
  }

  update(blockDefinition: IBlockDefinition): Observable<EntityResponseType> {
    return this.http.put<IBlockDefinition>(
      `${this.resourceUrl}/${getBlockDefinitionIdentifier(blockDefinition) as number}`,
      blockDefinition,
      { observe: 'response' }
    );
  }

  partialUpdate(blockDefinition: IBlockDefinition): Observable<EntityResponseType> {
    return this.http.patch<IBlockDefinition>(
      `${this.resourceUrl}/${getBlockDefinitionIdentifier(blockDefinition) as number}`,
      blockDefinition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlockDefinition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlockDefinition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlockDefinitionToCollectionIfMissing(
    blockDefinitionCollection: IBlockDefinition[],
    ...blockDefinitionsToCheck: (IBlockDefinition | null | undefined)[]
  ): IBlockDefinition[] {
    const blockDefinitions: IBlockDefinition[] = blockDefinitionsToCheck.filter(isPresent);
    if (blockDefinitions.length > 0) {
      const blockDefinitionCollectionIdentifiers = blockDefinitionCollection.map(
        blockDefinitionItem => getBlockDefinitionIdentifier(blockDefinitionItem)!
      );
      const blockDefinitionsToAdd = blockDefinitions.filter(blockDefinitionItem => {
        const blockDefinitionIdentifier = getBlockDefinitionIdentifier(blockDefinitionItem);
        if (blockDefinitionIdentifier == null || blockDefinitionCollectionIdentifiers.includes(blockDefinitionIdentifier)) {
          return false;
        }
        blockDefinitionCollectionIdentifiers.push(blockDefinitionIdentifier);
        return true;
      });
      return [...blockDefinitionsToAdd, ...blockDefinitionCollection];
    }
    return blockDefinitionCollection;
  }
}
