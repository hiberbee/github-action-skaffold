import { getInput, setFailed, exportVariable, setOutput, error, info } from '@actions/core'
import skaffold from 'src/skaffold'
import download from 'src/download'
import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'
import os from 'os'

const osPlat = os.platform()
const platform = osPlat === 'win32' ? 'windows' : osPlat
const suffix = osPlat === 'win32' ? '.exe' : ''

async function run(): Promise<void> {
  const skaffoldTestUrl = `https://storage.googleapis.com/skaffold/releases/v${getInput(
    'version',
  )}/skaffold-${platform}-amd64${suffix}`
  const containerStructureTestUrl = `https://storage.googleapis.com/container-structure-test/v${getInput(
    'container-structure-test-version',
  )}/container-structure-test-${platform}-amd64`
  const options: ExecOptions = {}
  const binDir = '/home/runner/bin'

  try {
    await download({
      url: skaffoldTestUrl,
      dir: binDir,
      file: 'skaffold',
    })
    if (!getInput('skip-tests')) {
      await download({
        url: containerStructureTestUrl,
        dir: binDir,
        file: 'container-structure-test',
      })
    }
    await skaffold({
      skipTests: Boolean(getInput('skip-tests')),
      tag: getInput('tag'),
      command: getInput('command'),
      defaultRepo: getInput('default-repo'),
      profile: getInput('profile'),
    }).then(() => exec('minikube', ['ip'], options))
  } catch (error) {
    setFailed(error.message)
  }
}

run().then(() => exec('skaffold', ['version']))
