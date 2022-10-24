import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("CourseData");

  const data = await db.collection("CreditsTags").find().toArray();
  const defaults = {
    credits: [],
    tags: [],
  };
  data.map(({ list, type }) => {
    list.map(({ name }) => {
      defaults[type].push(name);
    });
  });

  console.log(defaults);
  res.status(200).json(defaults);
}
