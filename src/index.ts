import {
  DockerCompose,
  DockerComposeService,
  Makefile,
  Project,
  SampleDir,
} from 'projen';
import { NodePackage, TypescriptConfig } from 'projen/lib/javascript';
import {
  generateDockerCompose,
  generateEsLint,
  generateMakeFile,
  generateNodePackage,
  generatePrettier,
  generateTypescriptConfig,
} from './synthesised-files';

import { BunTypescriptOptions } from './types';
import { ProjenrcTs } from 'projen/lib/typescript';
import { cleanupProjectDefaults } from './utils';
import { generateAppService } from './docker-services';

// Annoying workaround to get JSII & typescript behaving
export * from './types/project-options';

/**
 * Create a basic Bun project written in Typescript
 */
export class BunTypescript extends Project {
  /**
   * NPM package object associated with this project.
   */
  public readonly package: NodePackage;

  /**
   * Makefile used as the entry point for this project.
   */
  public readonly makefile: Makefile;

  /**
   * Generated Typescript Config File
   */
  public readonly tsConfig: TypescriptConfig;

  /**
   * Docker compose service that is used to run the application
   */
  public readonly appService: DockerComposeService;

  /**
   * Compose file generated for this project
   */
  public readonly composeFile: DockerCompose;

  constructor(options: BunTypescriptOptions) {
    super(options);

    new ProjenrcTs(this);

    this.package = generateNodePackage(this, options);

    cleanupProjectDefaults(this);

    this.makefile = generateMakeFile(this, options);
    this.tsConfig = generateTypescriptConfig(this, options);

    generateEsLint(this);
    generatePrettier(this);

    if (options.omitSampleCode !== true) {
      new SampleDir(this, './src', {
        sourceDir: `${__dirname}/../sample/src`,
      });
    }

    this.appService = generateAppService(this, options);

    this.composeFile = generateDockerCompose(this, {
      app: this.appService,
    });
  }
}
