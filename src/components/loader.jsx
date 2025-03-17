import "../style/loader.css";

const Loader = (props) => {
  return (
    <div className="overlay" {...props}>
      <div className="center">
        <div className="spinner"></div>
      </div>
      <div className="center">
        <div className="progress">{props.children}</div>
      </div>
    </div>
  );
};

export default Loader;
