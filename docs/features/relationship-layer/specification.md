# Persona Relationship Layer 仕様書

作成日: 2026-03-17

参照元:

- [`overview.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/overview.md)
- [`requirements.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/requirements.md)

## 1. 対象範囲

本書は、Relationship Layer MVP の画面仕様、状態仕様、データ仕様、振る舞い仕様を定義する。

## 2. 用語定義

### 2.1 Relationship

2 人のユーザー間に存在する関係単位。Shared Topic は必ず 1 つの Relationship に属する。

### 2.2 Shared Topic

2 人の間で共有された単一の話題または対象。プロフィール項目への反応や推薦を起点として生成される。

### 2.3 Thread

Shared Topic に紐づくテキスト会話。最初のメッセージ送信時に開始される。

### 2.4 Origin

Shared Topic が生まれた理由。

値例:

- `empathy`
- `interest`
- `recommendation`
- `reaction_to_recent`

### 2.5 Source Context

どのコンテキストから Shared Topic が生まれたかを表す。

値例:

- `profile_music`
- `profile_movie`
- `profile_book`
- `recent`
- `direct_share`

## 3. 画面仕様

### 3.1 Bottom Navigation

MVP のボトムナビゲーションは次の 4 つで構成する。

```text
People | Scan | Shared | Me
```

### 3.2 他者プロフィール画面

目的:

- 相手のプロフィールを閲覧する
- プロフィール項目に対して Reaction する
- 相手との Shared へ遷移する

表示要素:

- 基本プロフィール情報
- 興味対象カードまたはリスト
- 各項目に対する Reaction ボタン
- `View Shared` 導線、または `Profile | Shared` タブ

制約:

- 自分自身には Reaction 不可
- 交換済み相手のみ対象

### 3.3 Shared 一覧画面

目的:

- Shared Topic が存在する相手一覧を表示する

表示要素:

- 相手のアバター
- 表示名
- Shared Topic 件数
- 最終更新日時
- 未読相当の概念を後から足せる余地

並び順:

- 最終更新日時の降順

### 3.4 相手別 Shared Topic 一覧画面

目的:

- 特定の相手との Shared Topic を一覧表示する

表示要素:

- 相手の基本情報
- Shared Topic 一覧
- Topic ごとの対象名
- origin ラベル
- 会話あり / なし
- 最終更新日時

並び順:

- 最終更新日時の降順

### 3.5 Shared Topic 詳細画面

目的:

- 特定 Topic の詳細確認
- Thread 開始または継続

表示要素:

- Topic 名
- 発生理由
- 発生元コンテキスト
- 会話状態
- メッセージ一覧
- 入力欄
- 送信ボタン

状態分岐:

- Thread 未開始: 空状態と最初のメッセージ入力欄を表示
- Thread 開始済み: メッセージ一覧と入力欄を表示

## 4. Reaction 仕様

### 4.1 対象

Reaction 対象は以下を想定する。

- 音楽
- 映画
- 本
- 場所
- 興味テーマ
- Recent 項目

### 4.2 MVP の Reaction 種別

MVP では次の固定値で開始する。

- `empathy`
- `interest`

必要に応じて `recommendation` を Shared 作成時の別導線として扱う。

### 4.3 実行時挙動

1. ユーザーがプロフィール項目に Reaction する
2. システムは対象の正規化キーを作る
3. 同一 Relationship 内に同一対象の Shared Topic が存在するか判定する
4. 存在すれば更新、なければ新規作成する
5. Topic の `last_activity_at` を更新する

### 4.4 同一 Topic 判定

MVP では、以下の組み合わせを同一 Topic 判定キーとする。

- Relationship
- source_context
- 対象の正規化済み識別子

厳密な外部コンテンツ ID がない場合は、タイトル等の内部正規化文字列を暫定キーとして扱う。

## 5. Shared Topic 仕様

### 5.1 必須属性

- `relationship_id`
- `topic_type`
- `topic_label`
- `normalized_key`
- `origin`
- `source_context`
- `state`
- `created_by_user_id`
- `last_activity_at`
- `created_at`
- `updated_at`

### 5.2 状態

- `passive_shared`: Shared は存在するが Thread 未開始
- `active_thread`: Thread が開始済み
- `archived`: 長期間更新なし

### 5.3 生成条件

次のいずれかで生成または統合される。

- プロフィール項目への Reaction
- Recent への Reaction
- Recommendation

### 5.4 更新条件

以下で `last_activity_at` を更新する。

- 新規 Reaction
- Recommendation
- Thread メッセージ送信

## 6. Thread 仕様

### 6.1 開始条件

Shared Topic 作成時点では Thread を開始しない。

次の条件で Thread を開始する。

- いずれかの参加者が最初のテキストメッセージを送信したとき

### 6.2 メッセージ属性

- `shared_topic_id`
- `sender_user_id`
- `body`
- `created_at`
- `updated_at`

### 6.3 送信時挙動

1. Shared Topic 詳細画面でメッセージ送信
2. まだ Thread 未開始なら、最初のメッセージ保存時に Topic 状態を `active_thread` に更新
3. メッセージ追加後に `last_activity_at` を更新

### 6.4 非対象

MVP では以下を扱わない。

- 画像送信
- スタンプ
- 既読
- 返信ツリー
- グループ会話

## 7. データモデル案

MVP 実装用の概念モデルは以下を想定する。

```text
users
connections
relationships
shared_topics
shared_topic_events
thread_messages
```

### 7.1 relationships

役割:

- 2 人のユーザー間の会話・共有話題の親単位

主な属性:

- `id`
- `user_a_id`
- `user_b_id`
- `created_at`
- `updated_at`

制約:

- 同一 2 人の組み合わせは 1 件

### 7.2 shared_topics

役割:

- Relationship 配下の話題

主な属性:

- `id`
- `relationship_id`
- `topic_type`
- `topic_label`
- `normalized_key`
- `origin`
- `source_context`
- `state`
- `created_by_user_id`
- `last_activity_at`
- `created_at`
- `updated_at`

制約:

- `(relationship_id, source_context, normalized_key)` を一意候補とする

### 7.3 shared_topic_events

役割:

- 同じ Topic に対して複数回行われた反応や推薦の履歴

主な属性:

- `id`
- `shared_topic_id`
- `actor_user_id`
- `event_type`
- `payload`
- `created_at`

### 7.4 thread_messages

役割:

- Topic に紐づくメッセージ

主な属性:

- `id`
- `shared_topic_id`
- `sender_user_id`
- `body`
- `created_at`
- `updated_at`

## 8. 権限仕様

- Shared 関連機能は交換済みの 2 人だけがアクセスできる
- Shared Topic と Thread は関係当事者以外に公開しない
- 自分自身との Relationship は作成しない

## 9. エラーハンドリング

- 非交換相手への Reaction は拒否する
- 無効な Topic への Thread 投稿は拒否する
- 削除済みまたは非公開化されたプロフィール項目由来の Topic は、既存 Shared としては残してよいが元参照は欠損扱いにする

## 10. 実装優先順位

1. 他者プロフィールからの Reaction
2. Relationship と Shared Topic の生成
3. Shared 一覧と相手別 Topic 一覧
4. Shared Topic 詳細
5. Thread 開始と送信
