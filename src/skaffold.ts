import { getInput } from '@actions/core'

enum SkaffoldArgs {
  BUILD_IMAGE = 'build-image',
  CACHE_ARTIFACTS = 'cache-artifacts',
  DEFAULT_REPO = 'default-repo',
  FILENAME = 'filename',
  INSECURE_REGISTRIES = 'insecure-registries',
  KUBE_CONTEXT = 'kube-context',
  KUBECONFIG = 'kubeconfig',
  NAMESPACE = 'namespace',
  PROFILE = 'profile',
  SKIP_TESTS = 'skip-tests',
  TAG = 'tag',
}

export default function (): string[] {
  return Object.values(SkaffoldArgs)
    .filter(key => getInput(key) !== '')
    .map(key => `--${key}=${getInput(key)}`)
}
