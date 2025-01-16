import "../../styles/details/loading.css"

export const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Loading;