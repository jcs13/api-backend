import { IBlock } from 'app/entities/block/block.model';
import { ICourse } from 'app/entities/course/course.model';

export interface IStep {
  id?: number;
  name?: string;
  label?: string;
  stepDefinitionId?: string;
  display?: boolean;
  order?: number;
  blocks?: IBlock[] | null;
  course?: ICourse | null;
}

export class Step implements IStep {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public stepDefinitionId?: string,
    public display?: boolean,
    public order?: number,
    public blocks?: IBlock[] | null,
    public course?: ICourse | null
  ) {
    this.display = this.display ?? false;
  }
}

export function getStepIdentifier(step: IStep): number | undefined {
  return step.id;
}
