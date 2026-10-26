import type { EngineInterface, Register } from 'claude-code'

type Platform = 'windows' | 'macos' | 'linux'
type Kind = 'start' | 'done' | 'fail' | 'permission' | 'error' | 'context'
type Lang = 'en' | 'zh-TW' | 'zh-CN' | 'ja'

type Note = {
  kind: Kind
  title: string
  body: string
  /** Small print under the body: turn length, tool count, branch. */
  meta?: string
}

const LANGS: readonly Lang[] = ['en', 'zh-TW', 'zh-CN', 'ja']

// Failures often come in bursts (a flaky command retried); one popup per window is enough.
const FAILURE_COOLDOWN_MS = 10_000
// `$.store` key: when notifications come back, in ms; absent when they are on.
const MUTED_UNTIL = 'mutedUntil'
const FOREVER = Number.MAX_SAFE_INTEGER
// Context warnings: once at the configured level, once more here; a drop below
// REARM_PERCENT (a /compact, a /clear) lets them fire again.
const CONTEXT_CRITICAL_PERCENT = 90
const REARM_PERCENT = 50

const LOOK: Record<Kind, { emoji: string; macSound: string }> = {
  start: { emoji: '✳️', macSound: 'Pop' },
  done: { emoji: '✅', macSound: 'Glass' },
  fail: { emoji: '💥', macSound: 'Basso' },
  permission: { emoji: '🔐', macSound: 'Ping' },
  error: { emoji: '⚠️', macSound: 'Basso' },
  context: { emoji: '🧠', macSound: 'Funk' },
}

type Strings = {
  lines: Record<Kind, readonly string[]>
  checkItOut: string
  onBranch: (branch: string) => string
  failed: string
  turnError: string
  tools: (n: number) => string
  contextBody: (percent: number) => string
  allow: string
  deny: string
  deniedFromPopup: string
  openFolder: string
  description: string
  usage: string
  statusOn: string
  statusMuted: (left: string) => string
  statusOff: string
  muted: (left: string) => string
  off: string
  on: string
  language: (lang: string) => string
  badLanguage: string
  tested: string
}

