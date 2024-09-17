import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { StructureDefinition } from './models/StructureDefinintion';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/structure-definitions/:resource')
  getStructureDefinitionByResource(
    @Param('resource') resource: string,
  ): StructureDefinition {
    console.log(
      'getting structure definition for resource: ',
      JSON.stringify(resource),
    );
    const def = this.appService.getStructureDefinitionByResource(resource);
    if (def) {
      return def;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Structure definition for resource [${resource}] could not be found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/resources')
  getAllResources(): any[] {
    return this.appService.getAllResources();
  }

  @Get('/ValueSet/{valueSetId}/$expand')
  getValueSetExpansion(@Param('valueSetId') valueSetId: string): any {

  }
}
