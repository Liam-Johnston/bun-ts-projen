import { JsonFile, Project } from "projen";

export const generatePrettier = (project: Project) => {
  return new JsonFile(project, '.prettierrc', {
    obj: {
      singleQuote: true,
      trailingComma: 'all',
    },
  });
}
