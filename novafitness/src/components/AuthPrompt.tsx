import { Link } from 'react-router-dom';

interface AuthPromptProps {
  message: string;
  actionLabel?: string;
}

const AuthPrompt = ({ message, actionLabel = 'Sign Up or Log In' }: AuthPromptProps) => (
  <div className="auth-prompt">
    <p>{message}</p>
    <Link to="/auth" className="auth-prompt-button">
      {actionLabel}
    </Link>
  </div>
);

export default AuthPrompt;
