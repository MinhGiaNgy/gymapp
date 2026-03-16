import { useEffect, useMemo, useState } from 'react';
import { api, type WorkoutPlan } from '../api';
import { exerciseLibrary } from '../exerciseData';
import { useAuth } from '../auth/useAuth';
import AuthPrompt from '../components/AuthPrompt';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toDateInput = (date: Date) => {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
};

const toMonthInput = (date: Date) => toDateInput(date).slice(0, 7);

const shiftMonth = (monthValue: string, delta: number) => {
  const [yearRaw, monthRaw] = monthValue.split('-');
  const year = Number.parseInt(yearRaw, 10);
  const month = Number.parseInt(monthRaw, 10);
  return toMonthInput(new Date(year, month - 1 + delta, 1));
};

const buildCalendarDays = (monthValue: string) => {
  const [yearRaw, monthRaw] = monthValue.split('-');
  const year = Number.parseInt(yearRaw, 10);
  const month = Number.parseInt(monthRaw, 10);

  const firstDay = new Date(year, month - 1, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const firstCellDate = new Date(year, month - 1, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCellDate);
    date.setDate(firstCellDate.getDate() + index);
    return {
      date: toDateInput(date),
      dayNumber: date.getDate(),
      inCurrentMonth: date.getMonth() === month - 1,
    };
  });
};

const downloadCsv = (plans: WorkoutPlan[], month: string) => {
  const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const lines = [
    ['Date', 'Exercise', 'Sets', 'Reps', 'Notes'].map(escapeCsv).join(','),
    ...plans
      .sort((a, b) => a.planDate.localeCompare(b.planDate))
      .map((plan) =>
        [plan.planDate, plan.exerciseName, plan.sets, plan.reps, plan.notes].map(escapeCsv).join(','),
      ),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `workout-plan-${month}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const WorkoutPlanPage = () => {
  const { user } = useAuth();
  const [month, setMonth] = useState(toMonthInput(new Date()));
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [exerciseSlug, setExerciseSlug] = useState(exerciseLibrary[0]?.slug ?? '');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [notes, setNotes] = useState('');
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [guestPromptMessage, setGuestPromptMessage] = useState('');

  const calendarDays = useMemo(() => buildCalendarDays(month), [month]);

  const plansByDate = useMemo(() => {
    return plans.reduce<Record<string, WorkoutPlan[]>>((grouped, plan) => {
      if (!grouped[plan.planDate]) {
        grouped[plan.planDate] = [];
      }
      grouped[plan.planDate].push(plan);
      return grouped;
    }, {});
  }, [plans]);

  useEffect(() => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    const loadPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.getWorkoutPlans(month);
        setPlans(response.plans);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load workout plans.');
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [month, user]);

  const handleAddBlock = async () => {
    if (!user) {
      setGuestPromptMessage('Create and save workout plan blocks after signing up or logging in.');
      return;
    }

    const exercise = exerciseLibrary.find((item) => item.slug === exerciseSlug);
    if (!exercise) {
      setError('Please pick an exercise block.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await api.createWorkoutPlan({
        planDate: selectedDate,
        exerciseSlug: exercise.slug,
        exerciseName: exercise.name,
        sets,
        reps,
        notes,
      });
      const response = await api.getWorkoutPlans(month);
      setPlans(response.plans);
      setNotes('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save workout block.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!user) {
      setGuestPromptMessage('Log in to edit or delete saved workout blocks.');
      return;
    }

    setError('');
    try {
      await api.deleteWorkoutPlan(id);
      setPlans((current) => current.filter((plan) => plan.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to remove workout block.');
    }
  };

  return (
    <section className="page-panel">
      <div className="page-header">
        <h1>Workout Plan</h1>
        <div className="header-actions-row">
          <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} className="small-button">
            Prev Month
          </button>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="inline-input month-input"
          />
          <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} className="small-button">
            Next Month
          </button>
          <button
            type="button"
            className="small-button export-button"
            onClick={() => {
              if (!user) {
                setGuestPromptMessage('Exporting plans is available after sign up or login.');
                return;
              }
              downloadCsv(plans, month);
            }}
          >
            Export to Excel (.csv)
          </button>
        </div>
      </div>

      <p className="section-note">
        Create exercise blocks and place them on the calendar. Your plan is tied to your account email.
      </p>
      {!user ? (
        <AuthPrompt
          message={
            guestPromptMessage ||
            'You are using guest mode. Sign up or log in to create, save, and export your workout plans.'
          }
        />
      ) : null}

      <div className="block-picker">
        {exerciseLibrary.slice(0, 8).map((exercise) => (
          <button
            type="button"
            key={exercise.slug}
            className={`block-chip${exercise.slug === exerciseSlug ? ' active' : ''}`}
            onClick={() => setExerciseSlug(exercise.slug)}
          >
            {exercise.name}
          </button>
        ))}
      </div>

      <div className="workout-form">
        <label>
          Plan Date
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="inline-input"
          />
        </label>
        <label>
          Exercise Block
          <select
            value={exerciseSlug}
            onChange={(event) => setExerciseSlug(event.target.value)}
            className="inline-input"
          >
            {exerciseLibrary.map((exercise) => (
              <option value={exercise.slug} key={exercise.slug}>
                {exercise.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sets
          <input
            type="number"
            min={1}
            max={20}
            value={sets}
            onChange={(event) => setSets(Number.parseInt(event.target.value, 10) || 1)}
            className="inline-input"
          />
        </label>
        <label>
          Reps
          <input
            type="number"
            min={1}
            max={200}
            value={reps}
            onChange={(event) => setReps(Number.parseInt(event.target.value, 10) || 1)}
            className="inline-input"
          />
        </label>
        <label className="full-width-field">
          Notes
          <input
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional notes"
            className="inline-input"
          />
        </label>
        <button type="button" onClick={handleAddBlock} className="primary-button" disabled={saving}>
          {saving ? 'Saving...' : user ? 'Add to Calendar' : 'Add to Calendar (Login Required)'}
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {loading ? (
        <p className="section-note">Loading workout calendar...</p>
      ) : (
        <div className="calendar-wrapper">
          <div className="calendar-weekdays">
            {weekdays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className={`calendar-day${day.inCurrentMonth ? '' : ' muted'}${
                  day.date === selectedDate ? ' selected' : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className="day-number">{day.dayNumber}</span>
                <div className="day-items">
                  {(plansByDate[day.date] ?? []).map((plan) => (
                    <div className="day-item" key={plan.id}>
                      <span>{plan.exerciseName}</span>
                      <span>
                        {plan.sets}x{plan.reps}
                      </span>
                      <button type="button" onClick={() => handleDeleteBlock(plan.id)}>
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkoutPlanPage;
