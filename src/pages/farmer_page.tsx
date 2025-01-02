import InfoBox_Text from "../components/login/infobox";
import Header from "../components/shared_components/Header";
import Header from "../components/shared_components/Header";
import Pending_List from "../components/farmer/PendingList";
import Table from "../components/shared_components/Table";
import SearchBar from "../components/shared_components/SearchBar";
import Sidebar from "../components/shared_components/SideBar";

const Farmer_Page = () => {
  const rowContent = [
    { name: "Alice", age: 25, gender: "Female", height: "5ft 6in" },
    { name: "Bob", age: 30, gender: "Male", height: "5ft 10in" },
    { name: "Charlie", age: 35, gender: "Male", height: "6ft" },
    { name: "Diana", age: 28, gender: "Female", height: "5ft 4in" },
    { name: "Alice", age: 25, gender: "Female", height: "5ft 6in" },
    { name: "Bob", age: 30, gender: "Male", height: "5ft 10in" },
    { name: "Charlie", age: 35, gender: "Male", height: "6ft" },
    { name: "Diana", age: 28, gender: "Female", height: "5ft 4in" },
  ];

  const columnData = [
    { key: "name", title: "Name" },
    { key: "age", title: "Age" },
    { key: "gender", title: "Gender" },
    { key: "height", title: "Height" },
    { key: "name", title: "Name" },
    { key: "age", title: "Age" },
    { key: "gender", title: "Gender" },
    { key: "height", title: "Height" },
  ];

  return (
    <div className="app-container">
      <Header role="Farmer" />
      <div className="page-layout">
        <Sidebar>
          <Pending_List />
        </Sidebar>
        <div className="content-area">
          <SearchBar />
          <h1>table</h1>
        </div>
      </div>
    </div>
  );
};

export default Farmer_Page;
