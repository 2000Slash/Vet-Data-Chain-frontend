import { useState } from 'react';
import "../../styles/details/Report.css";

const Report = ({ tabNames, jsonData }) => {
    const [activeTab, setActiveTab] = useState(0);

    const renderContent = () => {
        return jsonData[activeTab] ? (
            <p>
                {JSON.stringify(jsonData[activeTab], null, 2)}
            </p>
        ) : (
            <div>No data available for this tab.</div>
        );
    };

    return (
        <div className={"reportContainer"}>
            <div>
                {tabNames.map((name, index) => (
                    <button key={index} onClick={() => setActiveTab(index)} style={{ backgroundColor: 'green', color: 'white'}}>{name}</button>
                ))}
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default Report;