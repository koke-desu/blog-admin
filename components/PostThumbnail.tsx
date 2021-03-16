// 記事一覧やタグ・カテゴリーの絞り込みを行った際に表示される、リストの一覧上での、それぞれの記事の表示。
// サムネ画像、タイトル、タグ、カテゴリーを表示する。
import { Post } from "../firebase/firebase";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const url = "http://localhost3000/api/image/";

export default function PostThumbnail({ post }: { post: Post }) {
  // サムネイルの画像のpathを保持するstate。
  // サムネイルが設定されていない場合、public/images/no_image.pngを表示。
  const [img_url, set_img_url] = useState("/images/no_image.png");
  // api/image/[path]より画像を受け取る。
  fetch(url + post.id + "/thumbnail").then((res) => {
    res.json().then((json) => {
      if (json.url != "image not found") {
        set_img_url(json.url);
      }
    });
  });

  return (
    <Link href={"/posts/" + post.id}>
      <div className="w-full sm:w-6/12 my-5 mx-0 px-5">
        <div className="relative box-border text-white border-2 border-gray-400 shadow-md bg-main2">
          <Image src={img_url} width={480} height={270} />
          <Link href="/">
            <p className="absolute top-1 left-2 py-0.5 px-2 rounded-full bg-accent cursor-pointer text-sm text-black">
              {post.category}
            </p>
          </Link>
          <p className="p-1 text-xl">{"　" + post.title}</p>
          <div className="flex justify-between p-1">
            <div className="flex h-5">
              <Image src="/images/tag_icon.png" width={20} height={12} />
              {post.tag.map((tag, index) => {
                return (
                  <Link href="/" key={tag}>
                    <p className="px-1 ml-1 cursor-pointer">
                      {" "}
                      {index > 0 ? ", " + tag : tag}
                    </p>
                  </Link>
                );
              })}
            </div>
            {(() => {
              const update = new Date(post.updateTime);
              const create = new Date(post.createTime);
              if (update.toString() != create.toString()) {
                return (
                  <div className="flex text-right pr-1">
                    <Image
                      src="/images/update_icon.png"
                      width={20}
                      height={12}
                    />
                    <p>
                      {update.getFullYear() +
                        "/" +
                        (update.getMonth() + 1) +
                        "/" +
                        update.getDate()}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="flex justify-end pr-1">
                    <Image
                      src="/images/create_icon.png"
                      width={25}
                      height={15}
                    />
                    <p>
                      {update.getFullYear() +
                        "/" +
                        (update.getMonth() + 1) +
                        "/" +
                        update.getDate()}
                    </p>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    </Link>
  );
}
