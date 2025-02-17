import { useState } from "react";
import "../../styles/details/Report.css";
import AntibioticsTable from "./AntibioticStats";

const Report = ({ tabNames, jsonData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
    if (tabNames[activeTab] === "Antibiotic stats") {
      return jsonData[activeTab] ? (
        <AntibioticsTable data={jsonData[activeTab]} />
      ) : (
        <div>No data available for this tab.</div>
      );
    }

    return jsonData[activeTab] ? (
      <p>{JSON.stringify(jsonData[activeTab], null, 2)}</p>
    ) : (
      <div>No data available for this tab.</div>
    );
  };

  return (
    <div className={"reportContainer"}>
      <div className="reportTabs">
        {tabNames.map((name, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? "active" : ""}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="reportContent">{renderContent()}</div>
    </div>
  );
};

export default Report;
