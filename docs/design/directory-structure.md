# Persona デジタルプロフィールアプリ
## ディレクトリ構成設計書

作成日: 2026-03-10

---

# 1. 目的
本ドキュメントは、**Persona** のMVP開発における、Next.js ベースのディレクトリ構成を定義することを目的とする。

この構成では以下を重視する。

- 見通しの良さ
- 機能ごとの責務分離
- MVP段階での実装のしやすさ
- 将来の拡張性

---

# 2. 前提技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Zod

---

# 3. 設計方針

## 基本方針

- `app/` は **画面・ルーティング** を担当する
- `components/` は **再利用可能なUI部品** を置く
- `features/` は **機能単位のロジック** をまとめる
- `lib/` は **共通ライブラリ・外部サービス接続処理** を置く
- `types/` は **型定義** を管理する
- `constants/` は **定数** を管理する
- `hooks/` は **共通カスタムフック** を置く

---

# 4. ルートディレクトリ構成

```txt
persona/
├─ docs/
│  ├─ decisions/
│  ├─ design/
│  ├─ database/
│  ├─ api/
│  └─ meeting-notes/
├─ public/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ features/
│  ├─ lib/
│  ├─ hooks/
│  ├─ types/
│  ├─ constants/
│  └─ styles/
├─ .env.local
├─ next.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 4.1 docs/
設計書・意思決定ログ・仕様メモなど、実装コード以外のドキュメントを配置する。

```txt
docs/
├─ decisions/
│  ├─ tech-stack.md
│  └─ architecture-decisions.md
├─ design/
│  ├─ directory-structure.md
│  ├─ screen-design.md
│  └─ qr-flow.md
├─ database/
│  ├─ schema.md
│  └─ er-diagram.md
├─ api/
│  ├─ endpoints.md
│  └─ auth-flow.md
└─ meeting-notes/
   └─ yyyy-mm-dd.md
```

### 役割

- `decisions/`: 技術選定や採用判断などの最終決定事項
- `design/`: 画面設計、ディレクトリ構成、機能フローなどの設計書
- `database/`: DBスキーマ、ER図、テーブル設計
- `api/`: API仕様、認証フロー、リクエスト/レスポンス設計
- `meeting-notes/`: 開発メモ、議論ログ、作業メモ

### 運用ルール

- 設計書は原則 `docs/` 配下に集約する
- ファイル名は内容が一目でわかる kebab-case を採用する
- 最終決定事項は `decisions/` に置き、検討中の案と混在させない
- 実装に影響する更新をしたら、関連する設計書も合わせて更新する

---

# 5. 各ディレクトリ詳細

## 5.1 public/
静的ファイルを配置する。

例

- 画像
- アイコン
- favicon

```txt
public/
├─ images/
└─ icons/
```

---

## 5.2 src/app/
Next.js App Router のルーティングとページを管理する。

```txt
src/app/
├─ layout.tsx
├─ page.tsx
├─ globals.css
├─ login/
│  └─ page.tsx
├─ signup/
│  └─ page.tsx
├─ profile/
│  ├─ page.tsx
│  └─ edit/
│     └─ page.tsx
├─ scan/
│  └─ page.tsx
├─ exchange/
│  └─ [token]/
│     └─ page.tsx
└─ contacts/
   └─ page.tsx
```

### 役割

- `page.tsx`: 各画面
- `layout.tsx`: 共通レイアウト
- `globals.css`: グローバルスタイル

### MVP想定画面

- ホーム
- ログイン
- 新規登録
- 自分のプロフィール表示
- プロフィール編集
- QRスキャン画面
- 交換後プロフィール閲覧画面
- 交換済み一覧画面

---

## 5.3 src/components/
アプリ全体で再利用するUIコンポーネントを配置する。

```txt
src/components/
├─ ui/
│  ├─ button.tsx
│  ├─ input.tsx
│  ├─ modal.tsx
│  └─ avatar.tsx
├─ layout/
│  ├─ header.tsx
│  ├─ bottom-nav.tsx
│  └─ page-container.tsx
└─ common/
   ├─ loading.tsx
   ├─ error-message.tsx
   └─ empty-state.tsx
