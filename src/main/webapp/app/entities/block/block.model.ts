import { IStep } from 'app/entities/step/step.model';

export interface IBlock {
  id?: number;
  name?: string;
  label?: string;
  componentName?: string;
  stepDefinitionId?: string;
  blockDefinitionId?: string;
  display?: boolean;
  order?: number;
  step?: IStep | null;
}

export class Block implements IBlock {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public componentName?: string,
    public stepDefinitionId?: string,
    public blockDefinitionId?: string,
    public display?: boolean,
    public order?: number,
    public step?: IStep | null
  ) {
    this.display = this.display ?? false;
  }
}

export function getBlockIdentifier(block: IBlock): number | undefined {
  return block.id;
}
