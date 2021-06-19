export const CONFIG_VERSION = 4 as const
const STORE_KEY = 'VecMineSweeper_DE'

export type Diffculty = 'EASY' | 'HARD' | 'LUNATIC' | 'CUSTOM'

export type WHB<T = number> = { width: T; height: T; bomb_number: T }

export type Config = {
  readonly version: typeof CONFIG_VERSION
  diffculty: Diffculty
  edge_bomb: boolean
} & WHB

export type ConfigForm = {
  readonly version: typeof CONFIG_VERSION
  diffculty: Diffculty
  // bomb_number: string | number
  // width: string | number
  // height: string | number

  edge_bomb: boolean
} & WHB<string | number>

export function form2Config(fd: ConfigForm): Config {
  return {
    ...fd,
    diffculty: fd.diffculty,
    bomb_number: Number(fd.bomb_number),
    width: Number(fd.width),
    height: Number(fd.height),
    edge_bomb: Boolean(fd.edge_bomb),
  }
}

export function diff2WHB(diff: Exclude<Diffculty, 'CUSTOM'>): WHB {
  switch (diff) {
    case 'EASY':
      return { width: 10, height: 10, bomb_number: 5 }
    case 'HARD':
      return { width: 10, height: 10, bomb_number: 15 }
    case 'LUNATIC':
      return { width: 10, height: 15, bomb_number: Math.floor(10 * 15 * 0.25) }
  }
}

export function createDefaultConfig(): Config {
  const Config: Config = {
    version: CONFIG_VERSION,

    diffculty: 'EASY',
    bomb_number: 10,
    width: 10,
    height: 10,
    edge_bomb: false,
  }

  return Config
}

export function saveConfig(cfg: Config): void {
  const rawData = JSON.stringify(cfg)
  localStorage.setItem(STORE_KEY, rawData)
}

export function loadConfig(): Config {
  const rawData = localStorage.getItem(STORE_KEY)
  if (rawData) {
    try {
      const loadedConfig = JSON.parse(rawData)
      if (
        loadedConfig &&
        typeof loadedConfig === 'object' &&
        loadedConfig['version'] === CONFIG_VERSION
      ) {
        return loadedConfig
      }
    } catch (err) {
      // JSON 解析失败的话，就重新创建一个新的设置
    }
  }

  saveConfig(createDefaultConfig())
  return loadConfig()
}
