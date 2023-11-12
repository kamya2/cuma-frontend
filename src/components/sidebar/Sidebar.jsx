import React from "react";
import "./sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Folder,
  Subject,
  Bookmark,
  Bookmarks,
  Book,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  Assignment,
  Report,
} from "@material-ui/icons";

const sidebarItems = [
  {
    title: "Dashboard",
    icons: [<Home />, <Folder />, <Subject />],
    links: ["/home", "/projects", "/programs"],
  },
  {
    title: "Quick Menu",
    icons: [<Bookmark />, <Bookmarks />, <Book />],
    links: ["/program-list", "/course-list", "/curiMaps"],
  },
];

const Sidebar = ({ sidebarOpen }) => {
  const location = useLocation();

  return (
    <div className={`col-sm-12 col-xs-12 col-md-2 col-lg-2 ${sidebarOpen ? 'sidenav' : 'sidenavClosed'}`}>
      <div className="sidebarWrapper">
        {sidebarItems.map((section, index) => (
          <div key={index} className="sidebarMenu mt-4">
            <h3 className="widgetSm_widgetSmTitle__1DLAD">{section.title}</h3>
            <ul className="sidebarList">
              {section.icons.map((icon, i) => (
                <Link to={section.links[i]} className="link" key={i}>
                  <li className={`sidebarListItem mt-2 ${location.pathname === section.links[i] ? 'active' : ''}`}>
                    {React.cloneElement(icon, { className: "sidebarIcon" })}
                    {section.title === "Dashboard" && section.links[i] === "/home" ? "Home" : section.title === "Dashboard" && section.links[i] === "/projects" ? "Projects" : section.title === "Dashboard" && section.links[i] === "/programs" ? "Programs" : section.title === "Quick Menu" && section.links[i] === "/program-list" ? "Your Programs" : section.title === "Quick Menu" && section.links[i] === "/course-list" ? "Your Courses" : section.title === "Quick Menu" && section.links[i] === "/curiMaps" ? "Curriculum Maps" : null}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
