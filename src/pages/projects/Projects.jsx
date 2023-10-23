import React, { useState, useEffect } from "react";
import dataGridStyle from "./projects.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { BaseURL } from "../../constants";
import Button from "../../components/button/button";
import classes from "../../components/button/button.module.css";
import Pagination from "react-bootstrap/Pagination";

const Projects = (props) => {
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const url = `${BaseURL}project_list`;
    const config = {
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true,
    };
    axios.get(url, config).then(
      (response) => {
        //console.log(response.data)
        setData(response.data);
        if (response.data.success === "false") {
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  //console.log("data: "+data);
  const handleDelete = (id) => {
    setData(data.filter((row) => row.id !== id));
  };

  const calculateIndex = () => {
    const indexOfLastRow =
      currentPage === 1 ? rowsPerPage : currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return [indexOfFirstRow, indexOfLastRow];
  };

  const [indexOfFirstRow, indexOfLastRow] = calculateIndex();

  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <React.Fragment>
      <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 mt-4">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
            <h3>List of Projects</h3>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <Link to={"/new-project"}>
              <Button className={`${classes.primary} float-end`}>
                Create New Project
              </Button>
            </Link>
          </div>
        </div>
        <div className="table-responsive mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Projects</th>
                <th>Owners</th>
                <th>Guests</th>
                <th>Members</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id}>
                  <td className="align-middle">{row.id}</td>
                  <td className="align-middle">
                    <span>{row.name}</span>
                  </td>
                  <td className="align-middle">
                    <span>{row.owners}</span>
                  </td>
                  <td className="align-middle">
                    <span>{row.guests}</span>
                  </td>
                  <td className="align-middle">
                    <span>{row.members}</span>
                  </td>
                  <td className="align-middle">
                    <Link to={`/edit-project/${row.id}`}>
                      <Button>Edit Project</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => handleClick(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>
    </React.Fragment>
  );
};

export default Projects;
