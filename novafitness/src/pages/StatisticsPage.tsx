import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import AuthPrompt from '../components/AuthPrompt';

const StatisticsPage = () => {
  const { user } = useAuth();

  return (
    <section className="page-panel">
      <div className="page-header">
        <h1>Statistics</h1>
      </div>
      {!user ? (
        <AuthPrompt message="Statistics are account-based. Sign up or log in to unlock full performance tracking." />
      ) : null}
      <p className="section-note">
        Detailed performance stats now live in the Progress page so your exercise search, rating, and numbers stay in one place.
      </p>
      <Link to="/progress" className="primary-button inline-link">
        Open Progress
      </Link>
    </section>
  );
};

export default StatisticsPage;
