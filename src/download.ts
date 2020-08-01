import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import { downloadTool } from '@actions/tool-cache'
import { mkdirP, mv } from '@actions/io'
import path from 'path'

type DownloadArgs = {
  url: string
  file: string
  dir: string
}

export default async function (args: DownloadArgs): Promise<void> {
  const downloadPath = await downloadTool(args.url)
  await mkdirP(args.dir)
  if (args.url.endsWith('tar.gz')) {
    await exec('tar', ['-xz', `--file=${downloadPath}`, `--directory=${args.dir}`, `--strip=1`])
  } else {
    await mv(downloadPath, path.join(args.dir, args.file))
  }
  await exec('chmod', ['+x', '-R', args.dir])
  addPath(args.dir)
}
