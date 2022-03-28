export interface IStepDefinition {
  id?: number;
  name?: string;
  label?: string;
  display?: boolean;
}

export class StepDefinition implements IStepDefinition {
  constructor(public id?: number, public name?: string, public label?: string, public display?: boolean) {
    this.display = this.display ?? false;
  }
}

export function getStepDefinitionIdentifier(stepDefinition: IStepDefinition): number | undefined {
  return stepDefinition.id;
}
