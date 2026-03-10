# Persona デジタルプロフィールアプリ
## DBスキーマ設計書

作成日: 2026-03-10

---

# 1. 目的
本ドキュメントは、**Persona** のMVP開発におけるデータベース構造を定義することを目的とする。

本設計は、アップロードされた Prisma スキーマ定義をベースにしつつ、**認証基盤として Supabase Auth を採用する前提**で再整理したものである。

---

# 2. 設計対象

本スキーマでは、以下の主要ドメインを扱う。

- ユーザー情報
- 公開プロフィール情報
- SNSリンク
- 交換済みプロフィール情報

---

# 3. 採用方針

- DB は PostgreSQL を前提とする
- 認証は **Supabase Auth** を利用する
- アプリ側の業務データは Prisma で扱う
- 主キーは UUID を採用する
- テーブル名は複数形で統一する
- カラム名は snake_case を採用する
- アプリケーションコード上では camelCase を使用し、Prisma の `@map` により対応する
- 1ユーザーにつき1プロフィールを持つ
- SNSリンクはプロフィールに従属する
- 交換済みデータは `connections` テーブルで管理する
- 認証情報（メールアドレス、パスワード、セッション）は **auth.users** を正とし、アプリ独自テーブルに重複保持しない

---

# 4. Enum設計

## 4.1 AvatarType
アバター画像の生成方法を表す。

### 値
- `generated`: 自動生成アバター
- `uploaded`: アップロード画像

---

## 4.2 AvatarStyle
アバターの見た目スタイルを表す。

### 値
- `pixel_classic`: ピクセル調クラシックスタイル

※ MVPでは1種類のみ採用し、将来的に追加可能とする。

---

## 4.3 SnsType
SNSリンクの種別を表す。

### 値
- `x`
- `instagram`
- `linkedin`
- `other`

---

# 5. テーブル設計

## 5.1 users
アプリケーション固有のユーザー基本情報を保持するテーブル。

### 役割
- Supabase Auth の `auth.users` と 1 : 1 で対応する業務データの保持
- ログイン後に必要なアプリ固有情報の管理
- 表示名・実名・本人確認用文字列の保持
- プロフィール入力完了状態の保持

### カラム

| カラム名 | 型 | 必須 | 説明 |
|---|---|---:|---|
| id | UUID | Yes | 主キー。`auth.users.id` と同一値を使用 |
| user_id | varchar(50) | Yes | アプリ内で利用する公開/ログイン用ユーザーID、一意 |
| display_name | varchar(100) | Yes | 表示名 |
| real_name | varchar(100) | Yes | 実名 |
| verification_value | varchar(255) | Yes | 本人確認用の値 |
| profile_completed | boolean | Yes | プロフィール完成フラグ |
| created_at | timestamp | Yes | 作成日時 |
| updated_at | timestamp | Yes | 更新日時 |

### 制約
- `id` は主キー
- `id` は **Supabase Auth の `auth.users.id` を参照する前提**
- `user_id` は一意

### リレーション
- `profiles` と 1 : 1
- `connections` と 1 : N

### 補足
- **`password_hash` は保持しない**
- メールアドレス・パスワード・セッションは Supabase Auth 側で管理する
- ユーザー登録時は `auth.users` 作成後に `public.users` を作成する

---

## 5.2 profiles
ユーザーの公開プロフィール情報を保持するテーブル。

### 役割
- 自己紹介文の保持
- アバター情報の保持
- 公開プロフィール本体の管理

### カラム

| カラム名 | 型 | 必須 | 説明 |
|---|---|---:|---|
| id | UUID | Yes | 主キー |
| user_id | UUID | Yes | users.id への外部キー、一意 |
| bio | text | No | 自己紹介 |
| avatar_type | enum(AvatarType) | Yes | アバター種別 |
| avatar_style | enum(AvatarStyle) | Yes | アバタースタイル |
| avatar_seed | varchar(100) | Yes | 生成アバター用シード |
| avatar_image_url | text | No | アバター画像URL |
| created_at | timestamp | Yes | 作成日時 |
| updated_at | timestamp | Yes | 更新日時 |

### 制約
- `id` は主キー
- `user_id` は一意

### リレーション
- `users` と 1 : 1
- `sns_links` と 1 : N

---

## 5.3 sns_links
プロフィールに紐づくSNSリンクを保持するテーブル。

### 役割
- X、Instagram、LinkedIn などの外部SNS導線管理
- 表示順序の管理

### カラム

| カラム名 | 型 | 必須 | 説明 |
|---|---|---:|---|
| id | UUID | Yes | 主キー |
| profile_id | UUID | Yes | profiles.id への外部キー |
| type | enum(SnsType) | Yes | SNS種別 |
| url | text | Yes | SNS URL |
| sort_order | int | Yes | 表示順 |
| created_at | timestamp | Yes | 作成日時 |
| updated_at | timestamp | Yes | 更新日時 |

### 制約
- `id` は主キー
- `profile_id` にインデックスを付与

### リレーション
- `profiles` と N : 1

---

## 5.4 connections
交換済みユーザー同士の関係を保持するテーブル。

