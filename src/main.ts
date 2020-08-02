import { exportVariable, getInput, setFailed } from '@actions/core'
import skaffold from 'src/skaffold'
import download from 'src/download'
import { exec } from '@actions/exec'
import os from 'os'
import { cacheDir, cacheFile } from '@actions/tool-cache'
import { mkdirP } from '@actions/io'

const osPlat = os.platform()
const platform = osPlat === 'win32' ? 'windows' : osPlat
const suffix = osPlat === 'win32' ? '.exe' : ''

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
    await exec('skaffold', Array.of(getInput('command'), `--cache-file=${skaffoldCacheDir}`).concat(skaffold()))
    await cacheDir(skaffoldCacheDir, 'skaffold', skaffoldVersion)
  } catch (error) {
    setFailed(error.message)
  }
}

run().then(() => exec('skaffold', ['version']))
