import { IItemComponent } from 'app/entities/item-component/item-component.model';

export interface IBlockDefinition {
  id?: number;
  name?: string;
  label?: string;
  display?: boolean;
  itemComponent?: IItemComponent | null;
}

export class BlockDefinition implements IBlockDefinition {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public display?: boolean,
    public itemComponent?: IItemComponent | null
  ) {
    this.display = this.display ?? false;
  }
}

export function getBlockDefinitionIdentifier(blockDefinition: IBlockDefinition): number | undefined {
  return blockDefinition.id;
}
