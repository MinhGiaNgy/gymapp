import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import './ExerciseDetail.css';

interface ExerciseData {
  name: string;
  category: string;
  description: string;
  instructions: string[];
  targetMuscles: string[];
  equipment: string;
  difficulty: string;
  images: string[];
  videoUrl?: string;
}

const exerciseDatabase: Record<string, ExerciseData> = {
  'bench-press': {
    name: 'Bench Press',
    category: 'Push',
    description: 'The bench press is a compound exercise that primarily targets the chest, shoulders, and triceps.',
    instructions: [
      'Lie flat on the bench with your eyes under the barbell',
      'Grip the bar slightly wider than shoulder-width',
      'Lower the bar to your chest with control',
      'Press the bar back up to the starting position',
      'Keep your feet flat on the floor throughout the movement'
    ],
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Barbell, Bench',
    difficulty: 'Intermediate',
    images: ['/images/david-laid.png'],
    videoUrl: ''
  },
  'shoulder-press': {
    name: 'Shoulder Press',
    category: 'Push',
    description: 'The shoulder press is an excellent exercise for building shoulder strength and size.',
    instructions: [
      'Sit or stand with the weight at shoulder level',
      'Keep your core tight and back straight',
      'Press the weight straight up overhead',
      'Lower the weight back to shoulder level with control',
      'Avoid arching your back during the movement'
    ],
    targetMuscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    equipment: 'Dumbbells or Barbell',
    difficulty: 'Beginner',
    images: ['/images/david-laid.png'],
    videoUrl: ''
  },
  'hammer-curls': {
    name: 'Hammer Curls',
    category: 'Pull',
    description: 'Hammer curls target the biceps and forearms with a neutral grip position.',
    instructions: [
      'Hold dumbbells with a neutral (hammer) grip',
      'Keep your elbows close to your sides',
      'Curl the weights up towards your shoulders',
      'Squeeze at the top of the movement',
      'Lower the weights slowly to the starting position'
    ],
    targetMuscles: ['Biceps', 'Forearms', 'Brachialis'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    images: ['/images/david-laid.png'],
    videoUrl: ''
  },
  'lat-pulldown': {
    name: 'Lat Pulldown',
    category: 'Pull',
    description: 'The lat pulldown is a great exercise for building back width and strength.',
    instructions: [
      'Sit at the lat pulldown machine',
      'Grip the bar wider than shoulder-width',
      'Pull the bar down to your upper chest',
      'Squeeze your shoulder blades together',
      'Slowly return the bar to the starting position'
    ],
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps'],
    equipment: 'Lat Pulldown Machine',
    difficulty: 'Beginner',
    images: ['/images/david-laid.png'],
    videoUrl: ''
  },
  'squats': {
    name: 'Squats',
    category: 'Legs',
    description: 'Squats are the king of leg exercises, working the entire lower body.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core tight',
      'Lower down as if sitting in a chair',
      'Go down until thighs are parallel to the floor',
      'Drive through your heels to return to standing'
    ],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    equipment: 'Barbell or Bodyweight',
    difficulty: 'Intermediate',
    images: ['/images/david-laid.png'],
    videoUrl: ''
  },
  'lunges': {
    name: 'Lunges',
    category: 'Legs',
    description: 'Lunges are a unilateral exercise that improves balance and leg strength.',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower your body until both knees are at 90 degrees',
      'Push back to the starting position',
      'Repeat with the other leg'
    ],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    equipment: 'Dumbbells or Bodyweight',
    difficulty: 'Beginner',
    images: ['/images/david-laid.png'],
    videoUrl: ''
  }
};

const ExerciseDetail = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState<ExerciseData | null>(null);

  const exercise = exerciseName ? exerciseDatabase[exerciseName] : null;

  if (!exercise) {
    return (
      <div className="exercise-detail">
        <div className="exercise-header">
          <Link to="/" className="back-button">← Back to Home</Link>
          <h1>Exercise Not Found</h1>
        </div>
        <p>The exercise you're looking for doesn't exist.</p>
      </div>
    );
  }

  const currentExercise = editedExercise || exercise;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedExercise({ ...exercise });
  };

  const handleSave = () => {
    if (editedExercise && exerciseName) {
      exerciseDatabase[exerciseName] = editedExercise;
      setIsEditing(false);
      setEditedExercise(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedExercise(null);
  };

  const updateField = (field: keyof ExerciseData, value: any) => {
    if (editedExercise) {
      setEditedExercise({ ...editedExercise, [field]: value });
    }
  };

  return (
    <div className="exercise-detail">
      <div className="exercise-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <div className="header-actions">
          <h1>{currentExercise.name}</h1>
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-button">Edit Exercise</button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div className="exercise-content">
        <div className="exercise-info">
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
                onChange={(e) => updateField('description', e.target.value)}
                className="edit-textarea"
                rows={3}
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
                  onChange={(e) => updateField('targetMuscles', e.target.value.split(', '))}
                  className="edit-input"
                />
              ) : (
                <ul>
                  {currentExercise.targetMuscles.map((muscle, index) => (
                    <li key={index}>{muscle}</li>
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
                  onChange={(e) => updateField('equipment', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <p>{currentExercise.equipment}</p>
              )}
            </div>
          </div>

          <div className="instructions-section">
            <h3>Instructions</h3>
            {isEditing ? (
              <div>
                {currentExercise.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-edit">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...currentExercise.instructions];
                        newInstructions[index] = e.target.value;
                        updateField('instructions', newInstructions);
                      }}
                      className="edit-input"
                    />
                    <button
                      onClick={() => {
                        const newInstructions = currentExercise.instructions.filter((_, i) => i !== index);
                        updateField('instructions', newInstructions);
                      }}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updateField('instructions', [...currentExercise.instructions, ''])}
                  className="add-button"
                >
                  Add Instruction
                </button>
              </div>
            ) : (
              <ol>
                {currentExercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
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
                    placeholder="Add image URL"
                    value={currentExercise.images.join(', ')}
                    onChange={(e) => updateField('images', e.target.value.split(', ').filter(url => url.trim()))}
                    className="edit-input"
                  />
                  <p className="help-text">Separate multiple image URLs with commas</p>
                </div>
              ) : (
                <div className="image-gallery">
                  {currentExercise.images.map((image, index) => (
                    <img key={index} src={image} alt={`${currentExercise.name} ${index + 1}`} className="exercise-image" />
                  ))}
                </div>
              )}
            </div>

            <div className="video-section">
              <h4>Video Tutorial</h4>
              {isEditing ? (
                <input
                  type="url"
                  placeholder="YouTube URL (optional)"
                  value={currentExercise.videoUrl || ''}
                  onChange={(e) => updateField('videoUrl', e.target.value)}
                  className="edit-input"
                />
              ) : (
                currentExercise.videoUrl ? (
                  <a href={currentExercise.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
                    🎥 Watch Tutorial on YouTube
                  </a>
                ) : (
                  <p className="no-video">No video tutorial available</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
