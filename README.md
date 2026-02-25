# todo-app-design-log

Vanilla JS（HTML/CSS/JavaScript）で作ったToDoアプリを題材に、**設計・責任分離・運用（Issue/PR）** の思考をログとして残すリポジトリです。
「動くもの」だけでなく、**なぜその構造にしたか**を説明できる状態を目指します。

## Demo
- GitHub Pages: https://pon2kyabetsu.github.io/todo-app-design-log/

## What you can learn from this repo
- 状態（state）/ 描画（view）/ 永続化（storage）の責務分離
- UIイベントから state を更新して render する一連の流れ（データフロー）
- 改善を Issue → PR で管理し、設計判断を言語化する運用

## Features
- ToDo追加 / 完了切替 / 削除
- フィルタ（all / active / done）
- 検索（debounceで保存）
- ソート（new / old / activeFirst）
- localStorage 永続化（todos / prefs）
- Import / Export

## Getting Started
1. このリポジトリをclone
2. `index.html` をブラウザで開く（または Live Server で起動）

## Architecture / Design
このアプリは「状態（state）」「描画（view）」「保存（storage）」を分け、イベント駆動で動作します。

### Responsibility
- `state.js` : 状態（todos / filter / search / sort）を保持
- `storage.js` : localStorageの読み書き（save/load）
- `view.js` : state から UI を描画（render）
- `app.js` : イベント受付 → state更新 → 保存 → render のオーケストレーション

### Data Flow（例：検索）
input → `searchQuery` 更新 → `render()` →（300ms後）`savePrefs()`

## Development Workflow (Issue/PR)
改善を Issue と PR で管理します。

### Issue に書くこと（テンプレ）
- Goal（なぜやるか）
- Scope（どこを変えるか）
- Design（方針・判断）
- Acceptance Criteria（完了条件）
- Test plan（どう確認するか）

### PR に書くこと（テンプレ）
- Summary（何をしたか）
- Design decision（重要な判断と理由）
- How to test（確認手順）
- Notes / Trade-offs（副作用や今後）

## Planning / Issues
改善タスクは GitHub Issues で管理します（最新の予定はIssuesを参照）。
- Issues: 目的 / 方針 / 影響範囲 / Acceptance Criteria
- PR: 設計判断 / 変更点 / 動作確認
