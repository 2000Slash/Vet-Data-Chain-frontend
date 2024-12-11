import React from 'react';
import "../../styles/styles.css"

const InfoBox_Text = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="card info-card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <p>{content}</p>
    </div>
  );
};

export default InfoBox_Text;


