# Persona

対面で出会った相手と、QRコードでプロフィールを交換するデジタルプロフィールアプリです。

## 概要

Persona は「人を知るためのデジタル名刺」をコンセプトにした Web アプリです。SNS リンクの共有だけでなく、好みや今考えていること、今取り組んでいることまで含めて、相手の人物像を短時間で伝えられる体験を目指しています。

MVP では、以下の流れを成立させることを優先します。

- ユーザー登録とログイン
- 初回プロフィール作成
- 自分のプロフィール表示と編集
- QR コードによるプロフィール交換
- 交換済み相手の一覧表示と再閲覧

現在は初回実装の骨格として、Next.js App Router のページ雛形、`src/lib` の接続基盤、`features` 単位の最小ファイル構成までを配置しています。

## 主要機能

### アカウント

- メールアドレスログイン
- Google ログインは後続対応

### プロフィール

- 実名、表示名
- 自己紹介
- アバター
- SNS リンク
- Taste / Thinking / Doing / 自由記入欄は後続対応

### 交換

- QR コード表示
- QR コード読み取りによる交換成立
- 交換済み相手の一覧表示
- お気に入り登録

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Prisma
- Zod
- Vercel

## ディレクトリ構成

```text
persona/
├─ docs/
│  ├─ decisions/
│  ├─ design/
│  ├─ database/
│  ├─ api/
│  └─ meeting-notes/
├─ prisma/
│  └─ schema.prisma
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
├─ package.json
├─ tsconfig.json
└─ README.md
```

## データ構造

MVP の主要ドメインは以下です。

- ユーザー情報
- 公開プロフィール情報
- SNS リンク
- 交換済みプロフィール情報

詳細は [docs/database/schema.md](/Users/goudayuuki/dev/persona/docs/database/schema.md) と [docs/database/db-design.md](/Users/goudayuuki/dev/persona/docs/database/db-design.md) を参照してください。

## セットアップ

前提:

- Node.js
- npm
- Supabase プロジェクト

依存関係のインストール:

```bash
npm install
```

環境変数:

```bash
cp .env.local.example .env.local
```

`.env.local` を作成して、以下を自分の環境に合わせて埋めてください。

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

Prisma クライアント生成:

```bash
npx prisma generate
```

マイグレーション:

```bash
npx prisma migrate dev
```

Prisma Studio:

```bash
npx prisma studio
```

開発サーバー起動:

```bash
npm run dev
```

起動後は `http://localhost:3000` を開きます。

## ドキュメント

設計資料は `docs/` 配下に配置しています。

- [docs/decisions/tech-stack.md](/Users/goudayuuki/dev/persona/docs/decisions/tech-stack.md)
- [docs/design/directory-structure.md](/Users/goudayuuki/dev/persona/docs/design/directory-structure.md)
- [docs/design/requirements.md](/Users/goudayuuki/dev/persona/docs/design/requirements.md)
- [docs/design/screen-spec.md](/Users/goudayuuki/dev/persona/docs/design/screen-spec.md)
- [docs/design/mvp-design.md](/Users/goudayuuki/dev/persona/docs/design/mvp-design.md)
- [docs/design/mvp-screen-db-design.md](/Users/goudayuuki/dev/persona/docs/design/mvp-screen-db-design.md)
- [docs/database/schema.md](/Users/goudayuuki/dev/persona/docs/database/schema.md)
- [docs/database/db-design.md](/Users/goudayuuki/dev/persona/docs/database/db-design.md)

## 今後の拡張候補

- モバイルアプリ化
- 公開範囲設定の拡張
- コンタクト管理の強化
- メッセージ機能

## ライセンス

[LICENSE](/Users/goudayuuki/dev/persona/LICENSE) を参照してください。
