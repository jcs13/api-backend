import { IOffer } from 'app/entities/offer/offer.model';

export interface IBusinessUnit {
  id?: number;
  code?: string;
  name?: string;
  label?: string;
  offers?: IOffer[] | null;
}

export class BusinessUnit implements IBusinessUnit {
  constructor(public id?: number, public code?: string, public name?: string, public label?: string, public offers?: IOffer[] | null) {}
}

export function getBusinessUnitIdentifier(businessUnit: IBusinessUnit): number | undefined {
  return businessUnit.id;
}