const TEXT: Record<Lang, Strings> = {
  en: {
    lines: {
      start: ['Claude is online', 'Ready to roll', 'Standing by'],
      done: ['All done', 'Wrapped up', 'Mission complete', 'Come take a look'],
      fail: ['hit a snag', 'tripped up', 'got stuck'],
      permission: ['needs your OK', 'is waiting on you', 'wants permission'],
      error: ['The turn stopped', 'Ran into an error'],
      context: ['Context is filling up', 'Running out of room'],
    },
    checkItOut: 'Come check it out~',
    onBranch: b => `on ${b}`,
    failed: 'Something went wrong...',
    turnError: 'The turn ended with an error.',
    tools: n => `${n} tools`,
    contextBody: p => `${p}% of the context window is used. Time to /compact or start fresh.`,
    allow: 'Allow',
    deny: 'Deny',
    deniedFromPopup: 'The user denied this from the notification popup.',
    openFolder: 'Open folder',
    description: 'Desktop notifications: test, mute, off, on, lang',
    usage: [
      '/notify            show status',
      '/notify test [all] show a sample popup',
      '/notify mute [1h]  mute for a while (30m, 2h, ...)',
      '/notify off | on   turn notifications off / back on',
      '/notify lang <auto|en|zh-TW|zh-CN|ja>',
    ].join('\n'),
    statusOn: 'Notifications are on.',
    statusMuted: left => `Muted for ${left} more.`,
    statusOff: 'Notifications are off. /notify on brings them back.',
    muted: left => `Muted for ${left}.`,
    off: 'Notifications off, in every session, until /notify on.',
    on: 'Notifications are back on.',
    language: l => `Language set to ${l}.`,
    badLanguage: 'Pick one of: auto, en, zh-TW, zh-CN, ja',
    tested: 'Sent a sample notification.',
  },
  'zh-TW': {
    lines: {
      start: ['Claude 上線了', '準備開工', '就位，隨時可以開始'],
      done: ['搞定了', '收工', '任務完成', '交差了，回來看看'],
      fail: ['翻車了', '出包了', '卡住了'],
      permission: ['等你點頭', '需要你的授權', 'Claude 在等你'],
      error: ['這回合中斷了', '遇到錯誤停下來了'],
      context: ['context 快滿了', '記憶快裝不下了'],
    },
    checkItOut: '回來看看吧~',
    onBranch: b => `在 ${b} 分支`,
    failed: '出了點問題...',
    turnError: '這回合因為錯誤而結束了。',
    tools: n => `${n} 個工具`,
    contextBody: p => `context 已用 ${p}%，建議 /compact 或開新的 session。`,
    allow: '允許',
    deny: '拒絕',
    deniedFromPopup: 'The user denied this from the notification popup.',
    openFolder: '開啟資料夾',
    description: '桌面通知：test、mute、off、on、lang',
    usage: [
      '/notify            顯示狀態',
      '/notify test [all] 跳一張示範通知',
      '/notify mute [1h]  暫時靜音（30m、2h⋯）',
      '/notify off | on   關閉／重新開啟通知',
      '/notify lang <auto|en|zh-TW|zh-CN|ja>',
    ].join('\n'),
    statusOn: '通知開啟中。',
    statusMuted: left => `靜音中，還剩 ${left}。`,
    statusOff: '通知已關閉。輸入 /notify on 重新開啟。',
    muted: left => `已靜音 ${left}。`,
    off: '通知已關閉（所有 session），直到 /notify on。',
    on: '通知重新開啟了。',
    language: l => `語言已設為 ${l}。`,
    badLanguage: '請選擇：auto、en、zh-TW、zh-CN、ja',
    tested: '已送出一則示範通知。',
  },
  'zh-CN': {
    lines: {
      start: ['Claude 上线了', '准备开工', '就位，随时可以开始'],
      done: ['搞定了', '收工', '任务完成', '交差了，回来看看'],
      fail: ['翻车了', '出问题了', '卡住了'],
      permission: ['等你点头', '需要你的授权', 'Claude 在等你'],
      error: ['这一轮中断了', '遇到错误停下来了'],
      context: ['context 快满了', '快装不下了'],
    },
    checkItOut: '回来看看吧~',
    onBranch: b => `在 ${b} 分支`,
    failed: '出了点问题...',
    turnError: '这一轮因为错误而结束了。',
    tools: n => `${n} 个工具`,
    contextBody: p => `context 已用 ${p}%，建议 /compact 或开新的会话。`,
    allow: '允许',
    deny: '拒绝',
    deniedFromPopup: 'The user denied this from the notification popup.',
    openFolder: '打开文件夹',
    description: '桌面通知：test、mute、off、on、lang',
    usage: [
      '/notify            显示状态',
      '/notify test [all] 弹一张示例通知',
      '/notify mute [1h]  暂时静音（30m、2h⋯）',
      '/notify off | on   关闭／重新开启通知',
      '/notify lang <auto|en|zh-TW|zh-CN|ja>',
    ].join('\n'),
    statusOn: '通知已开启。',
    statusMuted: left => `静音中，还剩 ${left}。`,
    statusOff: '通知已关闭。输入 /notify on 重新开启。',
    muted: left => `已静音 ${left}。`,
    off: '通知已关闭（所有会话），直到 /notify on。',
    on: '通知重新开启了。',
    language: l => `语言已设为 ${l}。`,
    badLanguage: '请选择：auto、en、zh-TW、zh-CN、ja',
    tested: '已发送一则示例通知。',
  },
  ja: {
    lines: {
      start: ['Claude がオンラインに', '準備完了', 'いつでもどうぞ'],
      done: ['できました', '完了です', 'ミッション完了', '見に来てください'],
      fail: ['でつまずきました', 'で失敗しました', 'で止まりました'],
      permission: ['許可を待っています', 'あなたの確認が必要です', 'Claude が待っています'],
      error: ['ターンが中断されました', 'エラーで止まりました'],
      context: ['コンテキストが残りわずか', 'そろそろ満杯です'],
    },
    checkItOut: '見に来てください~',
    onBranch: b => `${b} ブランチ`,
    failed: '問題が発生しました...',
    turnError: 'ターンがエラーで終了しました。',
    tools: n => `ツール ${n} 回`,
    contextBody: p => `コンテキストを ${p}% 使用中。/compact か新しいセッションをどうぞ。`,
    allow: '許可',
    deny: '拒否',
    deniedFromPopup: 'The user denied this from the notification popup.',
    openFolder: 'フォルダを開く',
    description: 'デスクトップ通知：test、mute、off、on、lang',
    usage: [
      '/notify            状態を表示',
      '/notify test [all] サンプル通知を表示',
      '/notify mute [1h]  しばらくミュート（30m、2h など）',
      '/notify off | on   通知をオフ／オンにする',
      '/notify lang <auto|en|zh-TW|zh-CN|ja>',
    ].join('\n'),
    statusOn: '通知はオンです。',
    statusMuted: left => `ミュート中（残り ${left}）。`,
    statusOff: '通知はオフです。/notify on で再開します。',
    muted: left => `${left} ミュートしました。`,
    off: 'すべてのセッションで通知をオフにしました（/notify on まで）。',
    on: '通知を再開しました。',
    language: l => `言語を ${l} に設定しました。`,
    badLanguage: 'auto、en、zh-TW、zh-CN、ja から選んでください',
    tested: 'サンプル通知を送りました。',
  },
}

