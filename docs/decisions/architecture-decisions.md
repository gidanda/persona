# Persona アーキテクチャ / MVP実装判断

作成日: 2026-03-10

## 目的

実装開始前に、既存ドキュメント間で揺れている仕様を「初回実装の基準」として固定する。

## 決定事項

### 1. 認証は Supabase Auth を正とする

- 認証情報は `auth.users` で管理する
- アプリ独自テーブルに `password_hash` は持たない
- 初回実装では `メールアドレスログイン` を優先する
- `Googleログイン` は Supabase Auth 前提で後続対応可能な形にする

### 2. 初回実装のプロフィール項目は最小構成に絞る

初回実装で扱う項目:

- userId
- displayName
- realName
- verificationValue
- bio
- avatarType
- avatarStyle
- avatarSeed
- avatarImageUrl
- snsLinks

初回実装では見送る項目:

- taste
- thinking
- doing
- free block
- visibility

理由:

- 既存の DB 設計と Prisma schema が最小構成で揃っている
- 交換体験の成立に必須ではない
- 先に認証、プロフィール作成、QR交換、交換済み一覧を成立させるべき

### 3. MVPの交換機能は `connections` で表現する

- QR 読み取り時点で交換成立とする
- `connections` は片方向 1 レコードで保存する
- 実際の交換成立時は `A -> B` と `B -> A` の 2 レコードを作る
- 重複交換は複合一意制約で防ぐ

### 4. 初回実装では公開範囲設定を持たない

- 全ユーザーで同一の公開プロフィール構成を使う
- 交換済み相手に表示する内容も同一とする
- 公開範囲制御は将来拡張とする

### 5. People画面の `Following` は初回実装から外す

- 初回実装では `contacts` を交換済み一覧として扱う
- `isFavorite` を使ったお気に入り導線は残せる
- 独立した `follows` テーブルは後続で追加する

## 初回実装に含める画面

- ログイン
- 新規登録
- 初回プロフィール作成
- 自分のプロフィール表示
- 自分のプロフィール編集
- QR 表示
- QR 読み取り
- 交換済み一覧
- 相手プロフィール表示

## 初回実装に含めないもの

- Taste
- Thinking / Doing
- 自由記入欄
- 公開範囲設定
- Follow テーブル
- メッセージ
- タイムライン的機能

## 次の実装順

1. Prisma schema をこの方針の基準として扱う
2. 認証導線を Supabase Auth 前提で実装する
3. プロフィール作成 / 編集を実装する
4. QR交換と contacts 一覧を実装する
