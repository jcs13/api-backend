import { IStepDefinition } from 'app/entities/step-definition/step-definition.model';
import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { IBlockDefinition } from 'app/entities/block-definition/block-definition.model';

export interface IBlockTransition {
  id?: number;
  transition?: number;
  stepDefinition?: IStepDefinition | null;
  courseDefinition?: ICourseDefinition | null;
  current?: IBlockDefinition | null;
  next?: IBlockDefinition | null;
}

export class BlockTransition implements IBlockTransition {
  constructor(
    public id?: number,
    public transition?: number,
    public stepDefinition?: IStepDefinition | null,
    public courseDefinition?: ICourseDefinition | null,
    public current?: IBlockDefinition | null,
    public next?: IBlockDefinition | null
  ) {}
}

export function getBlockTransitionIdentifier(blockTransition: IBlockTransition): number | undefined {
  return blockTransition.id;
}
