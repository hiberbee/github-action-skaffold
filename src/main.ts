import { exportVariable, getInput, setFailed } from '@actions/core'
import skaffold from 'src/skaffold'
import download from 'src/download'
import { exec } from '@actions/exec'
import os from 'os'
import { cacheDir, cacheFile } from '@actions/tool-cache'

const osPlat = os.platform()
const platform = osPlat === 'win32' ? 'windows' : osPlat
const suffix = osPlat === 'win32' ? '.exe' : ''

async function run(): Promise<void> {
  const skaffoldVersion = getInput('version')
  const containerStructureTestVersion = getInput('container-structure-test-version')
  const skaffoldTestUrl = `https://storage.googleapis.com/skaffold/releases/v${skaffoldVersion}/skaffold-${platform}-amd64${suffix}`
  const containerStructureTestUrl = `https://storage.googleapis.com/container-structure-test/v${getInput(
    'container-structure-test-version',
  )}/container-structure-test-${platform}-amd64`
  const homeDir = process.env.HOME ?? '/home/runner'
  const binDir = `${homeDir}/bin`

  try {
    await download(skaffoldTestUrl, `${binDir}/skaffold`).then(() =>
      cacheFile(`${binDir}/skaffold`, `${binDir}/skaffold`, 'skaffold', skaffoldVersion, platform),
    )
    if (!getInput('skip-tests')) {
      await download(containerStructureTestUrl, `${binDir}/container-structure-test`).then(() =>
        cacheFile(
          `${binDir}/container-structure-test`,
          `${binDir}/container-structure-test`,
          'container-structure-test',
          containerStructureTestVersion,
          platform,
        ),
      )
    }
    await exec('skaffold', Array.of(getInput('command')).concat(skaffold())).then(() =>
      cacheDir(homeDir, 'skaffold', skaffoldVersion, platform),
    )
  } catch (error) {
    setFailed(error.message)
  }
}

run().then(() => exec('skaffold', ['version']))
