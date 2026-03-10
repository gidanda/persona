# Persona 初回実装スコープ

作成日: 2026-03-10

## 目的

初回実装で着手する画面と、それぞれの責務を `src/app` 構成に対応づけて固定する。

## 対象ルート

```txt
src/app/
├─ page.tsx
├─ login/page.tsx
├─ signup/page.tsx
├─ profile/page.tsx
├─ profile/edit/page.tsx
├─ scan/page.tsx
├─ exchange/[token]/page.tsx
└─ contacts/page.tsx
```

## 画面責務

### `/`

- 認証済みユーザーの起点ページ
- 自分のプロフィールへの導線を持つ
- QR 表示、QR 読み取り、交換済み一覧への導線を持つ
- 未認証時は `/login` へ誘導する

### `/login`

- メールアドレスログインを扱う
- 認証成功後にプロフィール完成状態を見て遷移先を分ける
- `profileCompleted = false` の場合は `/profile/edit` へ誘導する
- `profileCompleted = true` の場合は `/` へ誘導する

### `/signup`

- 新規登録を扱う
- Supabase Auth で認証ユーザーを作成する
- 併せて `users` テーブルにアプリ固有データを作成する
- 登録完了後は `/profile/edit` へ遷移する

### `/profile`

- 自分の公開プロフィール表示画面
- `users`, `profiles`, `sns_links` の内容を統合して表示する
- 編集導線と QR 表示導線を持つ

### `/profile/edit`

- 初回プロフィール作成と通常編集の両方を担う
- `bio`, `avatar`, `snsLinks` を編集対象とする
- 保存時に `profileCompleted` を更新する

### `/scan`

- QR 読み取り画面
- 読み取った結果から相手ユーザーを特定する
- 交換成立時に `connections` を相互 2 レコードで作成する
- 成功後は `/exchange/[token]` へ遷移する

### `/exchange/[token]`

- 交換相手のプロフィール表示画面
- URL の `token` は相手識別子として扱う
- 閲覧時は相手の公開プロフィールを表示する
- 交換済みであることを前提に表示する

### `/contacts`

- 交換済み一覧画面
- 現時点では `People` 相当の MVP 画面として扱う
- 一覧にはプロフィールの最小情報とお気に入り状態を表示する
- 将来的な `Following` 分離は後続対応とする

## Feature責務

### `src/features/auth`

- ログイン
- サインアップ
- セッション確認
- 認証状態に応じた遷移制御

### `src/features/profile`

- プロフィール取得
- プロフィール保存
- SNSリンクの整形と保存
- `profileCompleted` 更新

### `src/features/qr`

- QR 表示用データの生成
- QR 読み取り結果の解釈
- 交換対象ユーザーの特定

### `src/features/exchange`

- `connections` 作成
- 重複交換防止
- 交換相手プロフィールの取得

### `src/features/contacts`

- 交換済み一覧取得
- お気に入り状態更新

## 共通責務

### `src/lib`

- Prisma クライアント
- Supabase クライアント
- 認証セッション取得
- DB アクセス共通化

### `src/components`

- アプリ全体で使う UI
- レイアウト
- 共通の状態表示

## 初回実装の順序

1. `lib` に Supabase / Prisma の接続基盤を置く
2. `features/auth` を作る
3. `profile/edit` と `profile` を作る
4. `/` の導線を作る
5. `scan`, `exchange/[token]`, `contacts` を実装する
