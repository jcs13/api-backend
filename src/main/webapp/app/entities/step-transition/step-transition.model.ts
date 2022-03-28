import { ICourseDefinition } from 'app/entities/course-definition/course-definition.model';
import { IStepDefinition } from 'app/entities/step-definition/step-definition.model';

export interface IStepTransition {
  id?: number;
  transition?: number;
  courseDefinition?: ICourseDefinition | null;
  current?: IStepDefinition | null;
  next?: IStepDefinition | null;
}

export class StepTransition implements IStepTransition {
  constructor(
    public id?: number,
    public transition?: number,
    public courseDefinition?: ICourseDefinition | null,
    public current?: IStepDefinition | null,
    public next?: IStepDefinition | null
  ) {}
}

export function getStepTransitionIdentifier(stepTransition: IStepTransition): number | undefined {
  return stepTransition.id;
}
