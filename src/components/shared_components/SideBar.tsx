import "../../styles/styles.css";
import "../../styles/details/SideBar.css";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return <div className="sidebar">{children}</div>;
};

export default Sidebar;
