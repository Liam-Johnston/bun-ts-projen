import { DockerCompose, DockerComposeServiceDescription, Project } from "projen";

export const generateDockerCompose = (project: Project, services: Record<string, DockerComposeServiceDescription> ): DockerCompose => {
  return new DockerCompose(project, {
    services
  })
}
