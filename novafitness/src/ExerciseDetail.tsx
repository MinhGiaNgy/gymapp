import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ExerciseDetail.css';
import { exerciseDatabase, type ExerciseData } from './exerciseData';

const parseCommaSeparated = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const getYouTubeEmbedUrl = (videoUrl?: string): string | null => {
  if (!videoUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(videoUrl);
    const host = parsedUrl.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        const videoId = parsedUrl.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (parsedUrl.pathname.startsWith('/embed/')) {
        const videoId = parsedUrl.pathname.split('/')[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (parsedUrl.pathname.startsWith('/shorts/')) {
        const videoId = parsedUrl.pathname.split('/')[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const ExerciseDetail = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const exercise = exerciseName ? exerciseDatabase[exerciseName] : null;
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState<ExerciseData | null>(null);

  useEffect(() => {
    setIsEditing(false);
    setEditedExercise(null);
  }, [exerciseName]);

  if (!exercise || !exerciseName) {
    return (
      <div className="exercise-detail">
        <div className="exercise-header">
          <Link to="/" className="back-button">
            Back to Home
          </Link>
          <h1>Exercise Not Found</h1>
        </div>
        <p>The exercise you are looking for does not exist.</p>
      </div>
    );
  }

  const currentExercise = editedExercise || exercise;
  const videoEmbedUrl = getYouTubeEmbedUrl(currentExercise.videoUrl);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedExercise({ ...exercise });
  };

  const handleSave = () => {
    if (!editedExercise) {
      return;
    }

    exerciseDatabase[exerciseName] = { ...editedExercise, slug: exerciseName };
    setIsEditing(false);
    setEditedExercise(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedExercise(null);
  };

  const updateField = <K extends keyof ExerciseData>(field: K, value: ExerciseData[K]) => {
    setEditedExercise((previous) => {
      if (!previous) {
        return previous;
      }

      return { ...previous, [field]: value };
    });
  };

  return (
    <div className="exercise-detail">
      <div className="exercise-header">
        <Link to="/" className="back-button">
          Back to Home
        </Link>

        <div className="header-actions">
          <h1>{currentExercise.name}</h1>
          {!isEditing ? (
            <button type="button" onClick={handleEdit} className="edit-button">
              Edit Exercise
            </button>
          ) : (
            <div className="edit-actions">
              <button type="button" onClick={handleSave} className="save-button">
                Save
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="exercise-content">
        <div className="exercise-meta">
          <span className={`category-badge ${currentExercise.category.toLowerCase()}`}>
            {currentExercise.category}
          </span>
          <span className="difficulty-badge">{currentExercise.difficulty}</span>
        </div>

        <div className="description-section">
          <h3>Description</h3>
          {isEditing ? (
            <textarea
              value={currentExercise.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="edit-textarea"
              rows={4}
            />
          ) : (
            <p>{currentExercise.description}</p>
          )}
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <h4>Target Muscles</h4>
            {isEditing ? (
              <input
                type="text"
                value={currentExercise.targetMuscles.join(', ')}
                onChange={(event) => updateField('targetMuscles', parseCommaSeparated(event.target.value))}
                className="edit-input"
              />
            ) : (
              <ul>
                {currentExercise.targetMuscles.map((muscle) => (
                  <li key={muscle}>{muscle}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="detail-item">
            <h4>Equipment</h4>
            {isEditing ? (
              <input
                type="text"
                value={currentExercise.equipment}
                onChange={(event) => updateField('equipment', event.target.value)}
                className="edit-input"
              />
            ) : (
              <p>{currentExercise.equipment}</p>
            )}
          </div>

          <div className="detail-item full-width">
            <h4>Exercise Tags</h4>
            {isEditing ? (
              <input
                type="text"
                value={currentExercise.tags.join(', ')}
                onChange={(event) => updateField('tags', parseCommaSeparated(event.target.value))}
                className="edit-input"
              />
            ) : (
              <div className="tags-list">
                {currentExercise.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="instructions-section">
          <h3>Instructions</h3>
          {isEditing ? (
            <div>
              {currentExercise.instructions.map((instruction, index) => (
                <div key={`${instruction}-${index}`} className="instruction-edit">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(event) => {
                      const updated = [...currentExercise.instructions];
                      updated[index] = event.target.value;
                      updateField('instructions', updated);
                    }}
                    className="edit-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = currentExercise.instructions.filter((_, itemIndex) => itemIndex !== index);
                      updateField('instructions', updated);
                    }}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateField('instructions', [...currentExercise.instructions, ''])}
                className="add-button"
              >
                Add Instruction
              </button>
            </div>
          ) : (
            <ol>
              {currentExercise.instructions.map((instruction, index) => (
                <li key={`${instruction}-${index}`}>{instruction}</li>
              ))}
            </ol>
          )}
        </div>

        <div className="media-section">
          <h3>Media</h3>

          <div className="images-section">
            <h4>Images</h4>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  placeholder="Add image URLs separated by commas"
                  value={currentExercise.images.join(', ')}
                  onChange={(event) => updateField('images', parseCommaSeparated(event.target.value))}
                  className="edit-input"
                />
                <p className="help-text">Separate multiple image URLs with commas.</p>
              </div>
            ) : (
              <div className="image-gallery">
                {currentExercise.images.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${currentExercise.name} ${index + 1}`} className="exercise-image" />
                ))}
              </div>
            )}
          </div>

          <div className="video-section">
            <h4>Video Tutorial</h4>
            {isEditing ? (
              <input
                type="url"
                placeholder="YouTube URL"
                value={currentExercise.videoUrl || ''}
                onChange={(event) => updateField('videoUrl', event.target.value)}
                className="edit-input"
              />
            ) : videoEmbedUrl ? (
              <div className="video-wrapper">
                <iframe
                  className="tutorial-video"
                  src={videoEmbedUrl}
                  title={`${currentExercise.name} tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <a href={currentExercise.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                  Open on YouTube
                </a>
              </div>
            ) : currentExercise.videoUrl ? (
              <a href={currentExercise.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                Open Tutorial Link
              </a>
            ) : (
              <p className="no-video">No video tutorial available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
