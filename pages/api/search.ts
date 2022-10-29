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

  let index = 0;
  try {
    index = data.findIndex((course) => course.course_id === num);
  } catch {
    index = 0;
  }

  res.status(200).json(index);
  return;
}
