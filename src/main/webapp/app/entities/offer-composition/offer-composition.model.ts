import { IOffer } from 'app/entities/offer/offer.model';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';

export interface IOfferComposition {
  id?: number;
  inheritanceOrder?: number;
  offer?: IOffer | null;
  courseParent?: ICourseDefinition | null;
  courseChild?: ICourseDefinition | null;
}

export class OfferComposition implements IOfferComposition {
  constructor(
    public id?: number,
    public inheritanceOrder?: number,
    public offer?: IOffer | null,
    public courseParent?: ICourseDefinition | null,
    public courseChild?: ICourseDefinition | null
  ) {}
}

export function getOfferCompositionIdentifier(offerComposition: IOfferComposition): number | undefined {
  return offerComposition.id;
}
