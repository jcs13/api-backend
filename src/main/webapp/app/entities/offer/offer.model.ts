import { IBusinessUnit } from 'app/entities/business-unit/business-unit.model';

export interface IOffer {
  id?: number;
  name?: string;
  label?: string;
  businessUnit?: IBusinessUnit | null;
}

export class Offer implements IOffer {
  constructor(public id?: number, public name?: string, public label?: string, public businessUnit?: IBusinessUnit | null) {}
}

export function getOfferIdentifier(offer: IOffer): number | undefined {
  return offer.id;
}
