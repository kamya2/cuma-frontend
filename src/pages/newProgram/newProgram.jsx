import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BaseURL } from "../../constants";
import Button from "../../components/button/button";
import classes from "../../components/button/button.module.css";
import { useParams } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { KeyboardArrowLeftOutlined } from "@material-ui/icons";

const NewProgram = () => {
  const { projectId } = useParams();
  const [data, setData] = useState([]);
  const [ugaAlignments, setUgaAlignments] = useState([]);
  const [file, setFile] = useState("");
  const [programName, setProgramName] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [revisionDate, setRevisionDate] = useState("");
  const [docID, setDocID] = useState("");
  const [error, setError] = useState("");
  const [outcomes, setOutcomes] = useState([
    { description: "", alignments: [] },
  ]);
  console.log(projectId);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    try {
      const allfaculty = `${BaseURL}faculty_list`;
      const UGAAlignmentList = `${BaseURL}uga_alignments_list`;

      const getFacultyList = axios.get(allfaculty);
      const getUGAAlignment = axios.get(UGAAlignmentList);

      const [facultyList, UGAAlignment] = await axios.all([
        getFacultyList,
        getUGAAlignment,
      ]);

      const allFacultyData = facultyList.data;
      const allUGAData = UGAAlignment.data;

      setData(allFacultyData);
      setUgaAlignments(allUGAData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Select Faculty handler
  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
  };

  //Select Academic Level Handler
  const handleAcademicLevelChange = (e) => {
    setAcademicLevel(e.target.value);
  };

  const handleUGAChange = (selectedOptions, outcomeIndex) => {
    setOutcomes((prevOutcomes) => {
      const updatedOutcomes = [...prevOutcomes];
      updatedOutcomes[outcomeIndex].alignments = selectedOptions;
      return updatedOutcomes;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${BaseURL}addProjectProgram`;
    const config = {
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true,
    };

    const body = {
      project_id: projectId,
      name: programName,
      academic_level: academicLevel,
      faculty_id: selectedFaculty,
      document_id: docID,
      revision_start_date: new Date(revisionDate),
      latest_modified: new Date().toISOString().split("T")[0],
      state: "draft",
      parent_program_id: null,
      alignments: outcomes.map((outcome) => ({
        legend: outcome.alignments.map((uga) => uga.value).join(""),
        description: outcome.description,
      })),
    };

    const target = e.nativeEvent.explicitOriginalTarget || e.target; // Get the target element that triggered the event

    if (!target.classList.contains("add-outcome-button")) {
      try {
        const response = await axios.post(url, body, config);
        if (response.data.success === false) {
          setError(response.data.message);
        } else {
          // Assuming the server responds with the updated project list
          const updatedProjectList = response.data.project_list;
          // Update the UI or perform any necessary actions with the updated project list

          window.location.href = `/edit-project/${projectId}`;
          setError("");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while adding the project.");
      }
    }
  };

  const handleAddOutcome = () => {
    const newOutcome = { description: "", alignments: [] };
    setOutcomes((prevOutcomes) => [...prevOutcomes, newOutcome]);
  };

  const handleDeleteOutcome = (outcomeIndex) => {
    setOutcomes((prevOutcomes) => {
      const updatedOutcomes = [...prevOutcomes];
      updatedOutcomes.splice(outcomeIndex, 1);
      return updatedOutcomes;
    });
  };

  return (
    <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 mt-4 mb-4">
      <h3><KeyboardArrowLeftOutlined onClick={goBack} /> New Program</h3>
      <div className="row mt-3 mb-3">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <form className="row" onSubmit={handleSubmit}>
            <div className="col-12">
              <label>Program</label>
              <input
                type="file"
                placeholder="select"
                className="form-control"
                value={file}
                onChange={(e) => setFile(e.target.value)}
              />
            </div>
            <h2 className="divider mt-3 mb-3 text-center">OR</h2>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
                <label>
                  Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Program Name"
                  className="form-control"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
                <label>
                  Academic Level<span className="text-danger">*</span>
                </label>
                <select
                  name="academic level"
                  id="academic level"
                  className="form-control"
                  value={academicLevel}
                  onChange={handleAcademicLevelChange}
                >
                  <option value="undergraduate" selected>
                    Undergraduate
                  </option>
                  <option value="graduate">Graduate</option>
                </select>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
                <label>Faculty</label>
                <select
                  name="faculty"
                  id="faculty"
                  className="form-control"
                  value={selectedFaculty}
                  onChange={handleFacultyChange}
                >
                  <option value="">Select Faculty</option>
                  {data.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
                <label>
                  Revision Start<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  placeholder="mm-dd-yyyy"
                  className="form-control"
                  value={revisionDate}
                  onChange={(e) => setRevisionDate(e.target.value)}
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
                <label>Document ID</label>
                <input
                  type="text"
                  placeholder="Program scope"
                  className="form-control"
                  value={docID}
                  onChange={(e) => setDocID(e.target.value)}
                />
              </div>
              <div className="col-12 mt-3">
                <h4>Outcomes and UGA Alignments</h4>
                {outcomes.map((outcome, index) => (
                  <div key={index} className="row">
                    <div className="col-4 mt-3">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        value={outcome.description}
                        onChange={(e) => {
                          const updatedOutcomes = [...outcomes];
                          updatedOutcomes[index].description = e.target.value;
                          setOutcomes(updatedOutcomes);
                        }}
                      />
                    </div>
                    <div className="col-4 mt-3">
                      <label>UGA Alignments</label>
                      <MultiSelect
                        options={ugaAlignments.map((uga) => ({
                          value: uga.legend,
                          label: `${uga.legend} - ${uga.description}`,
                        }))}
                        value={outcome.alignments}
                        onChange={(selectedOptions) =>
                          handleUGAChange(selectedOptions, index)
                        }
                        labelledBy="Select UGA Alignment"
                        selectAllLabel="Select All"
                        disableSearch={false}
                        overrideStrings={{
                          selectSomeItems: "Select UGA Alignments",
                          allItemsAreSelected:
                            "All UGA Alignments are selected",
                          searchPlaceholder: "Search UGA Alignments",
                          noOptions: "No UGA Alignments found",
                        }}
                      />
                    </div>

                    <div className="col-2 mt-3 d-flex justify-content-center align-items-center">
                      <Button
                        className={classes.danger}
                        onClick={() => handleDeleteOutcome(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="col-12 mt-3">
                  <Button
                    type="button"
                    className={`${classes.primary} add-outcome-button`}
                    onClick={handleAddOutcome}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <Button className={classes.primary}>Create Program</Button>
                {error && <div className="error text-danger">{error}</div>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProgram;
