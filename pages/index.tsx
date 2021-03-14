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
import { postImage } from "../firebase/apiFunctions";

export default function Home() {
  const [title, setTitle] = useState("title");
  const [body, setBody] = useState("本文\n a \n");
  const [imglinks, setImagelinks] = useState<string[]>([]);

  postImage("path", "--------body---------");

  function uploadHandle(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    const file: File = event.target.files[0];
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
                    <Image src={link} height={30} width={30} />
                    <p>{index}</p>
                  </div>
                );
              })}
              <label>
                <input type="file" onChange={uploadHandle} />
                画像をアップロード
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
              cols={70}
              rows={100}
              onChange={(eve) => {
                setBody(eve.currentTarget.value);
              }}
              className="border-0 p-1"
            >
              {body}
            </textarea>
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
                {/* <br/>を使って改行を表示する。\nがないとmarkdownがうまいこと適応できないので\nもつける。 */}
                {body}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
