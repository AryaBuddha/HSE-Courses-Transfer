import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("CourseData");

  const { _id } = req.body;
  db.collection("Courses").deleteOne({ _id: new ObjectId(_id) });
  res.status(200).json({ message: "Success" });
  return;
}