// On Windows the popup is assets/popup.ps1, an animated WPF card. This loader
// runs it as a script block, so the execution policy has no script file to
// block, and goes as -EncodedCommand, so the command line strips no quotes.
// Everything the popup shows travels as JSON in an environment variable: no
// text the model wrote is ever parsed as script.
const WINDOWS_LOADER = '. ([scriptblock]::Create([IO.File]::ReadAllText($env:CC_NOTIFY_SCRIPT)))'

const MACOS_NOTIFY = [
  '-e', 'on run argv',
  '-e', 'display notification (item 2 of argv) with title (item 1 of argv) subtitle (item 3 of argv) sound name (item 4 of argv)',
  '-e', 'end run',
]

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/** What powershell.exe -EncodedCommand takes: the script as UTF-16LE, in base64. */
function encodeCommand(script: string): string {
  const bytes: number[] = []
  for (let i = 0; i < script.length; i++) {
    const unit = script.charCodeAt(i)
    bytes.push(unit & 0xff, unit >> 8)
  }
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const [a = 0, b = 0, c = 0] = [bytes[i], bytes[i + 1], bytes[i + 2]]
    const n = (a << 16) | (b << 8) | c
    out += BASE64[(n >> 18) & 63]! + BASE64[(n >> 12) & 63]!
    out += i + 1 < bytes.length ? BASE64[(n >> 6) & 63]! : '='
    out += i + 2 < bytes.length ? BASE64[n & 63]! : '='
  }
  return out
}

const WINDOWS_LOADER_ENCODED = encodeCommand(WINDOWS_LOADER)

let platform: Promise<Platform> | undefined
let language: Promise<Lang> | undefined
let configuredLanguage = 'en'
let contextWarning = 80
let contextWarned = 0
let permissionButtons = true
let asking = false
let lastAskAt = -Infinity
let cwd = ''
let project = 'Claude Code'
let branch: string | undefined
let toolsThisTurn = 0
let lastFailureAt = -Infinity

function clip(text: string, max = 120): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}

function pick(lines: readonly string[]): string {
  return lines[Math.floor(Math.random() * lines.length)] ?? lines[0] ?? ''
}

