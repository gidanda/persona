# Persona Relationship Layer ワイヤーフレーム

作成日: 2026-03-17

参照元:

- [`overview.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/overview.md)
- [`requirements.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/requirements.md)
- [`specification.md`](/Users/goudayuuki/dev/persona/docs/features/relationship-layer/specification.md)

## 1. 方針

Relationship Layer のワイヤーフレームは、既存の `People / Scan / Me` 導線を壊さず、`Shared` を 1 つ追加する前提で整理する。

重要なのは次の 3 点である。

- プロフィールから反応できること
- Shared が相手ごとの関係一覧として見えること
- Thread が汎用チャットではなく Topic 詳細の一部として存在すること

## 2. Bottom Navigation

```text
+--------------------------------------------------+
| People           Scan           Shared       Me  |
+--------------------------------------------------+
```

## 3. 他者プロフィール画面

### 3.1 Profile 表示 + Reaction

```text
+--------------------------------------------------+
| < Back                               View Shared |
+--------------------------------------------------+
| [Avatar]  Ken Sato                                 |
| @ken                                               |
| Indie music / architecture / coffee                |
|                                                    |
| Links                                              |
| X   Instagram   GitHub                             |
|                                                    |
| Taste                                              |
| [Song] Radiohead                     [共感] [興味] |
| [Movie] Past Lives                   [共感] [興味] |
| [Book] The Left Hand of Darkness     [共感] [興味] |
|                                                    |
| Thinking                                           |
| "都市と音の関係が気になっている"       [共感] [興味] |
|                                                    |
| Doing                                              |
| "建築写真を撮っている"                 [共感] [興味] |
+--------------------------------------------------+
| People           Scan           Shared       Me  |
+--------------------------------------------------+
```

### 3.2 Profile / Shared タブ案

```text
+--------------------------------------------------+
| < Back                                            |
+--------------------------------------------------+
| [Avatar]  Ken Sato                                 |
|                                                    |
| Profile | Shared                                   |
| --------+-------                                   |
|                                                    |
| Shared Topics with Ken                             |
| - Radiohead                  共感で追加   会話なし |
| - Past Lives                 興味あり     会話あり |
| - 建築                       共感で追加   会話なし |
+--------------------------------------------------+
```

## 4. Shared 一覧画面

### 4.1 相手一覧

```text
+--------------------------------------------------+
| Shared                                            |
+--------------------------------------------------+
| Search people or topics                           |
+--------------------------------------------------+
| [Avatar] Ken Sato                                 |
| 3 topics                                 2d ago   |
| Radiohead / Past Lives / 建築                     |
+--------------------------------------------------+
| [Avatar] Mika Tanaka                              |
| 1 topic                                  5d ago   |
| 渋谷のカフェ                                      |
+--------------------------------------------------+
| [Avatar] Jun Park                                 |
| 4 topics                                 8d ago   |
| A24 / ambient / books                             |
+--------------------------------------------------+
| People           Scan           Shared       Me  |
+--------------------------------------------------+
```

## 5. 相手別 Shared Topic 一覧画面

### 5.1 Shared Topics with User

```text
+--------------------------------------------------+
| < Shared                                          |
+--------------------------------------------------+
| [Avatar] Ken Sato                                 |
| Shared Topics                                     |
+--------------------------------------------------+
| Radiohead                                         |
| Song  | 共感で追加 | 会話なし            2d ago   |
+--------------------------------------------------+
| Past Lives                                        |
| Movie | 興味あり | 会話あり              3d ago   |
+--------------------------------------------------+
| 建築                                              |
| Theme | 共感で追加 | 会話なし            1w ago   |
+--------------------------------------------------+
| People           Scan           Shared       Me  |
+--------------------------------------------------+
```

## 6. Shared Topic 詳細画面

### 6.1 Thread 未開始状態

```text
+--------------------------------------------------+
| < Shared Topics                                   |
+--------------------------------------------------+
| Radiohead                                         |
| Song                                              |
| 共感で追加 / profile_music                        |
+--------------------------------------------------+
| まだ会話は始まっていません。                      |
| この話題について最初の一言を送ると                |
| Thread が開始されます。                           |
|                                                    |
| [ この曲のどの時期が好き？               ] [送信] |
+--------------------------------------------------+
```

### 6.2 Thread 開始後

```text
+--------------------------------------------------+
| < Shared Topics                                   |
+--------------------------------------------------+
| Radiohead                                         |
| Song                                              |
| 共感で追加 / profile_music                        |
+--------------------------------------------------+
| Ken: In Rainbows が特に好き                       |
| You: わかる、音の抜け感がいい                     |
| Ken: Kid A も捨てがたい                           |
|                                                    |
+--------------------------------------------------+
| [ メッセージを入力                         ] [送信] |
+--------------------------------------------------+
```

## 7. 画面遷移

```text
People
  ↓
他者プロフィール
  ├─ Reaction 実行
  │    ↓
  │  Shared Topic 生成
  │    ↓
  └─ View Shared / Shared タブ
       ↓
相手別 Shared Topic 一覧
       ↓
Shared Topic 詳細
       ↓
最初のメッセージ送信で Thread 開始
```

## 8. UI メモ

- Reaction ボタンは項目右端の軽量アクションとして扱う
- Shared 一覧は SNS 風のフィードではなく、相手ごとのまとまりを重視する
- Topic 詳細では、話題情報と会話を 1 画面で完結させる
- Thread 未開始状態を明確に見せ、空チャットではなく「必要なら始める」体験にする
