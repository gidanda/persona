# Persona コンテンツ連携プロフィール項目設計

作成日: 2026-03-17

参照元:

- [`overview.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/overview.md)
- [`requirements.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/requirements.md)
- [`specification.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/specification.md)
- [`integration-guidelines.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/integration-guidelines.md)

## 1. 目的

本書は、プロフィール上の `Interests` を単なる自由文字列ではなく、検索選択型のコンテンツ項目として扱うための設計方針を定義する。

狙いは次の通り。

- 視覚的に何の作品か分かるプロフィールにする
- ユーザーがリンク貼り付けをしなくてよい入力体験にする
- Shared Topic を曖昧な文字列ではなく作品単位で扱えるようにする

## 2. 基本方針

### 2.1 入力は検索選択型にする

ユーザーは曲名、映画名、本のタイトルなどで検索し、候補から選択する。

ユーザーに URL の貼り付けは要求しない。

### 2.2 表示は作品カードとする

プロフィール上では、選択した項目を作品カードとして表示する。

例:

- 音楽: ジャケット、曲名、アーティスト名、必要ならアルバム名
- 映画: ポスター、タイトル、公開年
- 本: 表紙、タイトル、著者名

### 2.3 タップ時は外部遷移とする

MVP ではアプリ内再生やアプリ内視聴は行わない。

カードをタップした場合は、外部サービスの該当ページやアプリに遷移する。

### 2.4 provider は UI に出さない

`Spotify`、`Apple Music` などの provider 情報は内部では保持してよいが、プロフィール UI には表示しない。

見せるのは作品情報そのものとする。

## 3. ユーザー体験

### 3.1 登録フロー

```text
カテゴリを選ぶ
↓
検索する
↓
候補一覧から選ぶ
↓
作品カードとしてプロフィールに反映される
```

### 3.2 表示フロー

```text
プロフィールを見る
↓
作品カードが見える
↓
何の作品か一目で分かる
↓
必要ならタップして外部遷移する
```

## 4. 表示要件

### 4.1 音楽

表示候補:

- ジャケット画像
- 曲名
- アーティスト名
- 必要ならアルバム名

非表示:

- provider 名
- 生URL

### 4.2 映画

表示候補:

- ポスター
- タイトル
- 公開年

### 4.3 本

表示候補:

- 表紙
- タイトル
- 著者名

### 4.4 共通

- 何の作品か視覚的に把握できること
- タップ可能であること
- URL を露出しないこと

## 5. データ設計方針

プロフィール項目は、単なる `label` ではなく、以下のような構造で保持する。

### 5.1 最低限必要な属性

- `content_type`
- `title`
- `subtitle`
- `image_url`
- `deeplink_url`
- `provider`
- `external_id`

### 5.2 用途

- `title`: 曲名、映画名、書名
- `subtitle`: アーティスト名、著者名、補足情報
- `image_url`: ジャケット、ポスター、表紙
- `deeplink_url`: タップ時の遷移先
- `provider`: 内部管理用
- `external_id`: 同一作品判定用

### 5.3 UI と内部データの分離

UI で出すもの:

- `title`
- `subtitle`
- `image_url`

内部で使うもの:

- `provider`
- `external_id`
- `deeplink_url`

## 6. Relationship Layer との接続

### 6.1 Shared Topic の安定化

作品が `external_id` ベースで管理されれば、同じ作品に対する Reaction を安定して統合しやすくなる。

例:

- 同じ曲を別表記で登録しても同一 Topic として扱える
- Shared Topic の統合精度が上がる

### 6.2 Reaction 対象としての価値

作品カード化された項目は、Reaction しやすく、何に反応したのかも明確になる。

例:

- 文字列 `Radiohead` に反応するより、ジャケット付きの楽曲カードに反応する方が直感的

## 7. 実装段階

### 7.1 第1段階

- 既存の自由入力 `interests` を維持
- 将来置き換える前提で設計を分離しておく

### 7.2 第2段階

- 検索 API を接続
- 候補選択 UI を追加
- `title / subtitle / image_url / deeplink_url` を保存する

### 7.3 第3段階

- プロフィール表示を作品カードへ移行
- Shared Topic を `external_id` ベースで扱う

## 8. MVP判断

この機能で MVP として満たすべき条件は以下。

- ユーザーがリンクを貼らずに作品を登録できる
- プロフィール上で何の作品か一目で分かる
- タップで外部遷移できる
- provider 名を UI に出さず自然なプロフィール表示になる
- Shared Topic の将来拡張に使える構造になっている

## 9. 判断基準

設計判断に迷った場合は次を優先する。

1. 視覚的に作品が分かるか
2. ユーザーに URL 入力を要求していないか
3. provider 名が UI の主役になっていないか
4. Shared Topic を作品単位で扱える構造になっているか
5. MVP として外部遷移で成立しているか
