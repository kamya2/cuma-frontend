import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import featureInfoStyle from "./featuredInfo.module.css";
import { ImArrowUp } from "react-icons/im";
import experience from "../../images/experience.png";
import experience1 from "../../images/experience1.png";
import experience2 from "../../images/experience2.png";
import programIcon from "../../images/program.png";
import mapping from "../../images/mapping.png";
import { Link } from "react-router-dom";
import Button from "../button/button";
import classes from "../button/button.module.css";
import Card from "../card/card";

export class PauseOnHover extends Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      arrows: false,
    };
    return (
      <div className={featureInfoStyle.slide}>
        <main className="featuredItem">
          <Slider {...settings}>
            <div>
              <img src={experience} alt="slider" />
            </div>
            <div>
              <img src={experience1} alt="slider" />
            </div>
            <div>
              <img src={experience2} alt="slider" />
            </div>
          </Slider>
        </main>
      </div>
    );
  }
}

const FeaturedInfo = () => {
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
        <Card>
          <div className="row">
            <div className="col-9">
              <h3 className={featureInfoStyle.featuredTitle}>Programs</h3>
              <h4 className={featureInfoStyle.successDigit}>261</h4>
              <Link to={"/program"}>
                <Button className={classes.primary}>All Programs</Button>
              </Link>
            </div>
            <div className="col-3">
              <div className={featureInfoStyle.iconBg}>
                <img src={programIcon} className={featureInfoStyle.icons} />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
        <Card>
          <div className="row">
            <div className="col-9">
              <h3 className={featureInfoStyle.featuredTitle}>Courses</h3>
              <h4 className={featureInfoStyle.successDigit}>524</h4>
              <Link to={"/products"}>
                <Button className={classes.primary}>All Courses</Button>
              </Link>
            </div>
            <div className="col-3">
              <div className={featureInfoStyle.iconBg}>
                <img src={programIcon} className={featureInfoStyle.icons} />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-3">
        <Card>
          <div className="row">
            <div className="col-9">
              <h3 className={featureInfoStyle.featuredTitle}>Maps</h3>
              <h4 className={featureInfoStyle.successDigit}>20</h4>
              <Link to={"/curiMaps"}>
                <Button className={classes.primary}>All Maps</Button>
              </Link>
            </div>
            <div className="col-3">
              <div className={featureInfoStyle.iconBg}>
                <img src={mapping} className={featureInfoStyle.icons} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FeaturedInfo;
