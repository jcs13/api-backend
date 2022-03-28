import { IStep } from 'app/entities/step/step.model';
import { ISimulation } from 'app/entities/simulation/simulation.model';

export interface ICourse {
  id?: number;
  name?: string;
  label?: string;
  offerId?: string;
  steps?: IStep[] | null;
  simulation?: ISimulation | null;
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public name?: string,
    public label?: string,
    public offerId?: string,
    public steps?: IStep[] | null,
    public simulation?: ISimulation | null
  ) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