function duration(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`
}

/** `30m`, `2h`, `1d`, or a bare number of minutes. */
function parseDuration(text: string): number | undefined {
  const match = /^(\d+(?:\.\d+)?)\s*(m|min|h|hr|d)?$/i.exec(text.trim())
  if (!match) return undefined
  const unit = (match[2] ?? 'm').toLowerCase()
  const factor = unit === 'd' ? 86_400_000 : unit.startsWith('h') ? 3_600_000 : 60_000
  return Number(match[1]) * factor
}

/** Maps a locale tag (`zh_TW.UTF-8`, `ja-JP`, `zh-Hant`) to a language we speak. */
function toLang(tag: string | undefined): Lang | undefined {
  const t = (tag ?? '').toLowerCase().replace('_', '-')
  if (t.startsWith('zh')) return /tw|hk|mo|hant/.test(t) ? 'zh-TW' : 'zh-CN'
  if (t.startsWith('ja')) return 'ja'
  if (t.startsWith('en')) return 'en'
  return undefined
}

/** The answer's first real line, without the Markdown around it. */
function preview(answer: string, t: Strings): string {
  const line = answer
    .split('\n')
    .map(l => l.replace(/^[#>*\-\s|`]+/, '').replace(/[*_`]/g, '').trim())
    .find(l => l.length > 0)
  return clip(line ?? t.checkItOut, 110)
}

function headline(kind: Kind, flavor: string): string {
  return `${LOOK[kind].emoji} ${project} · ${flavor}`
}

function fileUri(path: string): string {
  const slashed = path.replace(/\\/g, '/')
  return `file:///${slashed.replace(/^\/+/, '')}`
}

function detect($: EngineInterface): Promise<Platform> {
  platform ??= (async () => {
    if ((await $.env.get('OS')) === 'Windows_NT') return 'windows'
    const { stdout } = await $.process.run(['uname', '-s'])
    return stdout.trim() === 'Darwin' ? 'macos' : 'linux'
  })()
  return platform
}

/** The configured language, or with `auto` the system's, English when unknown. */
function resolveLang($: EngineInterface): Promise<Lang> {
  language ??= (async () => {
    const chosen = toLang(configuredLanguage)
    if (chosen) return chosen
    const fromEnv = toLang((await $.env.get('LC_ALL')) || (await $.env.get('LANG')))
    if (fromEnv) return fromEnv
    if ((await detect($)) === 'windows') {
      try {
        const { stdout } = await $.process.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', '(Get-UICulture).Name'])
        return toLang(stdout.trim()) ?? 'en'
      } catch {
        return 'en'
      }
    }
    return 'en'
  })()
  return language
}

async function strings($: EngineInterface): Promise<Strings> {
  return TEXT[await resolveLang($)]
}

async function readBranch($: EngineInterface, dir: string): Promise<string | undefined> {
  try {
    const { exitCode, stdout } = await $.process.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], { cwd: dir, timeoutMs: 5_000 })
    const name = stdout.trim()
    return exitCode === 0 && name && name !== 'HEAD' ? name : undefined
  } catch {
    return undefined // no git, or not a repository
  }
}

/** How much longer notifications stay muted, in ms; 0 when they are on. */
async function mutedFor($: EngineInterface): Promise<number> {
  const until = Number((await $.store.get(MUTED_UNTIL)) ?? 0)
  return Math.max(0, until - (await $.clock.now()))
}

async function show($: EngineInterface, note: Note, ask?: { detail: string }): Promise<string> {
  const os = await detect($)
  const t = await strings($)
  const icon = `${$.plugin.root}/assets/${note.kind === 'error' ? 'fail' : note.kind}.png`
  const urgent = note.kind === 'permission' || note.kind === 'fail' || note.kind === 'error' || note.kind === 'context'

  const ran =
    os === 'windows'
      ? await $.process.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', WINDOWS_LOADER_ENCODED], {
          env: {
            CC_NOTIFY_SCRIPT: `${$.plugin.root}/assets/popup.ps1`.replace(/\//g, '\\'),
            CC_NOTIFY_JSON: JSON.stringify({
              kind: note.kind,
              title: note.title,
              body: note.body,
              meta: note.meta,
              launch: cwd ? fileUri(cwd) : undefined,
              openLabel: t.openFolder,
              ask: ask && { detail: ask.detail, allow: t.allow, deny: t.deny },
            }),
          },
          // A popup may wait its turn for a free spot on screen, and a
          // permission popup waits on screen for an answer.
          timeoutMs: note.kind === 'permission' ? 300_000 : 180_000,
        })
      : os === 'macos'
        ? await $.process.run(['osascript', ...MACOS_NOTIFY, note.title, note.body, note.meta ?? '', LOOK[note.kind].macSound])
        : await $.process.run([
            'notify-send',
            '--app-name=Claude Code',
            `--icon=${icon}`,
            `--urgency=${urgent ? 'critical' : 'normal'}`,
            note.title,
            note.meta ? `${note.body}\n${note.meta}` : note.body,
          ])

  if (ran.exitCode !== 0) throw new Error(clip(ran.stderr) || `exit ${ran.exitCode}`)
  return ran.stdout
}

