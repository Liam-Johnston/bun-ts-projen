import { Makefile, Project, Rule } from 'projen';

import { BunTypescriptOptions } from '../types';

export const generateMakeFile = (
  project: Project,
  options: BunTypescriptOptions,
): Makefile => {
  const rules: Rule[] = [
    {
      targets: ['project'],
      recipe: ['docker compose run --rm app bun .projenrc.ts'],
    },
  ];

  if (options.skipRunCommand !== true) {
    rules.push({
      targets: ['run'],
      recipe: ['docker compose run --rm app bun start'],
    });
  }

  return new Makefile(project, './Makefile', { rules });
};
