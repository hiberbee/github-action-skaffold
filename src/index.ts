import { getInput, setFailed } from '@actions/core'
import { exec } from '@actions/exec'
import os from 'os'
import { cacheDir } from '@actions/tool-cache'
import { mkdirP, mv } from '@actions/io'
import { addPath } from '@actions/core'
import { downloadTool } from '@actions/tool-cache'
import path from 'path'

const osPlat = os.platform()
const platform = osPlat === 'win32' ? 'windows' : osPlat
const suffix = osPlat === 'win32' ? '.exe' : ''

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

/**
 * Downloader helper function
 * - downloads file from URL;
 * - extracts if tar archive recognized from url;
 * - makes executable
 * - add to path
 * @param url link to download
 * @param destination full path
 */
async function download(url: string, destination: string): Promise<string> {
  const downloadPath = await downloadTool(url)
  const destinationDir = path.dirname(destination)
  await mkdirP(destinationDir)
  if (url.endsWith('tar.gz') || url.endsWith('tar') || url.endsWith('tgz')) {
    await exec('tar', ['-xzvf', downloadPath, `--strip=1`])
    await mv(path.basename(destination), destinationDir)
  } else {
    await mv(downloadPath, destination)
  }
  await exec('chmod', ['+x', destination])
  addPath(destinationDir)
  return downloadPath
}

function commandLineArgs(): string[] {
  return Object.values(SkaffoldArgs)
    .filter(key => getInput(key) !== '')
    .map(key => `--${key}=${getInput(key)}`)
}

async function run(): Promise<void> {
  const skaffoldVersion = getInput('skaffold-version')
  const containerStructureTestVersion = getInput('container-structure-test-version')
  const skaffoldTestUrl = `https://storage.googleapis.com/skaffold/releases/v${skaffoldVersion}/skaffold-${platform}-amd64${suffix}`
  const containerStructureTestUrl = `https://storage.googleapis.com/container-structure-test/v${containerStructureTestVersion}/container-structure-test-${platform}-amd64`
  const homeDir = process.env.HOME ?? '/home/runner'
  const skaffoldCacheDir = `${homeDir}/.skaffold/cache`
  const binDir = `${homeDir}/bin`

  try {
    await mkdirP(skaffoldCacheDir)
    await download(skaffoldTestUrl, `${binDir}/skaffold`)
    if (getInput('skip-tests') === 'false') {
      await download(containerStructureTestUrl, `${binDir}/container-structure-test`)
    }
    await exec('skaffold', Array.of(getInput('command'), `--cache-file=${skaffoldCacheDir}`).concat(commandLineArgs()))
    await cacheDir(skaffoldCacheDir, 'skaffold', skaffoldVersion)
  } catch (error) {
    setFailed(error.message)
  }
}

run().then(() => exec('skaffold', ['version']))