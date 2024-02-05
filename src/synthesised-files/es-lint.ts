import { JsonFile, Project } from "projen";

export const generateEsLint = (project: Project) => {
  return new JsonFile(project, '.eslintrc.json', {
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
}
