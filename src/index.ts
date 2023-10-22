import { Project, ProjectOptions, Makefile, JsonFile } from 'projen';
import {
  NodePackageManager,
  NodePackage,
  NodePackageOptions,
  TypescriptConfig,
} from 'projen/lib/javascript';
import { ProjenrcTs } from 'projen/lib/typescript';

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
}

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

  constructor(options: BunTypescriptOptions) {
    super(options);

    this.package = new NodePackage(this, {
      packageManager: NodePackageManager.BUN,
      ...options,
    });

    this.package.addField('types', './lib/index.d.ts');

    this.package.removeScript('build');
    this.package.removeScript('compile');
    this.package.removeScript('default');
    this.package.removeScript('eject');
    this.package.removeScript('package');
    this.package.removeScript('post-compile');
    this.package.removeScript('pre-compile');
    this.package.removeScript('projen-watch');
    this.package.removeScript('test');

    this.package.setScript('start', 'bun index.ts');
    this.package.setScript('build', 'bun run build.mjs');

    this.addTask('watch', {
      exec: 'bun --watch .projenrc.ts',
    });

    this.makefile = new Makefile(this, './Makefile', {});

    this.tsConfig = new TypescriptConfig(this, {
      fileName: options.tsconfigFilename,
      compilerOptions: {
        alwaysStrict: true,
        declaration: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        inlineSourceMap: true,
        inlineSources: true,
        lib: ['ES2022'],
        module: 'nodenext',
        noEmitOnError: false,
        noFallthroughCasesInSwitch: true,
        noImplicitAny: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        resolveJsonModule: true,
        strict: true,
        strictNullChecks: true,
        strictPropertyInitialization: true,
        stripInternal: true,
        target: 'ES2019',
      },
    });

    this.package.addDevDeps(
      'eslint@^8',
      '@typescript-eslint/eslint-plugin@^6',
      '@typescript-eslint/parser@^6',
      'eslint-import-resolver-node',
      'eslint-import-resolver-typescript',
      'eslint-plugin-import',
      'eslint-plugin-n',
      'eslint-plugin-promise',
      'bun-types',
      'prettier',
      'bun-plugin-dts',
    );

    new JsonFile(this, '.eslintrc.json', {
      obj: {
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
        ],
        rules: {},
      },
      marker: true,
      allowComments: true,
    });

    this.package.setScript('lint', 'eslint . --ext .ts');

    new JsonFile(this, '.prettierrc', {
      obj: {
        singleQuote: true,
        trailingComma: 'all',
      },
    });

    this.package.setScript('format', 'prettier --write "**/*.ts"');

    new ProjenrcTs(this);

    this.defaultTask?.reset('bun .projenrc.ts');
  }
}
