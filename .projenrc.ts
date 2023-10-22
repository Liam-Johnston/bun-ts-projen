import { IgnoreFile, License } from 'projen';
import { BunTypescript } from './src';

const project = new BunTypescript({
  authorName: 'Liam Johnston',
  repository: 'https://github.com/Liam-Johnston/projen-bun-ts',
  name: 'bun-ts-projen',
  tsconfigFilename: 'tsconfig.dev.json',
  keywords: [
    'bun',
    'projen',
    'jsii',
    'project-template'
  ]
});

project.gitignore.addPatterns('tsconfig.json', '.jsii', 'lib/');

project.package.addDevDeps(
  'jsii',
  'jsii-diff',
  'jsii-docgen',
  'jsii-pacmak',
  'jsii-rosetta',
  'projen',
);

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

project.package.addField('files', ['lib', '.jsii'])

project.package.addVersion('0.0.1')

const ignoreFile = new IgnoreFile(project, '.npmignore')

ignoreFile.addPatterns('node_modules/')

new License(project, {
  spdx: project.package.license || 'Apache-2.0.txt',
  copyrightOwner: 'Liam Johnston',
})

project.synth();