/** One line on what a tool is about to do: the command, the file, the URL. */
function describeCall(tool: string, input: unknown): string {
  const fields = (input ?? {}) as Record<string, unknown>
  const main = ['command', 'file_path', 'notebook_path', 'url', 'pattern', 'path']
    .map(key => fields[key])
    .find((value): value is string => typeof value === 'string')
  return clip(`${tool}: ${main ?? JSON.stringify(input ?? {})}`, 200)
}

/**
 * Asks Allow / Deny on the Windows popup and resolves with the answer, or
 * undefined when the person closed it, clicked through to the terminal, or let
 * it time out: then the terminal asks as it always does.
 */
async function askPermission($: EngineInterface, tool: string, input: unknown): Promise<'allow' | 'deny' | undefined> {
  if ((await detect($)) !== 'windows' || (await mutedFor($)) > 0) return undefined
  const t = await strings($)
  try {
    const stdout = await show(
      $,
      { kind: 'permission', title: headline('permission', pick(t.lines.permission)), body: '' },
      { detail: describeCall(tool, input) },
    )
    const answer = /^decision: (allow|deny)\s*$/m.exec(stdout)?.[1]
    return answer === 'allow' || answer === 'deny' ? answer : undefined
  } catch (error) {
    $.ui.log(`permission popup failed: ${String(error)}`, { to: 'debug' })
    return undefined
  }
}

// Never hold up the session for a notification: fire it, and fall back to an
// in-app toast when the desktop one cannot be shown. `/notify test` passes
// `force` to show one even while muted.
function notify($: EngineInterface, build: (t: Strings) => Note, force = false) {
  void (async () => {
    if (!force && (await mutedFor($)) > 0) return
    const note = build(await strings($))
    await show($, note).catch(error => {
      $.ui.log(`desktop notification failed: ${String(error)}`, { to: 'debug' })
      $.ui.toast(`${note.title}: ${note.body}`)
    })
  })().catch(error => $.ui.log(`notification skipped: ${String(error)}`, { to: 'debug' }))
}

/** Warns once at the configured fill and once more near the end of the window. */
async function checkContext($: EngineInterface) {
  if (contextWarning <= 0) return
  const percent = await $.session.usage().then(
    usage => usage.context.percent,
    () => undefined, // no reading this turn
  )
  if (percent === undefined) return
  if (percent < REARM_PERCENT) {
    contextWarned = 0
    return
  }
  const level = percent >= CONTEXT_CRITICAL_PERCENT ? 2 : percent >= contextWarning ? 1 : 0
  if (level <= contextWarned) return
  contextWarned = level
  notify($, s => ({ kind: 'context', title: headline('context', pick(s.lines.context)), body: s.contextBody(Math.round(percent)) }))
}

async function runCommand($: EngineInterface, args: string): Promise<string> {
  const t = await strings($)
  const [verb = '', ...rest] = args.trim().split(/\s+/)
  const arg = rest.join(' ')

  switch (verb.toLowerCase()) {
    case '':
    case 'status': {
      const left = await mutedFor($)
      const state = left === 0 ? t.statusOn : left > FOREVER / 2 ? t.statusOff : t.statusMuted(duration(left))
      return `${state}\n\n${t.usage}`
    }
    case 'test': {
      const kinds: readonly Kind[] = arg === 'all' ? ['done', 'fail', 'permission', 'context', 'start'] : ['done']
      for (const kind of kinds) {
        notify(
          $,
          s => ({
            kind,
            title: headline(kind, kind === 'fail' ? `Bash ${pick(s.lines.fail)}` : pick(s.lines[kind])),
            body: kind === 'fail' ? 'command not found: foo' : kind === 'context' ? s.contextBody(82) : s.checkItOut,
            meta: `⏱ 1m 05s · 🔧 ${s.tools(3)}${branch ? ` · ⎇ ${branch}` : ''}`,
          }),
          true,
        )
      }
      return t.tested
    }
    case 'mute': {
      const ms = parseDuration(arg || '1h')
      if (ms === undefined) return t.usage
      await $.store.set(MUTED_UNTIL, (await $.clock.now()) + ms)
      return t.muted(duration(ms))
    }
    case 'off':
      await $.store.set(MUTED_UNTIL, FOREVER)
      return t.off
    case 'on':
    case 'unmute':
      await $.store.delete(MUTED_UNTIL)
      return t.on
    case 'lang':
    case 'language': {
      const wanted = arg === 'auto' ? 'auto' : LANGS.find(l => l.toLowerCase() === arg.toLowerCase())
      if (!wanted) return t.badLanguage
      // Saved as the plugin's own setting; the change reloads this module with it.
      const { deny } = await $.config.set({ key: 'notify.language', value: wanted })
      if (deny !== undefined) return deny
      configuredLanguage = wanted
      language = undefined
      return (await strings($)).language(wanted)
    }
    default:
      return t.usage
  }
}

