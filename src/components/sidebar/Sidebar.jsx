import "./sidebar.css";
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
import { Link } from "react-router-dom";

const Sidebar = ({sidebarOpen}) => {
  return (
    <div className={`col-sm-12 col-xs-12 col-md-2 col-lg-2 ${sidebarOpen ? 'sidenav' : 'sidenavClosed'}`}>
      <div className="sidebarWrapper">
        <div className="sidebarMenu mt-4">
          <h3 className="widgetSm_widgetSmTitle__1DLAD">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/home" className="link">
              <li className="sidebarListItem mt-2 active">
                <Home className="sidebarIcon" />
                Home
              </li>
            </Link>
            <Link to="/projects" className="link">
              <li className="sidebarListItem mt-2">
                <Folder className="sidebarIcon" />
                Projects
              </li>
            </Link>
            <Link to="/programs" className="link">
              <li className="sidebarListItem mt-2">
                <Subject className="sidebarIcon" />
                Programs
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu mt-4">
          <h3 className="widgetSm_widgetSmTitle__1DLAD">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/program-list" className="link">
              <li className="sidebarListItem mt-2">
                <Bookmark className="sidebarIcon" />
                Your Programs
              </li>
            </Link>
            <Link to="/course-list" className="link">
              <li className="sidebarListItem mt-2">
                <Bookmarks className="sidebarIcon" />
                Your Courses
              </li>
            </Link>
            <Link to="/curiMaps" className="link">
              <li className="sidebarListItem mt-2">
                <Book className="sidebarIcon" />
                Curriculum Maps
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
