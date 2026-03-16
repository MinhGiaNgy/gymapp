export type ExerciseCategory = 'Push' | 'Pull' | 'Legs' | 'Core';
export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ExerciseData {
  slug: string;
  name: string;
  category: ExerciseCategory;
  description: string;
  instructions: string[];
  targetMuscles: string[];
  equipment: string;
  difficulty: ExerciseDifficulty;
  images: string[];
  videoUrl?: string;
  tags: string[];
}

const placeholderImage = '/images/david-laid.png';

export const exerciseLibrary: ExerciseData[] = [
  {
    slug: 'bench-press',
    name: 'Bench Press',
    category: 'Push',
    description: 'A foundational chest press that builds upper-body strength through the chest, triceps, and front delts.',
    instructions: [
      'Lie on the bench with eyes under the bar and feet planted.',
      'Grip the bar slightly wider than shoulder width.',
      'Unrack and lower with control to mid-chest.',
      'Press up while keeping your upper back tight.',
      'Lock out without overextending your shoulders.',
    ],
    targetMuscles: ['Chest', 'Triceps', 'Front Delts'],
    equipment: 'Barbell, Bench',
    difficulty: 'Intermediate',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=SCVCLChPQFY',
    tags: ['Compound', 'Strength', 'Upper Body'],
  },
  {
    slug: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'Push',
    description: 'An overhead press variation that develops shoulder strength and upper-body stability.',
    instructions: [
      'Start with dumbbells or barbell at shoulder level.',
      'Brace core and squeeze glutes to avoid low-back arching.',
      'Press straight overhead until elbows are extended.',
      'Lower back to shoulder level with full control.',
      'Repeat while keeping wrists stacked over elbows.',
    ],
    targetMuscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    equipment: 'Dumbbells or Barbell',
    difficulty: 'Beginner',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    tags: ['Press', 'Hypertrophy', 'Upper Body'],
  },
  {
    slug: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Push',
    description: 'Targets upper chest fibers while improving unilateral pressing control and shoulder balance.',
    instructions: [
      'Set bench to a slight incline and sit with dumbbells on thighs.',
      'Kick dumbbells up and keep shoulders retracted.',
      'Lower elbows on a controlled arc until chest stretch.',
      'Press up and inward while keeping wrists neutral.',
      'Avoid bouncing or flaring elbows aggressively.',
    ],
    targetMuscles: ['Upper Chest', 'Triceps', 'Front Delts'],
    equipment: 'Incline Bench, Dumbbells',
    difficulty: 'Intermediate',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    tags: ['Upper Chest', 'Dumbbell', 'Compound'],
  },
  {
    slug: 'hammer-curls',
    name: 'Hammer Curls',
    category: 'Pull',
    description: 'A neutral-grip curl that emphasizes brachialis and forearm development.',
    instructions: [
      'Stand tall with dumbbells at your sides and thumbs forward.',
      'Keep elbows tucked and curl without swinging.',
      'Pause and squeeze at the top.',
      'Lower slowly to full extension.',
      'Maintain a steady tempo through all reps.',
    ],
    targetMuscles: ['Biceps', 'Brachialis', 'Forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    tags: ['Isolation', 'Arms', 'Grip'],
  },
  {
    slug: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Pull',
    description: 'Builds back width and teaches vertical pulling mechanics for stronger pull-ups.',
    instructions: [
      'Sit firmly with knees secured under pads.',
      'Grip bar slightly wider than shoulder width.',
      'Pull elbows down toward your sides.',
      'Pause briefly at upper chest level.',
      'Return slowly to full stretch overhead.',
    ],
    targetMuscles: ['Lats', 'Rhomboids', 'Biceps'],
    equipment: 'Lat Pulldown Machine',
    difficulty: 'Beginner',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    tags: ['Back', 'Machine', 'Vertical Pull'],
  },
  {
    slug: 'barbell-row',
    name: 'Barbell Row',
    category: 'Pull',
    description: 'A horizontal pull that adds upper-back thickness and posterior chain control.',
    instructions: [
      'Hinge at hips with neutral spine and slight knee bend.',
      'Grip bar just outside knees and brace hard.',
      'Row bar toward lower ribcage.',
      'Squeeze shoulder blades together at top.',
      'Lower bar under control without rounding back.',
    ],
    targetMuscles: ['Lats', 'Mid Back', 'Rear Delts'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=vT2GjY_Umpw',
    tags: ['Compound', 'Back Thickness', 'Strength'],
  },
  {
    slug: 'squats',
    name: 'Squats',
    category: 'Legs',
    description: 'A total lower-body strength movement emphasizing quads, glutes, and core stability.',
    instructions: [
      'Set feet shoulder width and brace your core.',
      'Sit down and back while keeping chest lifted.',
      'Track knees over toes as you descend.',
      'Reach depth with control and no collapse.',
      'Drive through mid-foot to stand tall.',
    ],
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    equipment: 'Barbell or Bodyweight',
    difficulty: 'Intermediate',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    tags: ['Compound', 'Lower Body', 'Power'],
  },
  {
    slug: 'lunges',
    name: 'Lunges',
    category: 'Legs',
    description: 'A unilateral movement that improves lower-body balance, control, and symmetry.',
    instructions: [
      'Stand tall with feet hip width apart.',
      'Step forward and lower both knees to about 90 degrees.',
      'Keep torso upright and front heel grounded.',
      'Push through front foot to return.',
      'Alternate sides with controlled reps.',
    ],
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    equipment: 'Bodyweight or Dumbbells',
    difficulty: 'Beginner',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    tags: ['Unilateral', 'Mobility', 'Stability'],
  },
  {
    slug: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Legs',
    description: 'Hip-hinge accessory focused on posterior chain strength and hamstring length under load.',
    instructions: [
      'Stand with soft knees and bar close to thighs.',
      'Push hips back while keeping spine neutral.',
      'Lower until hamstrings are stretched.',
      'Drive hips forward to return upright.',
      'Keep bar close to legs throughout motion.',
    ],
    targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: 'Barbell or Dumbbells',
    difficulty: 'Intermediate',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=2SHsk9AzdjA',
    tags: ['Posterior Chain', 'Hinge', 'Strength'],
  },
  {
    slug: 'plank',
    name: 'Plank',
    category: 'Core',
    description: 'A static bracing drill that trains full-body tension and anti-extension core strength.',
    instructions: [
      'Set forearms under shoulders and extend legs back.',
      'Squeeze glutes and brace abs hard.',
      'Maintain straight line from head to heels.',
      'Breathe slowly while holding tension.',
      'Stop before hips sag or pike up.',
    ],
    targetMuscles: ['Abdominals', 'Obliques', 'Lower Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    tags: ['Core', 'Isometric', 'Stability'],
  },
  {
    slug: 'hanging-knee-raise',
    name: 'Hanging Knee Raise',
    category: 'Core',
    description: 'Dynamic core movement that builds lower-ab strength while improving hanging control.',
    instructions: [
      'Hang from a pull-up bar with shoulders active.',
      'Brace your core before each rep.',
      'Raise knees toward chest without swinging.',
      'Pause at top and lower slowly.',
      'Keep reps smooth and controlled.',
    ],
    targetMuscles: ['Lower Abs', 'Hip Flexors', 'Grip'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    images: [placeholderImage],
    videoUrl: 'https://www.youtube.com/watch?v=3f0XQqQGAb4',
    tags: ['Core', 'Bodyweight', 'Control'],
  },
];

export const exerciseDatabase: Record<string, ExerciseData> = exerciseLibrary.reduce(
  (database, exercise) => {
    database[exercise.slug] = exercise;
    return database;
  },
  {} as Record<string, ExerciseData>,
);
