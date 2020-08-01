import { exec } from '@actions/exec'

export type CommandArguments = {
  command: string
  defaultRepo?: string
  tag?: string
  profile?: string
  skipTests?: boolean
}

export function commandLineArgs(args: CommandArguments): string[] {
  return [
    args.command,
    args.defaultRepo ? `--default-repo=${args.defaultRepo}` : '',
    args.profile ? `--profile=${args.profile}` : '',
    args.skipTests ? `--skip-tests=${args.skipTests}` : '',
    args.tag ? `--tag=${args.tag}` : '',
  ].filter(value => value !== '')
}

export default async function (args: CommandArguments): Promise<void> {
  await exec('skaffold', commandLineArgs(args))
}
