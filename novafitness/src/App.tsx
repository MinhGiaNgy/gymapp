import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const ExerciseDetail = () => {
  return (
    <div className="exercise-detail">
      <h1>Exercise Details</h1>
      {/* Add exercise specific content here */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="sidebar">
  <div className="sidebar-content">
    <div className="icon-space">
      <span>🏋🏻‍♂️</span>
    </div>
    <div className="nav-item active">
      <Link to="/">
        <span>🏠</span> Home
      </Link>
    </div>
    <div className="nav-item">
      <Link to="/workout-plan">
        <span>📋</span> Workout Plan
      </Link>
    </div>
    <div className="nav-item">
      <Link to="/progress">
        <span>📈</span> Progress
      </Link>
    </div>
    <div className="nav-item">
      <Link to="/statistics">
        <span>📊</span> Statistics
      </Link>
    </div>
    <div className="nav-item">
      <Link to="/nutrition">
        <span>🥗</span> Nutrition
      </Link>
    </div>
    <div className="nav-item">
      <Link to="/settings">
        <span>⚙️</span> Settings
      </Link>
    </div>
  </div>
</div>

      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <div className="category">
              <div className="category-bar push">/// PUSH    PUSH    PUSH ///</div>
              <div className="exercise-tabs">
                <Link to="/bench-press" className="exercise-tab">
                  <div className="thumbnail-container">
                    <img src="/images/david-laid.png" alt="Bench Press" className="thumbnail" />
                    <img src="/images/david-laid.gif" alt="Bench Press" className="gif-preview" />
                  </div>
                  <span>Bench Press</span>
                </Link>
                <Link to="/shoulder-press" className="exercise-tab">
                  <div className="thumbnail-container">
                    <img src="/images/david-laid.png" alt="Shoulder Press" className="thumbnail" />
                    <img src="/images/david-laid.gif" alt="Shoulder Press" className="gif-preview" />
                  </div>
                  <span>Shoulder Press</span>
                </Link>
              </div>
            </div>

            <div className="category">
              <div className="category-bar pull">/// PULL    PULL    PULL ///</div>
              <div className="exercise-tabs">
                <Link to="/hammer-curls" className="exercise-tab">
                  <div className="thumbnail-container">
                    <img src="/images/david-laid.png" alt="Hammer Curls" className="thumbnail" />
                    <img src="/images/david-laid.gif" alt="Hammer Curls" className="gif-preview" />
                  </div>
                  <span>Hammer Curls</span>
                </Link>
                <Link to="/lat-pulldown" className="exercise-tab">
                  <div className="thumbnail-container">
                    <img src="/images/david-laid.png" alt="Lat Pulldown" className="thumbnail" />
                    <img src="/images/david-laid.gif" alt="Lat Pulldown" className="gif-preview" />
                  </div>
                  <span>Lat Pulldown</span>
                </Link>
              </div>
            </div>

            <div className="category">
              <div className="category-bar legs">/// LEGS    LEGS    LEGS ///</div>
              <div className="exercise-tabs">
                <Link to="/squats" className="exercise-tab">
                  <div className="thumbnail-container">
                    <img src="/images/david-laid.png" alt="Squats" className="thumbnail" />
                    <img src="/images/david-laid.gif" alt="Squats" className="gif-preview" />
                  </div>
                  <span>Squats</span>
                </Link>
                <Link to="/lunges" className="exercise-tab">
                  <div className="thumbnail-container">
                    <img src="/images/david-laid.png" alt="Lunges" className="thumbnail" />
                    <img src="/images/david-laid.gif" alt="Lunges" className="gif-preview" />
                  </div>
                  <span>Lunges</span>
                </Link>
              </div>
            </div>

            <footer>By Jar 2025</footer>
          </div>
        } />
        
        <Route path="/:exerciseName" element={<ExerciseDetail />} />
        <Route path="/statistics" element={<div>Statistics Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;