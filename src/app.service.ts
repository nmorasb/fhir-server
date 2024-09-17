import { Injectable } from '@nestjs/common';
import { StructureDefinition } from './models/StructureDefinintion';
import * as qiCoreIndex from 'hl7.fhir.us.qicore/.index.json';
import * as fhirIndex from 'hl7.fhir.r4.core/.index.json';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAllResources(): any[] {
    return qiCoreIndex?.files
      .filter((f) => f.kind === 'resource')
      .map((f) => f.type);
  }

  getFileFromIndex(resource: string, index: any): any {
    return index?.files.find((f) => {
      // if (f.kind === "resource") {
      //   console.log("checking resource: ", JSON.stringify(f));
      //   console.log("type of: ", typeof f);
      //   const upperCaseType = f.type?.toUpperCase();
      //   console.log("upperCaseType: ", upperCaseType);
      //   console.log("type of: ", typeof upperCaseType);
      //   console.log("type: ", upperCaseType.equals("yes"));
      // }
      return (
        (f.kind === 'resource' ||
          f.kind === 'complex-type' ||
          f.kind === 'primitive-type') &&
        f.type?.toUpperCase() === resource?.toUpperCase()
      );
    });
  }

  getStructureDefinitionPathForResource(resource: string): string {
    let file = this.getFileFromIndex(resource, qiCoreIndex);
    if (file) {
      return `hl7.fhir.us.qicore/${file.filename}`;
    } else {
      file = this.getFileFromIndex(resource, fhirIndex);
      return !!file ? `hl7.fhir.r4.core/${file.filename}` : null;
    }
  }

  getStructureDefinitionByResource(resource: string): StructureDefinition {
    // const path = `hl7.fhir.us.qicore/StructureDefinition-qicore-${resource.toLowerCase()}.json`;
    const path = this.getStructureDefinitionPathForResource(resource);
    console.log(`path for resource [${resource}]: `, path);
    // console.log("loaded json: ", json);
    let def = null;
    if (path) {
      const resourceJson = require(path);
      def = new StructureDefinition(resource, resourceJson);

      this.getStructureDefinitionsForResource(resource);
    }

    return def;
  }

  getStructureDefinitionByResourceAA(resource: string): StructureDefinition {
    const path = this.getStructureDefinitionPathForResource(resource);
    const resourceJson = require(path);
    return new StructureDefinition(resource, resourceJson);
  }

  // what the heck was I doing with this function again?
  // I think the point of this was to recursively build an object
  // would include all StructureDefinitions for everything needed to
  // build the top-level resource in a complete manner
  getStructureDefinitionsForResource(
    resource: string,
    knownTypes: string[] = [],
  ): StructureDefinition[] {
    const definitions = [];
    const root = this.getStructureDefinitionByResourceAA(resource);
    // definitions.push(root);
    if (root.definition) {
      // console.log("root.definition: ", JSON.stringify(root.definition?.snapshot, null, 2));
      for (const element of root.definition?.snapshot?.element) {
        // determine the type of the element and load that into the structure definition array
        console.log(
          `Type of element [${element.path}] is:`,
          JSON.stringify(element.type),
        );
        const type = element.type;
        if (Array.isArray(type) && type.length > 1) {
          console.log('!!!!! MORE THAN ONE TYPE - ', element.path);
        }
        // const referenced = this.getStructureDefinitionsForResource()
      }
    }

    return definitions;
  }
}
