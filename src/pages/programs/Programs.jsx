import programStyle from "./programs.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BaseURL } from "../../constants";
import Button from "../../components/button/button";
import classes from "../../components/button/button.module.css";
import Card from "../../components/card/card";

const Programs = () => {
  const [data, setData] = useState({ name: "MAC" });
  useEffect(() => {
    const url = `${BaseURL}faculty_list`;
    const config = {
      headers: {
        "content-type": "application/json",
      },withCredentials: true,
    };
    axios.get(url, config).then(
      (response) => {
        setData(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  let faculty_list = [];
  for (let value in data) {
    faculty_list.push(data[value].name);
  }
  return (
    <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 mt-4">
      <div className="row">
        {faculty_list.map((name,index) => (
          <div key={index} className="col-xs-12 col-sm-12 col-md-3 col-lg-3 mt-3">
            <Card className="h-100">
              <h3 className={programStyle.pfeaturedTitle}>{name}</h3>
              <h4 className={programStyle.pfeaturedMoney}>261</h4>
              {/* <span className="pfeaturedMoneyRate"></span> */}
              <Button className={classes.primary}>See all Courses</Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;