### 役割
- QR交換完了後の接続情報を保持
- お気に入り状態を保持
- 誰と誰が交換済みかを管理

### カラム

| カラム名 | 型 | 必須 | 説明 |
|---|---|---:|---|
| id | UUID | Yes | 主キー |
| user_id | UUID | Yes | 接続元ユーザーID |
| partner_user_id | UUID | Yes | 接続先ユーザーID |
| is_favorite | boolean | Yes | お気に入りフラグ |
| exchanged_at | timestamp | Yes | 交換日時 |
| created_at | timestamp | Yes | 作成日時 |
| updated_at | timestamp | Yes | 更新日時 |

### 制約
- `id` は主キー
- `(user_id, partner_user_id)` は複合一意制約
- `user_id` にインデックスを付与
- `partner_user_id` にインデックスを付与

### リレーション
- `users` と N : 1
- `users` と N : 1（接続先）

### 補足
MVPでは、交換は**片方向レコード**として扱うか、**相互に2レコード作成する**かを実装時に統一する必要がある。
現行スキーマでは両方の実装が可能だが、アプリ仕様上は **相互交換を表現するため2レコード作成** の方が扱いやすい。

---

# 6. リレーション概要

```txt
users
 └─ profiles (1:1)
     └─ sns_links (1:N)

users
 └─ connections (1:N)
users
 └─ connections.partner_user (1:N)
```

---

# 7. データ構造の意図

## 7.1 users と profiles を分ける理由
認証情報と公開プロフィール情報を分離するため。

これにより以下の利点がある。

- 認証系データと公開データの責務分離
- プロフィール未完成状態を扱いやすい
- 将来的な公開範囲制御に対応しやすい

---

## 7.2 sns_links を分離する理由
SNSリンク数が可変であるため。

これにより以下の利点がある。

- 複数SNSに柔軟対応できる
- 表示順制御ができる
- SNS種別の追加が容易

---

## 7.3 connections を独立させる理由
交換履歴とお気に入り状態を独立管理するため。

これにより以下の利点がある。

- 交換履歴一覧画面を作りやすい
- お気に入り管理がしやすい
- 将来的にメモやタグ追加へ拡張しやすい

---

# 8. MVPでの運用ルール

## ルール1
ユーザー登録完了後に `users` を作成する。

## ルール2
プロフィール初期作成時に `profiles` を1件作成する。

## ルール3
SNSリンクは0件以上登録可能とする。

## ルール4
交換成立時に `connections` を作成する。

## ルール5
お気に入りは `connections.is_favorite` で管理する。

---

# 9. 実装上の注意点

## 9.1 認証について
本設計では、認証基盤として **Supabase Auth** を採用する。

そのため、認証の責務は以下のように分離する。

### Supabase Auth 側で管理するもの
- メールアドレス
- パスワード
- セッション
- 認証済みユーザーID

### アプリ独自 `users` テーブルで管理するもの
- `user_id`
- `display_name`
- `real_name`
- `verification_value`
- `profile_completed`

### 設計上の結論
- `users.password_hash` は **削除** する
- `users.id` は **`auth.users.id` と同一UUIDを利用する設計** にする
- ログイン/サインアップ処理は Supabase Auth 経由で行う

## 9.2 connections の重複管理
相互交換の実装方針を明確化する必要がある。

候補は以下。

- A: 1交換につき1レコード
- B: 1交換につき双方分の2レコード

MVPでは一覧取得とお気に入り管理の単純さから、**B案（2レコード）を推奨**する。

## 9.3 avatar_style の拡張
将来的に以下のような値追加を想定できる。

- `minimal_flat`
- `retro_game`
- `illustration_soft`

---

# 10. ファイル配置

この設計書は以下に配置する。

```txt
docs/database/schema.md
```

実行用の Prisma スキーマは以下に配置する。

```txt
prisma/schema.prisma
```

Supabase のマイグレーションやSQLを管理する場合は以下を利用する。

```txt
supabase/
└─ migrations/
```

---

# 11. 元スキーマからの主な変更点

アップロードされた元の Prisma スキーマでは、`User` モデルに `passwordHash` が含まれていた。 fileciteturn1file0

Supabase Auth 前提へ修正した結果、主な変更点は以下の通り。

- `users.password_hash` を廃止
- 認証情報は Supabase Auth に集約
- `users.id` は `auth.users.id` と同一UUIDを使用する前提に変更
- `public.users` はアプリ固有情報のみを保持する役割へ変更

---

# 12. 最終決定

Persona MVP のDB設計は、以下の4テーブルを中心に構成する。

- `users`
- `profiles`
- `sns_links`
- `connections`

また、補助的な enum として以下を採用する。

- `AvatarType`
- `AvatarStyle`
- `SnsType`

認証基盤は **Supabase Auth** を採用し、認証情報は `auth.users` に集約する。アプリ側の `users` テーブルは、認証後に必要な業務データのみを保持する。

この構成により、MVP段階で必要な

- ユーザー登録
- ログイン
- プロフィール管理
- SNS公開
- QR交換
- お気に入り管理

を、Supabase の責務分離に沿って無理なく実装できる。

