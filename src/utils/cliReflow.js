export function reflowCli(input) {
  return input
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.replace(/^ {1,2}/, ''))
    .join('\n')
}
