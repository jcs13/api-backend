import { IBlockDefinition } from 'app/entities/block-definition/block-definition.model';

export interface IItemComponent {
  id?: number;
  name?: string;
  blockDefinition?: IBlockDefinition | null;
}

export class ItemComponent implements IItemComponent {
  constructor(public id?: number, public name?: string, public blockDefinition?: IBlockDefinition | null) {}
}

export function getItemComponentIdentifier(itemComponent: IItemComponent): number | undefined {
  return itemComponent.id;
}