export const register: Register = (on, options) => {
  configuredLanguage = typeof options.language === 'string' ? options.language : 'en'
  contextWarning = typeof options.contextWarning === 'number' ? options.contextWarning : 80
  permissionButtons = options.permissionButtons !== false

  on('session.start', async ($, e, next) => {
    const started = await next(e)
    cwd = e.cwd
    project = e.cwd.split(/[\\/]/).filter(Boolean).pop() ?? project
    branch = await readBranch($, e.cwd)
    const t = await strings($)
    await $.command.register({
      name: 'notify',
      description: t.description,
      argumentHint: '[test | mute 1h | off | on | lang <code>]',
      immediate: true,
    })
    if (e.isInteractive) {
      notify($, s => ({ kind: 'start', title: headline('start', pick(s.lines.start)), body: branch ? s.onBranch(branch) : e.cwd }))
    }
    return started
  })

  on('command.run', { command: 'notify' }, async ($, e) => ({ text: await runCommand($, e.args) }))

  on('turn.start', ($, e, next) => {
    toolsThisTurn = 0
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    toolsThisTurn += 1
    const ran = await next(e)
    if (ran.deny === undefined && ran.isError === true) {
      const now = await $.clock.now()
      if (now - lastFailureAt >= FAILURE_COOLDOWN_MS) {
        lastFailureAt = now
        notify($, s => ({
          kind: 'fail',
          title: headline('fail', `${e.tool} ${pick(s.lines.fail)}`),
          body: clip(ran.text ?? s.failed),
        }))
      }
    }
    return ran
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    // Subagent turns end inside the main turn; only the main loop's end means "come back".
    if (e.agentId === undefined && (e.reason === 'answer' || e.reason === 'error')) {
      const tools = toolsThisTurn
      notify($, s => {
        const meta = [`⏱ ${duration(e.durationMs)}`, tools > 0 ? `🔧 ${s.tools(tools)}` : undefined, branch ? `⎇ ${branch}` : undefined]
          .filter(Boolean)
          .join(' · ')
        return e.reason === 'answer'
          ? { kind: 'done', title: headline('done', pick(s.lines.done)), body: preview(e.answer, s), meta }
          : { kind: 'error', title: headline('error', pick(s.lines.error)), body: s.turnError, meta }
      })
      await checkContext($)
    }
    return done
  })

  // Answer a permission prompt from the popup. Waiting on the popup costs the
  // hook none of its time budget: a $ call in flight does not count.
  on('classic.PermissionRequest', async ($, e, next) => {
    if (!permissionButtons) return next(e)
    asking = true
    try {
      const answer = await askPermission($, e.tool_name, e.tool_input)
      if (answer === 'allow') return { decision: { behavior: 'allow' } }
      if (answer === 'deny') return { decision: { behavior: 'deny', message: (await strings($)).deniedFromPopup } }
    } finally {
      asking = false
      lastAskAt = await $.clock.now()
    }
    return next(e)
  })

  // Permission prompts and idle reminders: the moments Claude is waiting on you.
  on('classic.Notification', async ($, e, next) => {
    const result = await next(e)
    const isPermission = e.notification_type === 'permission_prompt'
    // The popup already asked about this one, Allow / Deny and all.
    if (isPermission && (asking || (await $.clock.now()) - lastAskAt < 5_000)) return result
    notify($, s => ({
      kind: isPermission ? 'permission' : 'start',
      title: isPermission ? headline('permission', pick(s.lines.permission)) : headline('start', e.title ?? 'Claude Code'),
      body: clip(e.message),
    }))
    return result
  })
}
