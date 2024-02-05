import { NodePackageOptions } from 'projen/lib/javascript';
import { ProjectOptions } from 'projen';

/**
 * Properties for creating a BunTypescript Project.
 */
export interface BunTypescriptOptions
  extends ProjectOptions,
    NodePackageOptions {
  /**
   * File name for the TSConfig file. Defaults to tsconfig.json if not specified.
   */
  readonly tsconfigFilename?: string;
  /**
   * Path mappings to include in the tsconfig compiler options
   */
  readonly tsconfigPaths?: {
    [key: string]: string[];
  };
  /**
   * Bun container version for running the app
   */
  readonly bunContainerVersion?: string;
  /**
   * Environment variables for the app service container to access
   */
  readonly appEnvironmentVariables?: Record<string, string>;
  /**
   * Skip creating the run command in the makefile
   */
  readonly skipRunCommand?: boolean;
  /**
   * Do not generate sample code for the project
   */
  readonly omitSampleCode?: boolean;
}
