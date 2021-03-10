// firebaseの型の定義などを行う。
import firebase from "firebase";

// ここから型の定義。
// Firebaseの方でフィールド追加したら、こちらも変更すべし。

// tag, categoryは現在stringの配列として管理している。名前以外の情報を管理するようになったら、
// firebaseの方で参照型か、オブジェクト型にする。

// 記事一覧のpathは　page/1　みたいに管理。
// それぞれの記事のpathは posts/[id] で管理。
export type Post = {
  id: string;
  title: string;
  body: string;
  category: string;
  tag: string[];
  createTime?: Date;
  updateTime?: Date;
};

// idはルーティングに使う。そのため英語で、"/"などの記号を使わないものにする。(日本語でルーティングしてあるとコレジャナイ感すごい)
// 例) categories/tips , categories/summary/page/2　のようにルーティング。
export type Category = {
  id: string;
  name: string;
};

// idはルーティング用. 例) tags/nextjs , tags/firebase/page/2
export type Tag = {
  id: string;
  name: string;
};

// 階層構造になったタグ。
// 例) {
//     id: "frame_work",
//     name: "フレームワーク",
//     children: [
//      {id: "next", name: "Next.js"},
//      {id: "react", name: "React.js"},
//     ]
//  }
export type Tags = {
  id: string;
  name: string;
  children: Tag[];
};
