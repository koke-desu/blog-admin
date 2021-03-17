import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import firebase from "firebase";
import { getAllPosts, getCategories, getTags } from "../firebase/dbFunctions";
import { useState } from "react";
import admin from "firebase-admin";
import { Post, Category, Tags } from "../firebase/firebase";
import Layout from "../components/Layout";
import PostList from "../components/PostList";
import { newPost } from "../firebase/cliantSideFunction";

export default function Home(props) {
  const posts: Post[] = JSON.parse(props.posts);
  const categories: Category[] = JSON.parse(props.categories);
  const tags: Tags[] = JSON.parse(props.tags);

  const router = useRouter();

  const createNewPost = () => {
    newPost().then((id) => {
      router.push(`posts/${id}`);
    });
  };

  return (
    <Layout>
      <button
        className="m-5 w-20 h-20 rounded-sm bg-gray-300"
        onClick={createNewPost}
      >
        新規作成
      </button>
      <PostList posts={posts} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      posts: JSON.stringify(await getAllPosts()),
      categories: JSON.stringify(await getCategories()),
      tags: JSON.stringify(await getTags()),
    },
  };
};
