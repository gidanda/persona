# Persona Relationship Layer 整合性維持ガイド

作成日: 2026-03-17

参照元:

- [`overview.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/overview.md)
- [`requirements.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/requirements.md)
- [`specification.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/specification.md)

## 1. 目的

本書は、既存 MVP と Relationship Layer を同一プロダクト内で共存させるための運用ルールを定義する。

目的は次の 2 点である。

- 追加機能によって既存の交換・プロフィール機能を壊さないこと
- 実装時に既存責務と拡張責務を混線させないこと

## 2. 基本原則

### 2.1 既存 MVP は土台として維持する

既存の `People / Scan / Me` は、以下の責務に限定して維持する。

- プロフィールを作る
- QR で交換する
- 交換済み相手を見返す

Relationship Layer はこの土台の上に追加する機能であり、既存導線の意味を置き換えない。

### 2.2 Relationship Layer は独立レイヤーとして実装する

追加機能は、既存機能に直接意味変更を加えるのではなく、独立したレイヤーとして接続する。

具体的には、次を守る。

- 既存プロフィールは閲覧対象のまま維持する
- Shared は新しい関係画面として分離する
- Thread は Shared Topic の一部としてのみ存在させる
- 汎用 DM にはしない

### 2.3 接続点は少なく保つ

既存領域と追加領域の接続点は最小限に保つ。

現時点の主要接続点は以下。

- 他者プロフィール画面で Reaction できること
- Bottom Navigation から Shared へ遷移できること
- Shared から Topic 詳細と Thread に入れること

## 3. 責務分離

### 3.1 既存領域の責務

- `People`: 交換済み相手一覧とプロフィール閲覧
- `Scan`: QR 交換
- `Me`: 自分のプロフィール編集と表示
- `connections`: 交換済み関係の管理
- `profiles`: 公開プロフィール本体の管理

### 3.2 追加領域の責務

- `Shared`: 共有話題の一覧
- `Shared Topic`: 2 人の間の話題単位
- `Thread`: Topic に紐づく会話
- `relationships`: 関係レイヤーの親単位
- `shared_topics`: Shared Topic の管理
- `thread_messages`: Topic 会話の管理

### 3.3 してはいけないこと

- `connections` に Shared や Thread の意味を持たせること
- `People` を Shared 一覧と同義にすること
- `Me` に Relationship Layer の中心責務を持たせること
- Thread を常設チャットに拡張すること

## 4. データ設計ルール

### 4.1 既存テーブルの意味を変えない

既存テーブルは基本的に役割を維持する。

- `users`: アプリユーザー
- `profiles`: 公開プロフィール
- `connections`: 交換済み関係

追加機能が必要とする情報は、新規テーブルで分離して保持する。

### 4.2 新しい概念は新しいテーブルに置く

Relationship Layer の概念は以下に分離する。

- `relationships`
- `shared_topics`
- `thread_messages`

これにより、既存の交換導線が Relationship Layer の状態に依存しないようにする。

### 4.3 プロフィール拡張項目は慎重に昇格する

`thinking`, `doing`, `interests` のようなプロフィール拡張項目は、Reaction 対象として有効だが、既存 MVP の必須項目に即座に昇格させない。

方針:

- まずは任意項目として扱う
- 既存プロフィールが空でも既存機能は成立させる
- 追加機能は空状態でも破綻しない設計にする

## 5. UI 統合ルール

### 5.1 既存画面に追加するのは導線だけ

既存画面に追加するものは、原則として以下に留める。

- Reaction ボタン
- View Shared 導線
- Shared へのタブや遷移ボタン

既存画面そのものを Shared 中心に再設計しない。

### 5.2 Shared は独立画面として扱う

Shared は独立したナビゲーション項目として維持する。

- People は人の一覧
- Shared は話題の一覧

この視点の違いを崩さない。

### 5.3 Thread は Topic 詳細の中に閉じる

Thread は単独チャット画面として増殖させず、必ず Shared Topic 詳細の中に閉じる。

## 6. 実装順序ルール

追加機能は次の順で入れる。

1. データモデル追加
2. Shared 一覧
3. 他者プロフィールからの Reaction
4. Topic 詳細
5. Thread 開始

この順序を守ることで、どこで衝突したか切り分けやすくする。

## 7. 文書運用ルール

### 7.1 Relationship Layer の正本

追加機能の正本は以下とする。

- [`overview.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/overview.md)
- [`requirements.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/requirements.md)
- [`specification.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/specification.md)
- [`wireframes.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/wireframes.md)

### 7.2 既存文書との関係

既存の `docs/design` は、旧 MVP の全体設計文書として扱う。

差分吸収の原則:

- まず `docs/features/relationship-layer/` を更新する
- 全体仕様に昇格させる内容だけ後から既存文書へ反映する
- 先に既存文書を全面改訂しない

## 8. 回帰確認ルール

Relationship Layer の実装や変更後は、少なくとも以下を確認する。

- ログインできる
- プロフィール編集できる
- QR 交換できる
- People 一覧が見られる
- 他者プロフィールが見られる
- Shared が空でもページ遷移が壊れない
- Reaction で Shared Topic が作成される
- Topic 詳細から Thread を開始できる

## 9. 判断基準

実装判断に迷った場合は、以下の問いで判断する。

1. その変更は既存の `People / Scan / Me` の責務を壊していないか
2. その変更は Shared を独立レイヤーとして保てているか
3. その変更は Thread を汎用チャット化していないか
4. その変更は既存 DB 構造の意味を変えていないか
5. その変更は空状態でも破綻しないか

1 つでも `No` が出る場合は、設計を見直す。
