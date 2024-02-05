import { BunTypescript } from './src';
import { IgnoreFile } from 'projen';

const project = new BunTypescript({
  authorName: 'Liam Johnston',
  repository: 'https://github.com/Liam-Johnston/projen-bun-ts',
  name: 'bun-ts-projen',
  tsconfigFilename: 'tsconfig.dev.json',
  keywords: ['bun', 'projen', 'jsii', 'project-template'],
  bunContainerVersion: "1.0.25-alpine"
});

project.gitignore.addPatterns('tsconfig.json', '.jsii', 'lib/', 'todo');

project.package.addDevDeps(
  'jsii',
  'jsii-diff',
  'jsii-docgen',
  'jsii-pacmak',
  'jsii-rosetta',
  'projen',
);

project.package.addField('types', './lib/index.d.ts');

project.package.addPeerDeps('projen');
project.package.addField('jsii', {
  targets: {},
  excludeTypescript: ['./src/sample-code/*.ts'],
  tsc: {
    outDir: 'lib',
    rootDir: 'src',
  },
});

project.package.setScript('build', 'jsii --silence-warnings=reserved-word');

project.package.addField('files', ['lib', '.jsii', 'sample']);

project.package.addVersion('0.0.16');

const ignoreFile = new IgnoreFile(project, '.npmignore');

ignoreFile.addPatterns('node_modules/');


project.makefile.addRule({
  targets: ['build'],
  recipe: ['bun run build']
})

project.synth();
