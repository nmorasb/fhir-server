
export class StructureDefinition {
  baseDefinition: StructureDefinition;
  referencedDefinitions: StructureDefinition[];

  constructor(baseDefinition: StructureDefinition, referencedDefinitions: StructureDefinition[]) {
    this.baseDefinition = baseDefinition;
    this.referencedDefinitions = referencedDefinitions;
  }
}