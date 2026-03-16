import { Link } from 'react-router-dom';

const StatisticsPage = () => (
  <section className="page-panel">
    <div className="page-header">
      <h1>Statistics</h1>
    </div>
    <p className="section-note">
      Detailed performance stats now live in the Progress page so your exercise search, rating, and numbers stay in one place.
    </p>
    <Link to="/progress" className="primary-button inline-link">
      Open Progress
    </Link>
  </section>
);

export default StatisticsPage;
