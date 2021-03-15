import { getImage } from "../../../firebase/dbFunctions";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req, res) => {
  const {
    query: { path },
  } = req;
  //const Storage: admin.storage.Storage = admin.storage();
  res.status(200).json({
    url: await getImage(path.join("/"))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return "image not found";
      }),
  });
};
