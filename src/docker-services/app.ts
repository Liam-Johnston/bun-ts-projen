import { DockerCompose, DockerComposeService, Project, SampleFile } from "projen";

import { BunTypescriptOptions } from "../types";

export const generateAppService = (project: Project, options: BunTypescriptOptions): DockerComposeService => {
  new SampleFile(
    project,
    './containers/Dockerfile.app',
    {
      sourcePath: `${__dirname}/../../sample/containers/Dockerfile.app`
    }
  )

  return new DockerComposeService('app', {
    imageBuild: {
      context: './containers',
      dockerfile: 'Dockerfile.app',
      args: {
        BUN_VERSION: options.bunContainerVersion ?? "1.0.14-alpine"
      }
    },
    environment: options.appEnvironmentVariables,
    volumes: [
      DockerCompose.bindVolume("./", "/app")
    ]
  })
}
