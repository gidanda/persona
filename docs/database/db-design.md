# デジタルプロフィールアプリ DB設計（MVP）

## 1. 概要
本ドキュメントはデジタルプロフィールアプリMVPのデータベース構造を定義する。

API設計および画面仕様に基づき、最小構成で拡張性のあるスキーマを採用する。

認証基盤は Supabase Auth を前提とし、メールアドレス、パスワード、セッションなどの認証情報は `auth.users` を正として扱う。

MVPでは以下の4テーブル構成とする。

- users
- profiles
- connections
- sns_links

---

## 2. users

### 役割
アプリケーション固有のユーザー基本情報を管理する。

### カラム

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | `auth.users.id` と同一の内部ID |
| user_id | VARCHAR | 公開ユーザーID |
| display_name | VARCHAR | 表示名 |
| real_name | VARCHAR | 本名 |
| verification_value | VARCHAR | 認証用情報 |
| profile_completed | BOOLEAN | プロフィール作成済みフラグ |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 制約

- id は `auth.users.id` と 1:1 で対応する
- user_id UNIQUE

### 補足

- `password_hash` は保持しない
- メールアドレス、パスワード、セッションは Supabase Auth 側で管理する

---

## 3. profiles

### 役割
プロフィール詳細情報を管理する。

### カラム

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | プロフィールID |
| user_id | UUID | users.id |
| bio | TEXT | 自己紹介 |
| avatar_type | VARCHAR | generated / uploaded |
| avatar_style | VARCHAR | pixel-classic |
| avatar_seed | VARCHAR | 自動生成seed |
| avatar_image_url | TEXT | アップロード画像URL |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 関係

- users : profiles = 1 : 1

---

## 4. connections

### 役割
交換済みユーザー同士の関係を管理する。

### カラム

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | connectionID |
| user_id | UUID | users.id |
| partner_user_id | UUID | users.id |
| is_favorite | BOOLEAN | お気に入りフラグ |
| exchanged_at | TIMESTAMP | 交換日時 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 設計方針

connectionsは**片方向1レコード**とする。

AとBが交換した場合

A → B
B → A

の2レコードを作成する。

### 制約

UNIQUE(user_id, partner_user_id)

CHECK(user_id != partner_user_id)

---

## 5. sns_links

### 役割
プロフィールに紐づくSNSリンクを管理する。

### カラム

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | ID |
| profile_id | UUID | profiles.id |
| type | VARCHAR | SNS種別 |
| url | TEXT | URL |
| sort_order | INT | 表示順 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### type例

- x
- instagram
- linkedin
- other

---

## 6. ER構造

users
 └─ 1:1 ─ profiles
             └─ 1:N ─ sns_links

users
 └─ 1:N ─ connections ─ N:1 ─ users

---

## 7. SQL定義（参考）

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  real_name VARCHAR(100) NOT NULL,
  verification_value VARCHAR(255) NOT NULL,
  profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_type VARCHAR(20) NOT NULL DEFAULT 'generated',
  avatar_style VARCHAR(50) NOT NULL DEFAULT 'pixel-classic',
  avatar_seed VARCHAR(100) NOT NULL,
  avatar_image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sns_links (
  id UUID PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE connections (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  exchanged_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, partner_user_id),
  CHECK (user_id <> partner_user_id)
);
```

---

## 8. 将来拡張

将来的に以下のテーブルを追加できる。

- messages
- exchange_events
- blocks
- avatar_presets
- sessions

MVPでは実装しない。
