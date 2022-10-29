import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

import { withValidation } from "next-validations";
import * as yup from "yup";

const schema = yup.object().shape({
  _id: yup.string(),
  tags: yup.array().of(yup.string()).required("Tags are required"),
  credit: yup.array().of(yup.string()).required("Subject(s) are required"),
  grade_level: yup
    .array()
    .of(yup.string())
    .required("Grade level(s) are required"),
  name: yup.string().required("Course name is required"),
  course_id: yup.string().required("Course ID is required"),
  url: yup.string().required("Course URL is required"),
  semesters: yup
    .number()
    .typeError("Semesters is required")
    .required("Semesters is required"),
  max_semesters: yup
    .number()
    .typeError("Max semesters is required")
    .required("Max semesters is required"),
  weight: yup
    .number()
    .typeError("Weight is required")
    .required("Weight is required"),
  contact: yup
    .string()
    .email("Contact must be a valid email")
    .required("Contact email is required"),
  description: yup.string().required("Description is required"),
  requirements: yup
    .string()
    .required("Requirements are required (Type none if no requirements)"),
  additional_info: yup
    .string()
    .required("Additional info is required (Type none if no requirements)"),
});

const validate = withValidation({
  schema,
  type: "Yup",
  mode: "body",
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("CourseData");

  const { _id } = req.body;
  if (req.body._id) {
    delete req.body._id;

    const result = await db
      .collection("Courses")
      .updateOne({ _id: new ObjectId(_id) }, { $set: req.body });
    res.status(200).json(result);

    return;
  } else {
    const result = await db.collection("Courses").insertOne(req.body);
    res.status(200).json(result);
    return;
  }
}

export default validate(handler);
