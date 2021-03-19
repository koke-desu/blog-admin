import Head from "next/head";
import Image from "next/image";
import Layout from "../../components/Layout";
// githubのmdと同様なcss
import "github-markdown-css";
// markdownの表示のカスタマイズ。
//import style from "../../components/css/markdown_style.module.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown/with-html";
import gfm from "remark-gfm";
import useSwr from "swr";
import {
  postImage,
  getPostImages,
  editPost,
} from "../../firebase/cliantSideFunction";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  getAllPosts,
  getCategories,
  getTags,
  getPost,
} from "../../firebase/dbFunctions";
import { Category, Post, Tags } from "../../firebase/firebase";
import { useRouter } from "next/router";

// bodyの整形。以下の処理を順に行う。
// ・改行の挿入
// ・画像の挿入。 画像は<image ファイル名 width={幅} height={高さ} className=""/>と入力。それぞれの間に半角スペース必須。width, height, classNameは順不同。
//   classNameでstyling出来るが必要ない場合は書かなくてもいい。
//   この関数によって、ファイル名の部分にsrcを挿入する。 例) <image image.jps width={100} height={100} className="p-1" />
function formatMD(body: string, imglinks: { name: string; url: string }[]) {
  if (typeof body != "string") return "body is not string";
  let res = body;

  let from_index = 0;
  while (true) {
    const start = res.indexOf("<image", from_index);
    const end = res.indexOf("/>", from_index);
    if (start == -1 || end == -1) break;
    const slice = res.slice(start, end).split(" ");
    let src = "/images/no_image.png";
    imglinks.forEach((link) => {
      if (link.name == slice[1]) src = link.url;
    });
    let Image = `<img src="${src}" ${slice[2]} ${slice[3]} ${
      slice[4] ? slice[4] : ""
    }/>`;
    res = res.slice(0, start) + Image + res.slice(end + 2);
    from_index = start + Image.length;
  }

  return res;
}

