import { getTags } from "../../../firebase/dbFunctions";

export default async (req, res) => {
  res.status(200).json({
    tags: await getTags()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("getTags ERROR!!\n" + err);
        return [];
      }),
  });
};
