
export class StructureDefinition {
    path: string;
    definition: any;
    primaryCodePath: string;

    constructor(path: string, definition: any) {
        this.path = path;
        this.definition = definition;
    }
}