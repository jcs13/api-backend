export interface ICourseDefinition {
  id?: number;
  name?: string;
  label?: string;
}

export class CourseDefinition implements ICourseDefinition {
  constructor(public id?: number, public name?: string, public label?: string) {}
}

export function getCourseDefinitionIdentifier(courseDefinition: ICourseDefinition): number | undefined {
  return courseDefinition.id;
}
