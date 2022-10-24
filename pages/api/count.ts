import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("CourseData");
  const num = await db.collection("Courses").countDocuments({});
  console.log(num);
  res.status(200).json(num);
  return;
}
