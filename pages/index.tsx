import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
// githubのmdと同様なcss
import "github-markdown-css";
// markdownの表示のカスタマイズ。
import style from "../components/css/markdown_style.module.css";
import { useState } from "react";
import ReactMarkdown from "react-markdown/with-html";
import gfm from "remark-gfm";
import useSwr from "swr";
import { postImage } from "../firebase/cliantSideFunction";

// bodyの整形。以下の処理を順に行う。
// ・改行の挿入
// ・画像の挿入。 画像は<img ファイル名 width={幅} height={高さ} className=""/>と入力。それぞれの間に半角スペース必須。width, height, classNameは順不同。
//   classNameでstyling出来るが必要ない場合は書かなくてもいい。
//   この関数によって、ファイル名の部分にsrcを挿入する。 例) <img image.jps width={100} height={100} className="p-1" />
function formatMD(body: string, imglinks: { name: string; url: string }[]) {
  if (typeof body != "string") return "body is not string";
  let res = body.replace(/\n/g, "\n<br>");

  let from_index = 0;
  while (true) {
    const start = res.indexOf("<img", from_index);
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

export default function Home() {
  const [title, setTitle] = useState("title");
  const [body, setBody] = useState<string>("本文\n a \n");
  const [imglinks, setImglinks] = useState<{ name: string; url: string }[]>([]);

  // 画像のアップロードを行い、imglinksに画像へのリンクを追加する。
  function uploadHandle(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const file: File = event.target.files[0];
    postImage(`test/${file.name}`, file).then((url) => {
      const links = imglinks.slice();
      links.push({ name: file.name, url });
      setImglinks(links);
    });
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
              {imglinks.map((link, index) => {
                return (
                  <div>
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
              <label>
                画像をアップロード
                <input type="file" onChange={uploadHandle} />
              </label>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
            <textarea
              cols={50}
              rows={100}
              onChange={(eve) => {
                setBody(eve.currentTarget.value);
              }}
              className="border-0 p-1"
              value={body}
            />
          </div>
          <div className="w-1/2">
            <div
              className={
                style.markdown_body + " markdown-body p-6 bg-white mt-5"
              }
            >
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
