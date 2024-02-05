import { Project } from "projen";

export const cleanupProjectDefaults = (project: Project): void => {
  project.addTask(
    'watch',
    {
      exec: 'bun --watch .projenrc.ts'
    })

  project.defaultTask?.reset('bun .projenrc.ts')
}
