import { getCategories } from "../../../firebase/dbFunctions";

export default async (req, res) => {
  res.status(200).json({
    categories: await getCategories()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("getCategories ERROR!!\n" + err);
        return [];
      }),
  });
};
