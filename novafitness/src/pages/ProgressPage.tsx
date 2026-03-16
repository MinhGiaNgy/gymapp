import { useEffect, useMemo, useState } from 'react';
import { api, type ProgressLog } from '../api';
import { exerciseLibrary } from '../exerciseData';

const toDateInput = (date: Date) => {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
};

const formatWeight = (weight: number) => `${weight.toFixed(1)} lbs`;

const getRating = (logs: ProgressLog[]) => {
  const totalLogs = logs.length;
  const avgWeight = totalLogs
    ? logs.reduce((sum, log) => sum + Number(log.weight), 0) / totalLogs
    : 0;
  const uniqueExercises = new Set(logs.map((log) => log.exerciseSlug)).size;
  const score = totalLogs * 3 + avgWeight / 8 + uniqueExercises * 5;

  if (score < 20) return 'noob';
  if (score < 45) return 'novice';
  if (score < 80) return 'average';
  if (score < 120) return 'pro';
  return 'monster';
};

const ProgressPage = () => {
  const [search, setSearch] = useState('');
  const [selectedExerciseSlug, setSelectedExerciseSlug] = useState(exerciseLibrary[0]?.slug ?? '');
  const [weight, setWeight] = useState('135');
  const [loggedAt, setLoggedAt] = useState(toDateInput(new Date()));
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const exerciseMatches = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return exerciseLibrary.slice(0, 6);
    }
    return exerciseLibrary.filter((exercise) => exercise.name.toLowerCase().includes(term)).slice(0, 6);
  }, [search]);

  const selectedExercise = useMemo(
    () => exerciseLibrary.find((exercise) => exercise.slug === selectedExerciseSlug),
    [selectedExerciseSlug],
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.getProgressLogs(search);
        setLogs(response.logs);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load progress logs.');
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [search]);

  const stats = useMemo(() => {
    const totalLogs = logs.length;
    const averageWeight = totalLogs
      ? logs.reduce((sum, log) => sum + Number(log.weight), 0) / totalLogs
      : 0;
    const maxWeight = totalLogs ? Math.max(...logs.map((log) => Number(log.weight))) : 0;
    const uniqueExercises = new Set(logs.map((log) => log.exerciseSlug)).size;
    const rating = getRating(logs);
    return { totalLogs, averageWeight, maxWeight, uniqueExercises, rating };
  }, [logs]);

  const handleAddLog = async () => {
    if (!selectedExercise) {
      setError('Pick an exercise before logging weight.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await api.createProgressLog({
        exerciseSlug: selectedExercise.slug,
        exerciseName: selectedExercise.name,
        weight: Number.parseFloat(weight),
        loggedAt,
        notes,
      });
      const response = await api.getProgressLogs(search);
      setLogs(response.logs);
      setNotes('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save progress log.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await api.deleteProgressLog(id);
      setLogs((current) => current.filter((log) => log.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete progress log.');
    }
  };

  return (
    <section className="page-panel">
      <div className="page-header">
        <h1>Progress</h1>
      </div>

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="search for an exercise you want to log"
        className="search-input"
      />

      <div className="suggestions-row">
        {exerciseMatches.map((exercise) => (
          <button
            type="button"
            key={exercise.slug}
            className={`suggestion-chip${exercise.slug === selectedExerciseSlug ? ' active' : ''}`}
            onClick={() => {
              setSelectedExerciseSlug(exercise.slug);
              setSearch(exercise.name);
            }}
          >
            {exercise.name}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Logs</h3>
          <p>{stats.totalLogs}</p>
        </div>
        <div className="stat-card">
          <h3>Average Weight</h3>
          <p>{stats.averageWeight ? formatWeight(stats.averageWeight) : '0.0 lbs'}</p>
        </div>
        <div className="stat-card">
          <h3>Max Weight</h3>
          <p>{stats.maxWeight ? formatWeight(stats.maxWeight) : '0.0 lbs'}</p>
        </div>
        <div className="stat-card">
          <h3>Unique Exercises</h3>
          <p>{stats.uniqueExercises}</p>
        </div>
        <div className={`stat-card rating-card ${stats.rating}`}>
          <h3>Rating</h3>
          <p>{stats.rating}</p>
        </div>
      </div>

      <div className="progress-form">
        <label>
          Exercise
          <select
            value={selectedExerciseSlug}
            onChange={(event) => setSelectedExerciseSlug(event.target.value)}
            className="inline-input"
          >
            {exerciseLibrary.map((exercise) => (
              <option key={exercise.slug} value={exercise.slug}>
                {exercise.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Weight (lbs)
          <input
            type="number"
            min={1}
            step={0.5}
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="inline-input"
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={loggedAt}
            onChange={(event) => setLoggedAt(event.target.value)}
            className="inline-input"
          />
        </label>
        <label className="full-width-field">
          Notes
          <input
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional note"
            className="inline-input"
          />
        </label>
        <button type="button" onClick={handleAddLog} className="primary-button" disabled={saving}>
          {saving ? 'Saving...' : 'Log Weight'}
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {loading ? (
        <p className="section-note">Loading logs...</p>
      ) : (
        <div className="log-table-wrapper">
          <table className="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise</th>
                <th>Weight</th>
                <th>Notes</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.loggedAt}</td>
                  <td>{log.exerciseName}</td>
                  <td>{formatWeight(Number(log.weight))}</td>
                  <td>{log.notes || '-'}</td>
                  <td>
                    <button type="button" className="table-action" onClick={() => handleDelete(log.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No logs found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProgressPage;
