import { TypeScriptModuleResolution, TypescriptConfig } from "projen/lib/javascript";

import { BunTypescriptOptions } from "../types";
import { Project } from "projen";

export const generateTypescriptConfig = (project: Project, options: BunTypescriptOptions): TypescriptConfig => {
  return new TypescriptConfig(project, {
    fileName: options.tsconfigFilename,
    compilerOptions: {
        paths: options.tsconfigPaths,
        lib: ["ESNext"],
        module: "esnext",
        target: "esnext",
        moduleResolution: TypeScriptModuleResolution.BUNDLER,
        allowImportingTsExtensions: true,
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        allowJs: true,
        types: [
          "bun-types"
        ]
      }
  })
}
