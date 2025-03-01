import "../../styles/details/loading.css";

export const Loading = ({ progress = 0 }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner" />
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-text">Loading... {Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default Loading;
