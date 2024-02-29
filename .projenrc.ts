import { IgnoreFile, Version } from 'projen';

import { BunTypescript } from './src';
import { GitHubCICDComponent } from 'projen-cicd-component';

const project = new BunTypescript({
  authorName: 'Liam Johnston',
  repository: 'https://github.com/Liam-Johnston/projen-bun-ts',
  name: 'bun-ts-projen',
  tsconfigFilename: 'tsconfig.dev.json',
  keywords: ['bun', 'projen', 'jsii', 'project-template'],
  bunContainerVersion: '1.0.25-alpine',
  devDeps: [
    'projen-cicd-component',
    'jsii',
    'jsii-diff',
    'jsii-docgen',
    'jsii-pacmak',
    'jsii-rosetta',
    'projen',
  ],
  peerDeps: [
    'projen',
    'constructs'
  ]
});

project.gitignore.addPatterns('tsconfig.json', '.jsii', 'lib/', 'todo');

project.package.addField('types', './lib/index.d.ts');

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

const ignoreFile = new IgnoreFile(project, '.npmignore');

ignoreFile.addPatterns('node_modules/');

project.makefile.addRule({
  targets: ['build'],
  recipe: ['docker compose run --rm app bun run build'],
});

project.makefile.addRule({
  targets: ['install'],
  recipe: ['docker compose run --rm app bun i'],
});

new Version(project, {
  versionInputFile: project.package.file.path,
  artifactsDirectory: './lib',
});

project.makefile.addRule({
  targets: ['publish'],
  recipe: ['docker compose run --rm app npm publish'],
});

new GitHubCICDComponent(project, {
  pushToMainWorkflowJobs: [
    {
      name: 'Build and Publish',
      steps: [
        {
          name: 'Build',
          commands: ['make install build'],
        },
        {
          name: 'Bump Version',
          commands: ['make bump'],
        },
        {
          name: 'Commit Release',
          commands: [
            "git config --global user.name 'Github Actions'",
            "git config --global user.email 'github@actions.com'",
            "git commit -am 'chore(release)'",
            'git tag $(cat ./lib/releasetag.txt)',
            'git push',
            'git push --tags',
          ],
        },
        {
          name: 'Publish to NPM',
          commands: ['make publish'],
          environmentVariables: {
            NPM_TOKEN: '${{ secrets.NPM_TOKEN }}',
          },
        },
      ],
    },
  ],
});

project.package.setScript('bump', 'bunx projen bump');
project.package.setScript('unbump', 'bunx projen bump');

const packageFile = await Bun.file(project.package.file.absolutePath).json();
project.package.addVersion(packageFile.version);

project.makefile.addRule({
  targets: ['bump'],
  recipe: ['docker compose run --rm app bun run bump'],
});

project.synth();
