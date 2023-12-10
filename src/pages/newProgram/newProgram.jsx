import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BaseURL } from "../../constants";
import Button from "../../components/button/button";
import classes from "../../components/button/button.module.css";
import { useParams } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
    { description: "", alignment: "" },
  ]);

  const outcomesRows = [["", ""]];

  const UGA_OPTIONS = [
    {
      value: "A",
      label: "A - the acquisition, application and integration of knowledge",
    },
    {
      value: "B",
      label:
        "B - research skills, including the ability to define problems and access, retrieve and evaluate information (information literacy)",
    },
    { value: "C", label: "C - critical thinking and problem-solving skills" },
    { value: "D", label: "D - literacy and numeracy skills" },
    {
      value: "E",
      label: "E - responsible behaviour to self, others and society",
    },
    { value: "F", label: "F - interpersonal and communications skills" },
    {
      value: "G",
      label: "G - teamwork, and personal and group leadership skills",
    },
    { value: "H", label: "H - creativity and aesthetic appreciation" },
    { value: "I", label: "I - the ability and desire for continuous learning" },
  ];

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const allfaculty = `${BaseURL}faculty_list`;
      const UGAAlignmentList = `${BaseURL}uga_alignments_list`;

      const [facultyList, UGAAlignment] = await Promise.all([
        fetch(allfaculty).then((response) => response.json()),
        fetch(UGAAlignmentList).then((response) => response.json()),
      ]);

      setData(facultyList);
      setUgaAlignments(UGAAlignment);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
  };

  const handleAcademicLevelChange = (e) => {
    setAcademicLevel(e.target.value);
  };

  const handleUGAChange = (selectedOption, outcomeIndex) => {
    setOutcomes((prevOutcomes) => {
      const updatedOutcomes = [...prevOutcomes];
      updatedOutcomes[outcomeIndex].alignment = selectedOption;
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
        legend: outcome.alignment,  // assuming alignment is a single value
        description: outcome.description,
      })),
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const result = await response.json();
  
      if (result.success === false) {
        setError(result.message);
      } else {
        // Redirect to the program list page after creating a new program
        navigate(`/edit-project/${projectId}`);
        setError("");
      }
    } catch (error) {
      console.error("Error adding program:", error);
      setError("An error occurred while adding the program.");
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

  const handleConvertToPDF = () => {
    try {
      const pdf = new jsPDF();

      // Add top information to the PDF
      const topInfoRows = [
        ["Program Name", programName],
        ["Academic Level", academicLevel],
        ["Faculty", selectedFaculty],
        ["Revision Start", revisionDate],
        ["Document ID", docID],
      ];
      pdf.autoTable({
        head: [],
        body: topInfoRows,
        startY: 15,
      });

      // Add a separator
      pdf.setFontSize(12);
      pdf.text(
        "Outcomes and UGA Alignments",
        14,
        pdf.autoTable.previous.finalY + 10
      );

      // Add Outcomes and UGA Alignments to the PDF
      outcomes.forEach((outcome, index) => {
        outcomesRows.push([`Outcome ${index + 1}`, outcome.description]);

        // Check if outcome.alignment is defined before accessing its properties
        const alignmentInfo = outcome.alignment
          ? `${outcome.alignment.label} - ${outcome.alignment.value}`
          : "";
        outcomesRows.push(["", alignmentInfo]);
      });

      pdf.autoTable({
        head: [],
        body: outcomesRows,
        startY: pdf.autoTable.previous.finalY + 15,
      });

      // Generate PDF
      pdf.save("program_form.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 mt-4 mb-4">
      <h3>
        <KeyboardArrowLeftOutlined onClick={goBack} /> New Program
      </h3>
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
                      <select
                        className="form-control"
                        value={outcome.alignment}
                        onChange={(e) => handleUGAChange(e.target.value, index)}
                      >
                        <option value="">Select UGA Alignment</option>
                        {UGA_OPTIONS.map((uga) => (
                          <option key={uga.value} value={uga.value}>
                            {uga.label}
                          </option>
                        ))}
                      </select>
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
              </div>
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
              <Button className={classes.primary} onClick={handleConvertToPDF}>
                Convert to PDF
              </Button>
              <Button type="submit" className={classes.primary}>
  Create Program
</Button>
                {error && <div className="error text-danger">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProgram;
