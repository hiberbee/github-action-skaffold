import { getInput } from '@actions/core'

enum SkaffoldArgs {
  BUILD_IMAGE = '--build-image',
  CACHE_ARTIFACTS = '--cache-artifacts',
  DEFAULT_REPO = '--default-repo',
  FILENAME = '--filename',
  INSECURE_REGISTRIES = '--insecure-registries',
  KUBE_CONTEXT = '--kube-context',
  KUBECONFIG = '--kubeconfig',
  NAMESPACE = '--namespace',
  PROFILE = '--profile',
  SKIP_TESTS = '--skip-tests',
}

export default function (): string[] {
  return Object.keys(SkaffoldArgs)
    .map(key => (key in SkaffoldArgs ? (getInput(key) !== '' ? `${key}=${getInput(key)}` : '') : key))
    .filter(value => value !== '')
}