```

### 役割

- `ui/`: 汎用UI部品
- `layout/`: 画面共通レイアウト
- `common/`: 状態表示系コンポーネント

---

## 5.4 src/features/
機能単位でUI・ロジック・バリデーションなどをまとめる。

```txt
src/features/
├─ auth/
│  ├─ components/
│  ├─ actions/
│  ├─ schemas/
│  └─ utils/
├─ profile/
│  ├─ components/
│  ├─ actions/
│  ├─ schemas/
│  └─ utils/
├─ qr/
│  ├─ components/
│  ├─ actions/
│  └─ utils/
├─ exchange/
│  ├─ components/
│  ├─ actions/
│  └─ utils/
└─ contacts/
   ├─ components/
   ├─ actions/
   └─ utils/
```

### 役割

- `components/`: その機能専用のUI
- `actions/`: サーバー処理やデータ更新処理
- `schemas/`: Zodスキーマ
- `utils/`: 機能専用ヘルパー

### 意図

`app/` にロジックを直接書きすぎないようにして、機能ごとに整理する。

---

## 5.5 src/lib/
共通ライブラリや外部サービス接続処理を配置する。

```txt
src/lib/
├─ supabase/
│  ├─ client.ts
│  ├─ server.ts
│  └─ middleware.ts
├─ utils/
│  ├─ cn.ts
│  ├─ date.ts
│  └─ url.ts
└─ validators/
```

### 役割

- Supabase接続設定
- 汎用ユーティリティ
- 共通補助関数

---

## 5.6 src/hooks/
共通カスタムフックを配置する。

```txt
src/hooks/
├─ use-auth.ts
├─ use-profile.ts
└─ use-qr-scanner.ts
```

### 役割

- UIロジックの共通化
- 状態管理の簡略化

※ MVPでは必要最低限のみ導入する。

---

## 5.7 src/types/
型定義を配置する。

```txt
src/types/
├─ auth.ts
├─ profile.ts
├─ exchange.ts
└─ supabase.ts
```

### 役割

- ドメイン型の管理
- Supabaseの型管理

---

## 5.8 src/constants/
定数を配置する。

```txt
src/constants/
├─ routes.ts
├─ profile.ts
└─ messages.ts
```

### 役割

- ルートパス
- 表示メッセージ
- 設定値

---

## 5.9 src/styles/
グローバルCSS以外のスタイル関連を置く場合に使用する。

```txt
src/styles/
└─ tokens.css
```

※ MVPでは `app/globals.css` 中心でもよい。

---

# 6. 推奨ディレクトリ構成（初期実装版）

MVP初期では複雑化を避けるため、以下の形で開始する。

```txt
src/
├─ app/
├─ components/
├─ features/
├─ lib/
├─ types/
├─ constants/
└─ hooks/
```

理由

- 最低限の整理で始められる
- 後から分割しやすい
- 学習コストが低い

---

# 7. 画面とディレクトリの対応

## ホーム
- `src/app/page.tsx`

## ログイン
- `src/app/login/page.tsx`

## 新規登録
- `src/app/signup/page.tsx`

## 自分のプロフィール
- `src/app/profile/page.tsx`

## プロフィール編集
- `src/app/profile/edit/page.tsx`

## QRスキャン
- `src/app/scan/page.tsx`

## 交換先プロフィール閲覧
- `src/app/exchange/[token]/page.tsx`

## 交換済み一覧
- `src/app/contacts/page.tsx`

---

# 8. 実装時のルール

## ルール1
`app/` には画面責務だけを書く。

## ルール2
機能固有ロジックは `features/` に寄せる。

## ルール3
外部サービス接続は `lib/` にまとめる。

## ルール4
複数画面で使うUIは `components/` に置く。

## ルール5
型と定数は早めに分離する。

---

# 9. 最終決定

Persona MVP のディレクトリ構成は、**Next.js App Router を前提に `src/app` 中心で構成し、機能ロジックを `features` に分離する構成** を採用する。あわせて、**設計書・仕様書・技術的意思決定は `docs/` 配下に集約する運用** を採用する。

採用構成の中核は以下とする。

```txt
persona/
├─ docs/
│  ├─ decisions/
│  ├─ design/
│  ├─ database/
│  ├─ api/
│  └─ meeting-notes/
└─ src/
   ├─ app/
   ├─ components/
   ├─ features/
   ├─ lib/
   ├─ hooks/
   ├─ types/
   ├─ constants/
   └─ styles/
```

この構成により、MVP段階ではシンプルさを保ちつつ、コードと設計資料の置き場を明確に分離し、将来的な機能追加やドキュメント管理にも対応できる。

