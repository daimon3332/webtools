import yaml from 'js-yaml'
import { dedent } from './dedent'

const DUMP_OPTS = { indent: 2, lineWidth: -1, noRefs: true }

export function formatYaml(text) {
  return yaml.dump(yaml.load(dedent(text)), DUMP_OPTS)
}

export function yamlToJson(text) {
  return JSON.stringify(yaml.load(dedent(text)), null, 2)
}

export function jsonToYaml(text) {
  return yaml.dump(JSON.parse(text), DUMP_OPTS)
}

export function yamlError(err) {
  if (err.mark) {
    return `YAML 解析失败（第 ${err.mark.line + 1} 行，第 ${err.mark.column + 1} 列）：${err.reason || err.message}`
  }
  return `解析失败：${err.message}`
}
