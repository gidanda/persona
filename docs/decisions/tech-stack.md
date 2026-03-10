# Persona デジタルプロフィールアプリ
## 技術スタック決定書

作成日: 2026-03-10

---

# 1. 目的
本ドキュメントは、デジタルプロフィール交換アプリ **Persona** のMVP開発において採用する技術スタックを明確化することを目的とする。

MVP段階では以下を重視する。

- 開発速度
- 学習コストの低さ
- シンプルなアーキテクチャ
- 将来の拡張性

---

# 2. 最終採用技術スタック

## フロントエンド / サーバー

**Next.js (App Router)**  

役割

- UIレンダリング
- ページルーティング
- サーバー処理
- API的な処理

採用理由

- Reactベース
- フロントとサーバーを同一プロジェクトで扱える
- Vercelとの相性が良い
- モダンなWeb開発の標準

---

## 言語

**TypeScript**

役割

- 型安全な開発
- バグの早期発見

採用理由

- Next.jsとの相性が良い
- 大規模化しても保守しやすい

---

## UI

**Tailwind CSS**

役割

- UIスタイリング

採用理由

- 開発スピードが速い
- コンポーネント設計と相性が良い
- デザイン試行が簡単

---

## Backend Platform

**Supabase**

利用機能

- Database (PostgreSQL)
- Authentication
- Storage

役割

### Database

保存データ

- Users
- Profiles
- Exchange history
- Follow relationships

### Authentication

機能

- ユーザー登録
- ログイン
- セッション管理

### Storage

用途

- プロフィール画像保存

採用理由

- Backend機能を一体で提供
- Firebase代替として人気
- MVP構築が非常に速い

---

## バリデーション

**Zod**

役割

- API入力検証
- フォーム検証

採用理由

- TypeScriptと相性が良い
- 型とバリデーションを統合できる

---

## QRコード読み取り

**Browser Camera API + QRライブラリ**

技術

- getUserMedia

役割

- カメラ起動
- QRコード読み取り

用途

- デジタルプロフィール交換

---

## デプロイ

**Vercel**

役割

- Webアプリホスティング

採用理由

- Next.js公式ホスティング
- CI/CDが簡単
- デプロイが高速

---

# 3. MVPアーキテクチャ

```
User
  ↓
Browser
  ↓
Next.js
  ↓
Supabase
  ├ Database
  ├ Auth
  └ Storage
```

---

# 4. 不採用技術

## Prisma

理由

- SupabaseでDB操作が完結する
- MVPでは不要なレイヤー

将来

- DB操作が複雑化した場合に導入検討

---

## React Native / Expo

理由

- MVP段階ではWebアプリで十分
- ネイティブ開発コストが高い

将来

- モバイルアプリ化する場合に検討

---

# 5. 将来の拡張候補

以下はMVP完成後に導入を検討する

## TanStack Query

用途

- クライアント側データ管理

---

## React Hook Form

用途

- フォーム管理

---

## Supabase Realtime

用途

- リアルタイム同期

---

# 6. 最終決定

Persona MVPの技術スタックは以下とする

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Zod
- Vercel

---

この構成により

- シンプル
- 高速開発
- 拡張可能

なアーキテクチャを実現する。

