import { BrowserRouter as Router, Link, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import ExerciseDetail from './ExerciseDetail';
import { exerciseLibrary, type ExerciseCategory } from './exerciseData';

interface CategoryConfig {
  key: ExerciseCategory;
  label: string;
  className: string;
}

const categoryConfig: CategoryConfig[] = [
  { key: 'Push', label: '/// PUSH    PUSH    PUSH ///', className: 'push' },
  { key: 'Pull', label: '/// PULL    PULL    PULL ///', className: 'pull' },
  { key: 'Legs', label: '/// LEGS    LEGS    LEGS ///', className: 'legs' },
  { key: 'Core', label: '/// CORE    CORE    CORE ///', className: 'core' },
];

const sidebarLinks = [
  { to: '/', label: 'Home' },
  { to: '/workout-plan', label: 'Workout Plan' },
  { to: '/progress', label: 'Progress' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/settings', label: 'Settings' },
];

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="placeholder-page">
    <h1>{title}</h1>
    <p>Section is ready for content. Use the sidebar to navigate back to training modules.</p>
  </div>
);

const HomePage = () => (
  <div className="app-container">
    <header className="home-header">
      <h1>Nova Fitness</h1>
      <p>Pick an exercise to view details, instructions, tags, and video tutorials.</p>
    </header>

    {categoryConfig.map((category) => {
      const categoryExercises = exerciseLibrary.filter((exercise) => exercise.category === category.key);

      return (
        <section key={category.key} className="category">
          <div className={`category-bar ${category.className}`}>{category.label}</div>
          <div className="exercise-tabs">
            {categoryExercises.map((exercise) => (
              <Link to={`/${exercise.slug}`} className="exercise-tab" key={exercise.slug}>
                <div className="thumbnail-container">
                  <img src="/images/david-laid.png" alt={exercise.name} className="thumbnail" />
                  <img src="/images/david-laid.gif" alt={`${exercise.name} preview`} className="gif-preview" />
                </div>
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-difficulty">{exercise.difficulty}</span>
                <div className="tag-row">
                  {exercise.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="exercise-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      );
    })}

    <footer>By Jar 2026</footer>
  </div>
);

function App() {
  return (
    <Router>
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="icon-space">
            <span>NF</span>
          </div>
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:exerciseName" element={<ExerciseDetail />} />
          <Route path="/workout-plan" element={<PlaceholderPage title="Workout Plan" />} />
          <Route path="/progress" element={<PlaceholderPage title="Progress" />} />
          <Route path="/statistics" element={<PlaceholderPage title="Statistics" />} />
          <Route path="/nutrition" element={<PlaceholderPage title="Nutrition" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
