import "./AnimatedBackground.css";

function AnimatedBackground({ children }) {
  return (
    <>
      <div className="animated-bg">
        <div className="aurora aurora-one"></div>
        <div className="aurora aurora-two"></div>
        <div className="aurora aurora-three"></div>
        <div className="grid-overlay"></div>
        <div className="stars"></div>
      </div>

      <div className="app-content">{children}</div>
    </>
  );
}

export default AnimatedBackground;