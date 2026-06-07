# Dream Journal — Obsidian plugin

React-based Obsidian plugin. React roots are mounted inside Obsidian's `ItemView` (`src/views/ReactView.tsx`) and `PluginSettingTab` (`src/main.tsx`). Path alias `@/*` → `src/*`.

- Build: `npm run build` (tsc type-check + esbuild) · Dev: `npm run dev`
- Releases: bump `manifest.json` + `versions.json` via `npm version` (runs `version-bump.mjs`)

## Obsidian plugin guidelines (enforce on every change)

Distilled from https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines — these are community-review requirements, not suggestions.

### API usage

- Use `this.app` (or the React `AppContext`) — never the global `app`.
- Never touch undocumented internals (`app.plugins`, `app.setting`, etc.). The plugin's own manifest is `this.manifest` — pass it into React via context/props, don't look the plugin up by id.
- Prefer the Vault API over the Adapter API: `vault.getFolderByPath()` / `getFileByPath()` / `getAbstractFileByPath()` — not `vault.adapter.exists()` or other `adapter.*` calls.
- Don't iterate `vault.getFiles()` to find files under a known path — use `getFolderByPath(dir)?.children` or `getFileByPath()`.
- Reading files: `vault.cachedRead()` for display/export; `vault.read()` only when the latest on-disk content matters.
- Modifying files: Editor API for the active file, `Vault.process()` for background edits, `FileManager.processFrontMatter()` for frontmatter. Avoid `Vault.modify()`.
- Run every user-supplied or user-configurable path through `normalizePath()`, and strip characters Obsidian forbids in filenames (`* " \ / < > : | ? #`) before building a path from user input (e.g. dream titles).
- Use `getActiveViewOfType()` / `workspace.activeEditor` — never `workspace.activeLeaf`.

### Lifecycle & resources

- Everything created in `onload()` must clean itself up: use `registerEvent()`, `registerDomEvent()`, `registerInterval()`, `addCommand()` etc. so Obsidian handles teardown.
- **Never detach leaves in `onunload()`** — it destroys the user's saved layout.
- Don't store references to custom view instances (memory leak); the `registerView` factory pattern used in `src/main.tsx` is correct — keep it.
- Always unmount React roots: `onClose()` in views, `hide()` in setting tabs (current code does this — preserve it when adding views).
- Defer vault writes at startup (e.g. folder creation) to `this.app.workspace.onLayoutReady(() => ...)`, not bare `onload()`.

### Mobile compatibility (`isDesktopOnly: false`)

- No Node.js or Electron APIs (`fs`, `path`, `child_process`, `electron`, `process`, …). Browser-capable libs only (jsPDF is fine).
- No regex lookbehind (`(?<=`, `(?<!`) — older iOS doesn't support it.

### Security

- Never build DOM from strings: no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `dangerouslySetInnerHTML`. Use React JSX or Obsidian's `createEl()`/`createDiv()`/`createSpan()`.

### UI text

- **Sentence case everywhere**: "Start date", not "Start Date". Acronyms keep their casing ("Export to PDF").
- Don't put the word "settings" in settings headings; only add section headings when there are multiple sections. With the Setting API use `setHeading()`, not raw heading elements.
- Commands: never set default hotkeys. Pick `callback` vs `checkCallback` vs `editorCallback` appropriately. Don't prefix command names with the plugin name (Obsidian adds it).

### Styling

- No hardcoded inline styles — use classes in `styles.css`. The one sanctioned exception: data-driven values (e.g. per-emotion colors), preferably as a CSS custom property (`style={{ '--emotion-color': c }}`).
- Prefer Obsidian CSS variables (`var(--background-primary)`, `var(--text-normal)`, …) over hardcoded colors so themes work.

### TypeScript

- `const`/`let`, never `var`; `async/await`, not `.then()` chains.
- Don't `console.log` in shipped code paths; errors the user should know about go through `new Notice(...)` (a sparse `console.error` alongside is acceptable).

## Repo-specific notes

- The dreams folder is a user setting: `plugin.settings.dreamsDir` (default `DEFAULT_DREAMS_DIR` in `src/constants.ts`), persisted to `data.json` (gitignored) via `loadData`/`saveData`. Never hardcode vault paths — read the setting at action time and call `plugin.ensureDreamsFolder()` before writing files into it.
- React reaches the plugin instance via `PluginContext` + `usePlugin()` (provided by both `ReactView` and the setting tab). The manifest comes from `usePluginManifest()` → `plugin.manifest` — never from `app.plugins`.
- The setting tab mixes native `Setting` controls (top) with the React `SettingsView` footer (bottom) — add new settings as native `Setting` rows, not React inputs.
- `manifest.json` `minAppVersion` is `1.7.2` (aligned with the large-language-models plugin; the hard API floor is 1.5.7 for `Vault.getFolderByPath`) — bump it again if you adopt newer APIs.
- Release checklist: `manifest.json` version must match the git tag; update `versions.json`.
