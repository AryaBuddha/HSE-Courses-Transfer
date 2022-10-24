import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("CourseData");
  const data = await db.collection("Courses").find().toArray();

  const { num } = req.query;
  if (num) {
    //res.status(200).json(data[num]);
    res.status(200).json(data[num]);
    return;
  }
  res.status(200).json(data);
  return;
}
