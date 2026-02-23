# todo-app-design-log

Vanilla JS（HTML/CSS/JavaScript）で作ったToDoアプリを題材に、**設計・責任分離・運用(Issue/PR)**の思考をログとして残すリポジトリです。  
「動くもの」だけでなく、**なぜその構造にしたか**を説明できる状態を目指します。

## Demo
- GitHub Pages: TODO（有効化したらURLを貼る）

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

## Design
このアプリは「状態（state）」「描画（view）」「保存（storage）」を分け、イベント駆動で動作します。

### Responsibility
- `state.js` : 状態（todos / filter / search / sort）を保持する
- `storage.js` : localStorageの読み書き（save/load）
- `view.js` : state から UI を描画（render）
- `app.js` : イベント受付 → state更新 → 保存 → render のオーケストレーション

### Data Flow（例：検索）
input → `searchQuery` 更新 → `render()` → （300ms後）`savePrefs()`

## Development Log (Issue/PR)
このリポジトリでは、改善を Issue と PR で管理します。
- Issue: 目的 / 方針 / 影響範囲
- PR: 設計判断 / 動作確認 / 変更点

## Next Issues
- [ ] feat: GitHub Pagesでデモ公開
- [ ] feat: URL hashでfilter状態を共有できるようにする
- [ ] refactor: UI反映処理を applyPrefsToUI() に集約する