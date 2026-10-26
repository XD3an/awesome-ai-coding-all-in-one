import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

type Shown = { argv: readonly string[]; json?: Record<string, any>; script?: string }

type World = {
  os?: 'Windows_NT' | 'Darwin' | 'Linux'
  /** Exit code of the notifier; non-zero means it is missing. */
  exitCode?: number
  /** The git branch; absent means git is not installed. */
  branch?: string
  /** What Get-UICulture prints on Windows. */
  culture?: string
  env?: Record<string, string>
  /** What the popup prints back: `decision: allow`, ... */
  popupSays?: string
  /** Context window fill, in percent, as $.session.usage reports it. */
  percent?: number
}

const ok = (stdout = '', exitCode = 0) => ({
  value: { exitCode, stdout, stderr: exitCode ? 'no notifier' : '', isStdoutTruncated: false, isStderrTruncated: false },
})

// The world beneath the plugin: processes, environment, store, config and usage.
// Records every desktop notification the plugin shows.
function world(on: On, w: World = {}) {
  const os = w.os ?? 'Windows_NT'
  const shown: Shown[] = []
  const configSets: unknown[] = []
  const registered: string[] = []
  const usage = { percent: w.percent }
  mock.env(on, { ...(os === 'Windows_NT' ? { OS: os } : {}), ...w.env })
  mock.store(on)
  on('process.run', ($, e) => {
    const [cmd] = e.argv
    if (cmd === 'uname') return ok(`${os}\n`)
    if (cmd === 'git') {
      if (w.branch === undefined) throw new Error('spawn git ENOENT')
      return ok(`${w.branch}\n`)
    }
    if (e.argv.includes('(Get-UICulture).Name')) return ok(`${w.culture ?? 'en-US'}\n`)
    const raw = e.init?.env?.CC_NOTIFY_JSON
    shown.push({ argv: e.argv, json: raw ? JSON.parse(raw) : undefined, script: e.init?.env?.CC_NOTIFY_SCRIPT })
    return ok(w.popupSays ?? 'popup: timeout\n', w.exitCode ?? 0)
  })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => {
    registered.push(e.name)
    return { value: { command: e.name } }
  })
  on('config.set', ($, e) => {
    configSets.push(e)
    return { value: e.value }
  })
  on('session.usage', () => ({
    value: { startedAt: 0, rateLimits: [], context: { window: 200_000, percent: usage.percent } },
  }))
  on('turn.start', () => ({}) as never)
  on('turn.complete', () => ({ text: '' }))
  on('ui.log', () => ({ value: undefined }))
  return { shown, configSets, usage, registered }
}

const session = { cwd: 'C:\\work\\cc-plus', surface: 'terminal' as const, isInteractive: true }
const turn = { answer: '## Done\n\nRefactored **the notify mod**.', durationMs: 133_000, isAborted: false, turnId: 't1' }
const en = { options: { language: 'en' } }

function slash($: Engine, args: string) {
  return $.command.run({
    command: 'notify',
    args,
    origin: { kind: 'composer' } as never,
    presentation: { isFullscreen: false, columns: 120 },
  })
}

test('a session start greets with the project and branch, and registers /notify', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown, registered } = world(on, { branch: 'main' })

  await $.session.start(session)
  await clock.settle()

  expect(registered).toEqual(['notify'])
  expect(shown).toHaveLength(1)
  expect(shown[0]?.argv.slice(0, 4)).toEqual(['powershell.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand'])
  expect(shown[0]?.script).toMatch(/\\assets\\popup\.ps1$/)
  expect(shown[0]?.json).toEqual(
    expect.objectContaining({ title: expect.stringMatching(/^✳️ cc-plus · /), body: 'on main', launch: 'file:///C:/work/cc-plus' }),
  )
})

test('every main turn notifies, with the answer preview, duration, tool count and branch', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { branch: 'main' })
  on('tool.call', () => ({ result: 'fine' as never, text: 'fine' }))

  await $.session.start({ ...session, isInteractive: false })
  await $.tool.call({ tool: 'Read', file_path: 'a.md' })
  await $.tool.call({ tool: 'Read', file_path: 'b.md' })
  await $.turn.complete({ ...turn, reason: 'answer' })
  await $.turn.complete({ ...turn, durationMs: 3_000, reason: 'answer' })
  await clock.settle()

  expect(shown).toHaveLength(2)
  expect(shown[0]?.json).toEqual(
    expect.objectContaining({ kind: 'done', title: expect.stringMatching(/^✅ cc-plus · /), body: 'Done', meta: '⏱ 2m 13s · 🔧 2 tools · ⎇ main' }),
  )
  expect(shown[1]?.json?.meta).toMatch(/^⏱ 3s/)
})

