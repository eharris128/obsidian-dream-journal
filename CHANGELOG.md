# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.6] - 2026-06-08

### Added

- Optional per-dream LuCiD questionnaire for tracking lucidity across dreams.
- `SECURITY.md` security policy.

### Changed

- Bundle Preact in place of React and externalize `node:` builtins to shrink the
  plugin bundle and keep it mobile-compatible.
- Swap jsPDF for pdf-lib in the dream export to drop the Node-only dependency.
- Follow Obsidian plugin guidelines: linting, CSS, and metadata fixes.
- Scope the "Add" button styles so they no longer hijack the lucid toggle.

### Fixed

- Stop questionnaire rating clicks from scrolling the page.
- Clear lint warnings around typing, popout safety, and a floating promise.
- Correct the Stumbrys et al. 2013 reference in the README.

## [0.0.5] - 2026-06-07

- Earlier release. See the Git history for details.

## [0.0.4] - 2024-12-17

- Earlier release. See the Git history for details.

## [0.0.1] - 2024-11-24

- Initial public release.

[0.0.6]: https://github.com/eharris128/obsidian-dream-journal/releases/tag/0.0.6
[0.0.5]: https://github.com/eharris128/obsidian-dream-journal/releases/tag/0.0.5
[0.0.4]: https://github.com/eharris128/obsidian-dream-journal/releases/tag/0.0.4
[0.0.1]: https://github.com/eharris128/obsidian-dream-journal/releases/tag/0.0.1
