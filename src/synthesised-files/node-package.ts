import { NodePackage, NodePackageManager } from "projen/lib/javascript";

import { NodePackageOptions } from "projen/lib/javascript";
import { Project } from "projen";

export const generateNodePackage = (project: Project, options: NodePackageOptions): NodePackage => {
  const nodePackage = new NodePackage(project, {
    packageManager: NodePackageManager.BUN,
    ...options
  })

  nodePackage.removeScript('build');
  nodePackage.removeScript('compile');
  nodePackage.removeScript('default');
  nodePackage.removeScript('eject');
  nodePackage.removeScript('package');
  nodePackage.removeScript('post-compile');
  nodePackage.removeScript('pre-compile');
  nodePackage.removeScript('projen-watch');
  nodePackage.removeScript('test');

  nodePackage.setScript('start', 'bun src/index.ts');
  nodePackage.setScript('build', 'bun run build.mjs');
  nodePackage.setScript('lint', 'eslint . --ext .ts');
  nodePackage.setScript('format', 'prettier --write "**/*.ts"');

  nodePackage.addDevDeps(
    'eslint@^8',
    '@typescript-eslint/eslint-plugin@^6',
    '@typescript-eslint/parser@^6',
    'eslint-import-resolver-node',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    'eslint-plugin-n',
    'eslint-plugin-promise',
    'bun-types',
    'prettier',
    'bun-plugin-dts',
  );

  return nodePackage
}