test('works with nothing extra installed: no git, no branch', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on)

  await $.session.start(session)
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()

  expect(shown).toHaveLength(2)
  expect(shown[0]?.json).toEqual(expect.objectContaining({ body: 'C:\\work\\cc-plus' }))
  expect(shown[1]?.json).toEqual(expect.objectContaining({ meta: '⏱ 2m 13s' }))
})

test('subagent and interrupted turns stay quiet', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on)

  await $.turn.complete({ ...turn, reason: 'answer', agentId: 'sub-1' })
  await $.turn.complete({ ...turn, reason: 'aborted', isAborted: true })
  await clock.settle()

  expect(shown).toHaveLength(0)
})

test('tool failures notify once per cooldown window', en, async ($, on) => {
  const clock = mock.clock(on, { now: 100_000 })
  const { shown } = world(on, { os: 'Darwin' })
  on('tool.call', () => ({ result: 'boom' as never, isError: true, text: 'command not found: foo' }))

  await $.tool.call({ tool: 'Bash', command: 'foo' })
  await $.tool.call({ tool: 'Bash', command: 'foo' })
  await clock.settle()
  expect(shown).toHaveLength(1)
  expect(shown[0]?.argv[0]).toBe('osascript')
  expect(shown[0]?.argv.at(-4)).toMatch(/^💥 .* · Bash /)
  expect(shown[0]?.argv.slice(-3)).toEqual(['command not found: foo', '', 'Basso'])

  await clock.advance(10_000)
  await $.tool.call({ tool: 'Bash', command: 'foo' })
  await clock.settle()
  expect(shown).toHaveLength(2)
})

test('a permission prompt is urgent on Linux', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { os: 'Linux' })
  on('classic.Notification', () => ({}))

  await $.classic.Notification({ message: 'Claude needs your permission to use Bash', notification_type: 'permission_prompt' })
  await clock.settle()

  expect(shown[0]?.argv).toEqual(expect.arrayContaining(['notify-send', '--urgency=critical', 'Claude needs your permission to use Bash']))
  expect(shown[0]?.argv.find(a => a.startsWith('--icon='))).toMatch(/assets\/permission\.png$/)
})

test('falls back to an in-app toast when no desktop notifier exists', en, async ($, on) => {
  const clock = mock.clock(on)
  world(on, { os: 'Linux', exitCode: 1 })
  const toasts: string[] = []
  on('ui.toast', ($, e) => {
    toasts.push(e.text)
    return { value: undefined }
  })

  await $.turn.complete({ ...turn, reason: 'error' })
  await clock.settle()

  expect(toasts).toHaveLength(1)
  expect(toasts[0]).toMatch(/^⚠️ .*: The turn ended with an error\.$/)
})

// --- language ---------------------------------------------------------------

test('the language option picks the words', { options: { language: 'zh-TW' } }, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { branch: 'main' })
  on('tool.call', () => ({ result: 'fine' as never, text: 'fine' }))

  await $.session.start(session)
  await $.tool.call({ tool: 'Read', file_path: 'a.md' })
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()

  expect(shown[0]?.json).toEqual(expect.objectContaining({ body: '在 main 分支', openLabel: '開啟資料夾' }))
  expect(shown[1]?.json?.meta).toBe('⏱ 2m 13s · 🔧 1 個工具 · ⎇ main')
})

test('auto follows LANG on macOS and Linux', { options: { language: 'auto' } }, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { os: 'Linux', env: { LANG: 'ja_JP.UTF-8' } })

  await $.turn.complete({ ...turn, reason: 'error' })
  await clock.settle()

  expect(shown[0]?.argv.at(-1)).toMatch(/^ターンがエラーで終了しました。/)
})

test('auto follows the Windows display language', { options: { language: 'auto' } }, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { culture: 'zh-TW' })

  await $.turn.complete({ ...turn, reason: 'error' })
  await clock.settle()

  expect(shown[0]?.json?.body).toBe('這回合因為錯誤而結束了。')
})

test('English by default', async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { culture: 'zh-TW', env: { LANG: 'ja_JP.UTF-8' } })

  await $.turn.complete({ ...turn, reason: 'error' })
  await clock.settle()

  expect(shown[0]?.json?.body).toBe('The turn ended with an error.')
})

// --- /notify ----------------------------------------------------------------

test('/notify mute silences every notification until /notify on', en, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const { shown } = world(on)

  expect((await slash($, 'mute 30m')).text).toBe('Muted for 30m 0s.')
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()
  expect(shown).toHaveLength(0)
  expect((await slash($, '')).text).toMatch(/^Muted for 30m 0s more\./)

  await clock.advance(31 * 60_000)
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()
  expect(shown).toHaveLength(1)

  await slash($, 'off')
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()
  expect(shown).toHaveLength(1)
  expect((await slash($, 'status')).text).toMatch(/^Notifications are off\./)

  expect((await slash($, 'on')).text).toBe('Notifications are back on.')
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()
  expect(shown).toHaveLength(2)
})

