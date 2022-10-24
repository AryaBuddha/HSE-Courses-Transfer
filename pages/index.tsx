import React, { useEffect, useState } from "react";
import type { NextPage } from "next";

import InputBox from "../components/InputBox";

const Home: NextPage = () => {
  const [DEFAULTS, setDEFAULTS] = useState({
    grades: ["Freshman", "Sophomore", "Junior", "Senior"],
    tags: [],
    subjects: [],
    course: {
      tags: [],
      credit: [],
      grade_level: [],
      name: "",
      course_id: "",
      url: "",
      semesters: 0,
      max_semesters: 0,
      weight: 0,
      contact: "",
      description: "",
      requirements: "",
      additional_info: "",
    },
  });

  const [course, setCourse] = useState();
  const [courseNumber, setCourseNumber] = useState(0);
  const [maxNum, setMaxNum] = useState(0);
  const [manualCourseNum, setmanualCourseNum] = useState("1");
  const [errors, setErrors] = useState<String>();
  const [success, setSuccess] = useState<String>();
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<Boolean>();
  const [password, setPassword] = useState<String>();

  useEffect(() => {
    setErrors("");
    setSuccess("");

    fetch("/api/defaults").then((res) => {
      res.json().then((data) => {
        console.log(data.credits);
        setDEFAULTS((prev) => ({
          ...prev,
          subjects: data.credits,
          tags: data.tags,
        }));
      });
    });

    fetch("/api/get?num=" + courseNumber).then((res) => {
      res.json().then((data) => {
        setCourse(data);
        console.log(data);
      });
    });

    fetch("/api/count").then((res) => {
      res.json().then((data) => {
        setMaxNum(data);
      });
    });
  }, [courseNumber]);

  const handleCourseEdit = (e: { target: { id: string; value: string } }) => {
    setCourse((course) => ({ ...course, [e.target.id]: e.target.value }));
  };

  const handleGradeEdit = (change_grade: string) => {
    let grade_levels = course.grade_level;
    if (grade_levels.includes(change_grade)) {
      grade_levels = grade_levels.filter(
        (grade: string) => grade !== change_grade
      );
    } else {
      grade_levels.push(change_grade);
    }
    setCourse((course) => ({
      ...course,
      grade_level: grade_levels,
    }));
  };

  const handleTagEdit = (change_tag: string) => {
    let tags = course.tags;
    if (tags.includes(change_tag)) {
      tags = tags.filter((grade: string) => grade !== change_tag);
    } else {
      tags.push(change_tag);
    }
    setCourse((course) => ({
      ...course,
      tags: tags,
    }));
    console.log(course);
  };

  const handleSubjectEdit = (change_subject: string) => {
    let subjects = course.credit;
    if (subjects.includes(change_subject)) {
      subjects = subjects.filter(
        (subject: string) => subject !== change_subject
      );
    } else {
      subjects.push(change_subject);
    }
    setCourse((course) => ({
      ...course,
      credit: subjects,
    }));
  };

  const handleCourseNumberChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e.target.id == "prev") {
      setCourseNumber(courseNumber - 1);
      setmanualCourseNum((manualCourseNum) =>
        (parseInt(manualCourseNum) - 1).toString()
      );
    } else {
      setCourseNumber(courseNumber + 1);
      setmanualCourseNum((manualCourseNum) =>
        (parseInt(manualCourseNum) + 1).toString()
      );
    }
  };

  const handleManualCourseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value == "") {
      setmanualCourseNum("");
      setCourseNumber(0);
    } else if (parseInt(e.target.value) > maxNum) {
      setmanualCourseNum(maxNum.toString());
      setCourseNumber(maxNum);
    } else if (parseInt(e.target.value) < 0) {
      setmanualCourseNum("1");
      setCourseNumber(0);
    } else {
      setmanualCourseNum(e.target.value);
      setCourseNumber(parseInt(e.target.value) - 1);
    }
  };

  const handleActions = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");
    setLoading(true);
    if (e.target.id == "save") {
      let res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      const data = await res.json();

      if (res.status == 200) {
        setSuccess("Course Saved!");
      } else if (res.status == 400) {
        setErrors(data.errors[0]);
      }

      if (!course._id) {
        setCourseNumber(maxNum);
        setmanualCourseNum((manualCourseNum) =>
          (parseInt(manualCourseNum) + 1).toString()
        );
      }
    } else if (e.target.id == "create") {
      setCourse(DEFAULTS.course);
    } else if (e.target.id == "delete") {
      let res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      const data = await res.json();

      if (res.status == 200) {
        setSuccess("Course Deleted!");
        setCourseNumber(0);
        setmanualCourseNum("1");
      } else if (res.status == 400) {
        setErrors(data.errors[0]);
      }
    }

    setLoading(false);
  };

  const handleAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
    function hashCode(s: string) {
      for (var i = 0, h = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
      }
      return h;
    }

    if (hashCode(e.target.value) == 2038962177) {
      setAuthed(true);
    }
  };

  if (!authed) {
    return (
      <div className="p-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Password
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={handleAuth}
          required
        />
      </div>
    );
  }
  return (
    <div className="p-11">
      <div className="flex justify-center items-center">
        <button
          disabled={courseNumber == 0}
          id="prev"
          onClick={handleCourseNumberChange}
          className="px-3 py-2 border rounded-lg bg-gray-300 hover:bg-slate-200 disabled:opacity-50 disabled:bg-black"
        >
          -
        </button>
        <div className="text-2xl px-3 flex items-center">
          <input
            className="w-12 border border-gray-500"
            value={manualCourseNum}
            onChange={handleManualCourseNumberChange}
          />
          <h1>/ {maxNum}</h1>
        </div>
        <button
          disabled={courseNumber == maxNum}
          id="next"
          onClick={handleCourseNumberChange}
          className="px-3 py-2 border rounded-lg bg-gray-300 hover:bg-slate-200"
        >
          +
        </button>
      </div>

      <form>
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Name
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={course?.name}
            id="name"
            onChange={handleCourseEdit}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Description
          </label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-40 p-2.5"
            value={course?.description}
            id="description"
            onChange={handleCourseEdit}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Additional Info
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5"
            value={course?.additional_info}
            id="additional_info"
            onChange={handleCourseEdit}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Requirements
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5"
            value={course?.requirements}
            id="requirements"
            onChange={handleCourseEdit}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Contact
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5"
            value={course?.contact}
            id="contact"
            onChange={handleCourseEdit}
            required
          />
        </div>

        <div className="flex gap-5 mb-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Course ID
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:w-full focus:border-blue-500 p-2.5"
              value={course?.course_id}
              id="course_id"
              onChange={handleCourseEdit}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Semesters
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              value={course?.semesters}
              id="semesters"
              onChange={handleCourseEdit}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Max Semesters
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              value={course?.max_semesters}
              id="max_semesters"
              onChange={handleCourseEdit}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Weight
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              value={course?.weight}
              id="weight"
              onChange={handleCourseEdit}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Course URL
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              value={course?.url}
              id="url"
              onChange={handleCourseEdit}
              required
            />
          </div>
        </div>

        <div className="flex">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Grades
            </label>
            <div className="flex flex-wrap justify-center w-fit">
              {DEFAULTS.grades.map((grade) => (
                <div
                  key={grade}
                  className="form-check form-check-inline border p-3 rounded-xl hover:border-blue-600 hover:cursor-pointer"
                  onClick={() => handleGradeEdit(grade)}
                >
                  <label className="form-check-label inline-block text-gray-800 hover:cursor-pointer">
                    {grade}
                  </label>
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    id={grade}
                    checked={course?.grade_level.includes(grade)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Tags
            </label>
            <div className="flex flex-wrap justify-center w-fit">
              {DEFAULTS.tags.map((tag) => (
                <div
                  key={tag}
                  className="form-check form-check-inline border p-3 rounded-xl hover:border-blue-600 hover:cursor-pointer"
                  onClick={() => handleTagEdit(tag)}
                >
                  <label className="form-check-label inline-block text-gray-800 hover:cursor-pointer">
                    {tag}
                  </label>
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    id={tag}
                    checked={course?.tags.includes(tag)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-10">
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Subjects
          </label>
          <div className="flex flex-wrap justify-center w-fit">
            {DEFAULTS.subjects.map((subject) => (
              <div
                key={subject}
                className="form-check form-check-inline border p-3 rounded-xl hover:border-blue-600 hover:cursor-pointer"
                onClick={() => handleSubjectEdit(subject)}
              >
                <label className="form-check-label inline-block text-gray-800 hover:cursor-pointer">
                  {subject}
                </label>
                <input
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="checkbox"
                  id={subject}
                  checked={course?.credit.includes(subject)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-xl w-full flex flex-col items-center mb-3">
          <h1 className="text-green-500">{success}</h1>
          <h1 className="text-red-500">{errors}</h1>
        </div>

        <div className="w-full flex justify-center gap-5">
          <button
            type="submit"
            id="save"
            onClick={handleActions}
            className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "..." : "Save"}
          </button>
          <button
            type="submit"
            id="delete"
            onClick={handleActions}
            className="w-24 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
          <button
            type="submit"
            id="create"
            onClick={handleActions}
            disabled={!course?._id}
            className="w-24 bg-green-500 disabled:bg-gray-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
