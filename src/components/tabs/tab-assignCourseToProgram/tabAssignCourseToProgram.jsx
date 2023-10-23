// http://localhost:5000/mapCoursesToPrograms

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../../../constants";
import tabStyleclasses from "./tabAssignCourseToProgram.css";
import classes from "../../button/button.module.css";
import Button from "../../button/button";

const TabAssignCourseToProgram = ({ projectId }) => {
  const [programData, setProgramData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [programsCoursesData, setProgramsCoursesData] = useState([]);
  const [error, setError] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  // console.log(selectedCourses);
  const fetchData = async () => {
    try {
      const allProgramsOfProject = `${BaseURL}getAllProgramsOfProject?id=${projectId}`;
      const allCoursesOfProject = `${BaseURL}getAllCoursesOfProject?id=${projectId}`;
      const allProgramsCoursesOfProject = `${BaseURL}getAllProgramsCoursesOfProject?project_id=${projectId}`;

      const getAllPrograms = axios.get(allProgramsOfProject);
      const getAllCourses = axios.get(allCoursesOfProject);
      const getAllProgramsCourses = axios.get(allProgramsCoursesOfProject);

      const [allProgramsResponse, allCoursesResponse, allProgramsCourses] =
        await axios.all([getAllPrograms, getAllCourses, getAllProgramsCourses]);

      const allProgramsData = allProgramsResponse.data;
      const allCoursesData = allCoursesResponse.data;
      const allProgramsCoursesData = allProgramsCourses.data;

      setProgramData(allProgramsData);
      setCourseData(allCoursesData);
      setProgramsCoursesData(allProgramsCoursesData);

      // console.log(allCoursesData);
      // console.log(allProgramsData);
      console.log("ProgramsCourseData", allProgramsCoursesData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelect = (courseId, courseName) => {
    const isCourseSelected = selectedCourses.some(
      (course) => course.id === courseId
    );
    if (!isCourseSelected) {
      setSelectedCourses([
        ...selectedCourses,
        { id: courseId, name: courseName },
      ]);
    } else {
      setSelectedCourses(
        selectedCourses.filter((course) => course.id !== courseId)
      );
    }
    // setShowSelect((current) => !current);
  };

  const handleSelectedCourse = async (programId) => {
    const url = `${BaseURL}mapCoursesToPrograms`;
    const config = {
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true,
    };

    const body = {
      project_id: projectId,
      mapping: {
        [programId]: selectedCourses.map((course) => [course.id, true]),
      },
    };

    try {
      const response = await axios.post(url, body, config);
      if (response.data.status == false) {
        setError(response.error.message);
      } else {
      }
      console.log(response.data);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <div className="mt-4 mb-4">
        <h3>Assign Courses to Program</h3>
        <div className="row">
          <div className="col-12 mt-3">
            <div className="alert alert-danger" role="alert">
              <h5>Instruction</h5>
              <ol>
                <li>
                  To add courses to a program, first select the courses by
                  clicking on their names on the left-hand side list.
                </li>
                <li>
                  On the right, look for the "Add selected courses" button under
                  the program title, and click it. This will add the courses to
                  the program.
                </li>
                <li>
                  The courses will still be selected on the left-hand side. You
                  can then add the same courses to another program, or choose a
                  different set of courses to add to the next program.
                </li>
                <li>
                  By default, courses will be added to the program as "core"
                  courses. After you've added the course, you can use the
                  menu-button () beside the course name (on the right-hand side)
                  to change the course to an elective.
                </li>
                <li>
                  If the course you're looking for doesn't appear on the
                  left-side list, use the "Courses" tab, above, to import the
                  course into your project. (Similarly for programs: use the
                  "Programs" tab, above.)
                </li>
                <li>
                  When you are finished, be sure to press the "Save changes"
                  button at the bottom of the page.
                </li>
              </ol>
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <div className="col-6">
                <h4>Courses</h4>
                <ul className="list-unstyled mt-4">
                  {courseData.map((row) => (
                    <li
                      key={row.id}
                      className={`${tabStyleclasses.listOfPrograms} ${
                        selectedCourses.some((course) => course.id === row.id)
                          ? "alert alert-primary"
                          : "alert alert-secondary"
                      }`}
                      onClick={() => handleSelect(row.id, row.name)}
                    >
                      <span className="mb-3">Course ID: {row.id}</span>
                      <br />
                      <span className="mb-3">Course Name: {row.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6">
                <h4>Programs</h4>
                <ul className="list-unstyled mt-4">
                  {programData.map((row) => (
                    <li
                      key={row.id}
                      className={`${tabStyleclasses.listOfPrograms} alert alert-secondary`}
                    >
                      <span className="mb-3">Program ID: {row.id}</span> <br />
                      <span className="mb-3">Program Name: {row.name}</span>
                      <br />
                      <br />
                      {programsCoursesData.map((program) => (
                        <div key={program.id}>
                          {program.courses.map((course) => (
                            <span key={course.course_id} className="mb-3">
                              {course.course_name}
                            </span>
                          ))}
                        </div>
                      ))}
                      <Button
                        className={classes.primary}
                        onClick={() => handleSelectedCourse(row.id)}
                      >
                        Add selected Course
                      </Button>
                      <Button>Select above all Courses</Button>
                    </li>
                  ))}
                </ul>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TabAssignCourseToProgram;
