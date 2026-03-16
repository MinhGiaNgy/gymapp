import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/useAuth';

const SettingsPage = () => {
  const { user, logout, updateEmail, updatePassword } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setEmailMessage('');

    try {
      await updateEmail(newEmail, emailPassword);
      setEmailMessage('Email updated successfully.');
      setNewEmail('');
      setEmailPassword('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update email.');
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setPasswordMessage('');

    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to update password.');
    }
  };

  return (
    <section className="page-panel">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Profile Management</h3>
          <p>Current account: {user?.email ?? 'Unknown user'}</p>

          <form onSubmit={handleEmailSubmit} className="settings-form">
            <label htmlFor="newEmail">New Email</label>
            <input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              required
              className="inline-input"
            />

            <label htmlFor="emailPassword">Confirm Password</label>
            <input
              id="emailPassword"
              type="password"
              value={emailPassword}
              onChange={(event) => setEmailPassword(event.target.value)}
              required
              className="inline-input"
            />

            <button type="submit" className="primary-button">
              Update Email
            </button>
          </form>

          {emailMessage ? <p className="success-text">{emailMessage}</p> : null}
        </div>

        <div className="settings-card">
          <h3>Security</h3>
          <p>Change your password.</p>

          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="inline-input"
            />

            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              className="inline-input"
            />

            <button type="submit" className="primary-button">
              Update Password
            </button>
          </form>

          {passwordMessage ? <p className="success-text">{passwordMessage}</p> : null}
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="button" className="danger-button" onClick={logout}>
        Logout
      </button>
    </section>
  );
};

export default SettingsPage;
