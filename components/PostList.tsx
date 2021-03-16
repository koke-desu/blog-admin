// 記事一覧
// props.postsを変えればホームやタグ、カテゴリーの絞り込みでも使える。

import { Post } from "../firebase/firebase";
import PostThumbnail from "./PostThumbnail";

export default function PostList(props: { posts: Post[] }) {
  return (
    <div className="flex p-2 flex-wrap justify-start w-full">
      {props.posts.map((post) => {
        return <PostThumbnail post={post} key={post.id} />;
      })}
    </div>
  );
}