test('/notify test shows samples even while muted', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on)

  await slash($, 'off')
  expect((await slash($, 'test all')).text).toBe('Sent a sample notification.')
  await clock.settle()

  expect(shown.map(s => s.json?.kind)).toEqual(['done', 'fail', 'permission', 'context', 'start'])
})

test('/notify lang saves the setting and answers in the new language', en, async ($, on) => {
  mock.clock(on)
  const { configSets } = world(on)

  expect((await slash($, 'lang zh-TW')).text).toBe('語言已設為 zh-TW。')
  expect(configSets).toEqual([expect.objectContaining({ key: 'notify.language', value: 'zh-TW' })])
  expect((await slash($, 'lang klingon')).text).toBe('請選擇：auto、en、zh-TW、zh-CN、ja')
})

test('/notify with no arguments lists what it can do', en, async ($, on) => {
  mock.clock(on)
  world(on)

  const { text } = await slash($, '')
  expect(text).toMatch(/^Notifications are on\./)
  expect(text).toContain('/notify mute [1h]')
})

// --- context ----------------------------------------------------------------

test('warns once when the context fills up, again near the end, and again after a compact', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown, usage } = world(on, { percent: 82 })
  const contextWarnings = () => shown.filter(s => s.json?.kind === 'context').map(s => s.json?.body)

  await $.turn.complete({ ...turn, reason: 'answer' })
  usage.percent = 85
  await $.turn.complete({ ...turn, reason: 'answer' })
  usage.percent = 93
  await $.turn.complete({ ...turn, reason: 'answer' })
  usage.percent = 20 // after /compact
  await $.turn.complete({ ...turn, reason: 'answer' })
  usage.percent = 81
  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()

  expect(contextWarnings()).toEqual([
    '82% of the context window is used. Time to /compact or start fresh.',
    '93% of the context window is used. Time to /compact or start fresh.',
    '81% of the context window is used. Time to /compact or start fresh.',
  ])
})

test('contextWarning 0 turns the warning off', { options: { language: 'en', contextWarning: 0 } }, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { percent: 99 })

  await $.turn.complete({ ...turn, reason: 'answer' })
  await clock.settle()

  expect(shown.map(s => s.json?.kind)).toEqual(['done'])
})

// --- Allow / Deny -----------------------------------------------------------

const permission = { tool_name: 'Bash', tool_input: { command: 'npm run build && npm test' } }

test('Allow on the popup allows the tool call', en, async ($, on) => {
  mock.clock(on)
  const { shown } = world(on, { popupSays: 'decision: allow\npopup: answered allow\n' })
  on('classic.PermissionRequest', () => {
    throw new Error('the terminal should not be asked')
  })

  const result = await $.classic.PermissionRequest(permission)

  expect(result.decision).toEqual({ behavior: 'allow' })
  expect(shown[0]?.json).toEqual(
    expect.objectContaining({ kind: 'permission', ask: { detail: 'Bash: npm run build && npm test', allow: 'Allow', deny: 'Deny' } }),
  )
})

test('Deny on the popup denies it, with a reason for Claude', en, async ($, on) => {
  mock.clock(on)
  world(on, { popupSays: 'decision: deny\npopup: answered deny\n' })

  const result = await $.classic.PermissionRequest(permission)

  expect(result.decision).toEqual({ behavior: 'deny', message: 'The user denied this from the notification popup.' })
})

test('closing the popup leaves the question to the terminal, without a second popup', en, async ($, on) => {
  const clock = mock.clock(on)
  const { shown } = world(on, { popupSays: 'popup: closed\n' })
  let terminalAsked = false
  on('classic.PermissionRequest', () => {
    terminalAsked = true
    return {}
  })
  on('classic.Notification', () => ({}))

  const result = await $.classic.PermissionRequest(permission)
  await $.classic.Notification({ message: 'Claude needs your permission to use Bash', notification_type: 'permission_prompt' })
  await clock.settle()

  expect(terminalAsked).toBe(true)
  expect(result.decision).toBeUndefined()
  expect(shown).toHaveLength(1)
})

test('permissionButtons off: the terminal asks as usual', { options: { permissionButtons: false } }, async ($, on) => {
  mock.clock(on)
  const { shown } = world(on)
  on('classic.PermissionRequest', () => ({}))

  const result = await $.classic.PermissionRequest(permission)

  expect(result.decision).toBeUndefined()
  expect(shown).toHaveLength(0)
})