//
export default function Home(props) {
  const post: Post = JSON.parse(props.post);
  const categories: Category[] = JSON.parse(props.categories);
  const tags: Tags[] = JSON.parse(props.tags);

  const [title, setTitle] = useState<string>(post.title);
  const [body, setBody] = useState<string>(post.body);
  const [postTags, setPostTags] = useState<string[]>(post.tag);
  const [postCategory, setPostCategory] = useState<string>(post.category);
  const [imglinks, setImglinks] = useState<{ name: string; url: string }[]>([]);
  const [postPublic, setPostPublic] = useState<boolean>(post.public);

  const router = useRouter();

  useEffect(() => {
    getPostImages(post.id as string).then((res) => {
      setImglinks(res);
    });
  }, []);

  // 画像のアップロードを行い、imglinksに画像へのリンクを追加する。
  function uploadHandle(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const file: File = event.target.files[0];
    postImage(`${post.id}/${file.name}`, file).then((url) => {
      const links = imglinks.slice();
      links.push({ name: file.name, url });
      setImglinks(links);
    });
  }

  // 記事を更新する。
  function saveHandle(event) {
    event.preventDefault();
    if (!window.confirm("記事を更新しますか？")) return false;
    editPost("PUT", post.id, {
      ...post,
      title,
      body: formatMD(body, imglinks),
      category: postCategory,
      tag: postTags,
    });
  }

  // 記事を削除する。
  function deleteHandle(event) {
    event.preventDefault();
    if (!window.confirm("記事を削除しますか？")) return false;
    editPost("DELETE", post.id).then(() => {
      router.push("/");
    });
  }

  // 記事の公開非公開を設定。
  function publishHandle(event) {
    event.preventDefault();
    if (!window.confirm(`記事を${postPublic ? "非公開に" : "公開"}しますか？`))
      return false;
    editPost(postPublic ? "HIDE" : "PUBLISH", post.id);
    setPostPublic(!postPublic);
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex p-5 bg-gray-200">
          <div className="w-1/2 p-5">
            <div className="flex">
              <div className="">
                <button className="w-32 h-16 bg-main1" onClick={saveHandle}>
                  SAVE
                </button>
              </div>
              <div className="">
                <button
                  className={`w-32 h-16 ${
                    postPublic ? "bg-gray-400" : "bg-red-500"
                  }`}
                  onClick={publishHandle}
                >
                  {postPublic ? "非公開にする" : "公開する"}
                </button>
              </div>
              <div className="">
                <button className="w-32 h-16 bg-red-600" onClick={deleteHandle}>
                  記事を削除
                </button>
              </div>
            </div>
            <div className="flex m-5">
              {imglinks.map((link, index) => {
                return (
                  <div key={`image_${index}`}>
                    <Image
                      src={link.url}
                      height={30}
                      width={30}
                      key={`img-${index}-${link.name}`}
                    />
                    <p>{link.name}</p>
                  </div>
                );
              })}
            </div>
            <div>
              <label>
                画像をアップロード
                <input type="file" onChange={uploadHandle} />
              </label>
            </div>
            <div className="m-5">
              <label>
                カテゴリー選択
                <select
                  defaultValue={postCategory}
                  onChange={(e) => {
                    setPostCategory(e.target.value);
                  }}
                >
                  {categories.map((category) => {
                    return (
                      <option key={`category_${category.name}`}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
            <div className="m-5">
              <div className="flex m-3">
                {postTags.map((tag) => {
                  return (
                    <p
                      key={`tag_${tag}`}
                      onClick={() => {
                        const tmp = [];
                        postTags.forEach((tag_) => {
                          if (tag != tag_) tmp.push(tag_);
                        });
                        const set = new Set(tmp);
                        setPostTags(Array.from(set));
                      }}
                    >{`✕ ${tag}, `}</p>
                  );
                })}
              </div>
              <label className="">
                タグを追加
                <select
                  onChange={(e) => {
                    const tmp = postTags.slice();
                    tmp.push(e.target.value);
                    const set = new Set(tmp);
                    setPostTags(Array.from(set));
                  }}
                >
                  {tags.map((tag_list) => {
                    return tag_list.children.map((tag) => {
                      return (
                        <option value={tag.name} key={`select_${tag.name}`}>
                          {tag.name}
                        </option>
                      );
                    });
                  })}
                </select>
              </label>
            </div>
            <div>
              <label>
                タイトル
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.currentTarget.value);
                  }}
                  className="m-5"
                />
              </label>
            </div>
            <textarea
              cols={80}
              rows={100}
              onChange={(eve) => {
                setBody(eve.currentTarget.value);
              }}
              className="border-0 p-1"
              value={body}
            />
          </div>
          <div className="w-1/2">
            <div className={" markdown-body p-6 bg-white mt-5"}>
              <div>
                {/* <Image src={img_url} height={100} width={100} /> */}
                <h1>{title}</h1>
              </div>
              <div className="flex h-8">
                {/* <Image
                  src="/images/tag_icon.png"
                  width={25}
                  height={26}
                  className=""
                /> */}
                {/* {post.tag.map((tag, index) => {
                  return (
                    <Link href="/">
                      <p className="p-0.5 ml-1 cursor-pointer self-auto text-lg">
                        {index > 0 ? ", " + tag : tag}
                      </p>
                    </Link>
                  );
                })} */}
              </div>
              <ReactMarkdown plugins={[[gfm]]} allowDangerousHtml>
                {formatMD(body, imglinks)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

//
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  const paths = posts.map((post) => {
    return { params: { id: post.id } };
  });
  return {
    paths,
    fallback: false,
  };
};

//
export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      post: JSON.stringify(await getPost(params.id as string)),
      categories: JSON.stringify(await getCategories()),
      tags: JSON.stringify(await getTags()),
    },
  };
};
