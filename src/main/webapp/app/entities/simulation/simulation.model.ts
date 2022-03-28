import dayjs from 'dayjs/esm';
import { ICourse } from 'app/entities/course/course.model';

export interface ISimulation {
  id?: number;
  name?: string;
  affaire?: string | null;
  client?: string | null;
  parc?: string | null;
  status?: string | null;
  created?: dayjs.Dayjs;
  modified?: dayjs.Dayjs | null;
  userCreation?: string | null;
  userCurrent?: string | null;
  course?: ICourse | null;
  parent?: ISimulation | null;
}

export class Simulation implements ISimulation {
  constructor(
    public id?: number,
    public name?: string,
    public affaire?: string | null,
    public client?: string | null,
    public parc?: string | null,
    public status?: string | null,
    public created?: dayjs.Dayjs,
    public modified?: dayjs.Dayjs | null,
    public userCreation?: string | null,
    public userCurrent?: string | null,
    public course?: ICourse | null,
    public parent?: ISimulation | null
  ) {}
}

export function getSimulationIdentifier(simulation: ISimulation): number | undefined {
  return simulation.id;
}
