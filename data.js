export const YOGA_POSES = [
  {
    id: "mountain-pose",
    name: "Mountain Pose",
    sanskrit: "Tadasana",
    category: "Hatha",
    difficulty: "Beginner",
    duration: "60s",
    benefits: [
      "Improves posture and body alignment",
      "Strengthens thighs, knees, and ankles",
      "Firms abdomen and buttocks",
      "Reduces flat feet symptoms"
    ],
    instructions: [
      "Stand with your big toes touching, heels slightly apart. Ground your weight evenly across your feet.",
      "Engage your quadriceps, draw your kneecaps up, and lift through the arches of your feet.",
      "Roll your shoulders back and down, allowing your arms to hang naturally by your sides with palms facing forward.",
      "Lengthen your neck, look straight ahead, and breathe deeply into your chest for 1 minute."
    ],
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    description: "The foundational posture for all standing yoga poses, promoting grounding, presence, and perfect skeletal alignment.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <!-- Ground line -->
      <line x1="20" y1="90" x2="80" y2="90" stroke-opacity="0.3" />
      <!-- Standing figure -->
      <circle cx="50" cy="20" r="6" />
      <line x1="50" y1="26" x2="50" y2="60" />
      <!-- Left Leg -->
      <line x1="50" y1="60" x2="47" y2="90" />
      <!-- Right Leg -->
      <line x1="50" y1="60" x2="53" y2="90" />
      <!-- Arms straight down -->
      <line x1="50" y1="32" x2="42" y2="58" />
      <line x1="50" y1="32" x2="58" y2="58" />
    </svg>`
  },
  {
    id: "downward-dog",
    name: "Downward-Facing Dog",
    sanskrit: "Adho Mukha Svanasana",
    category: "Vinyasa",
    difficulty: "Beginner",
    duration: "45s",
    benefits: [
      "Stretches the shoulders, hamstrings, and calves",
      "Strengthens the arms and legs",
      "Energizes the body and relieves stress",
      "Improves blood circulation to the brain"
    ],
    instructions: [
      "Start on your hands and knees, with wrists directly under shoulders and knees under hips.",
      "Spread your fingers wide, press firmly through your palms, and tuck your toes.",
      "Exhale and lift your knees away from the floor, pushing your hips up and back toward the ceiling.",
      "Keep a slight bend in your knees if hamstrings are tight, and press your heels down toward the mat."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    description: "One of the most widely recognized yoga poses, downward dog is an inversion that builds upper body strength and stretches the posterior chain.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Inverted V shape -->
      <!-- Hands point -->
      <!-- Feet point: 25,85. Hips: 50,30. Hands: 75,85 -->
      <!-- Head -->
      <circle cx="62" cy="50" r="5" />
      <!-- Torso -->
      <line x1="50" y1="35" x2="68" y2="60" />
      <!-- Arms -->
      <line x1="68" y1="60" x2="78" y2="85" />
      <!-- Legs -->
      <line x1="50" y1="35" x2="28" y2="85" />
    </svg>`
  },
  {
    id: "warrior-two",
    name: "Warrior II",
    sanskrit: "Virabhadrasana II",
    category: "Vinyasa",
    difficulty: "Intermediate",
    duration: "30s",
    benefits: [
      "Strengthens legs, ankles, and core stabilizers",
      "Stretches groin, chest, and shoulder muscles",
      "Increases stamina and physical endurance",
      "Develops deep focus and determination"
    ],
    instructions: [
      "Stand with feet wide apart (about 3.5 to 4 feet). Turn your right foot out 90 degrees and left foot in slightly.",
      "Inhale and raise your arms parallel to the floor, extending them actively out to the sides, palms down.",
      "Exhale and bend your right knee over the right ankle, keeping the thigh parallel to the floor.",
      "Keep the torso upright and turn your head to look out over the fingers of your right hand."
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600",
    description: "An active, powerful posture celebrating strength, stability, and focus, named after the mythical warrior Virabhadra.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Warrior outline -->
      <circle cx="50" cy="25" r="5" />
      <!-- Spine/Torso -->
      <line x1="50" y1="30" x2="50" y2="55" />
      <!-- Left leg straight back -->
      <line x1="50" y1="55" x2="25" y2="85" />
      <!-- Right leg bent forward -->
      <line x1="50" y1="55" x2="65" y2="65" />
      <line x1="65" y1="65" x2="65" y2="85" />
      <!-- Arms horizontal -->
      <line x1="25" y1="35" x2="75" y2="35" />
    </svg>`
  },
  {
    id: "tree-pose",
    name: "Tree Pose",
    sanskrit: "Vrksasana",
    category: "Hatha",
    difficulty: "Beginner",
    duration: "45s",
    benefits: [
      "Develops balance, composure, and poise",
      "Strengthens tendons and ligaments in the feet",
      "Stretches the inner thighs, chest, and shoulders",
      "Calms the nervous system and sharpens concentration"
    ],
    instructions: [
      "Stand in Mountain Pose. Shift your weight onto your left foot, keeping it rooted.",
      "Bend your right knee and place the sole of your right foot onto your inner left calf or thigh (avoid the knee).",
      "Bring your hands to your chest in prayer position (Anjali Mudra).",
      "Once balanced, raise your arms overhead like branches, extending upward toward the sky."
    ],
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=600",
    description: "An elegant balancing pose that mimics the steady, grounded, and upright stature of a tree, cultivating mental calmness and coordination.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="20" y1="90" x2="80" y2="90" stroke-opacity="0.3" />
      <!-- Head -->
      <circle cx="50" cy="18" r="5" />
      <!-- Torso -->
      <line x1="50" y1="23" x2="50" y2="55" />
      <!-- Root Leg -->
      <line x1="50" y1="55" x2="50" y2="90" />
      <!-- Bent Leg (sole touching inner thigh) -->
      <line x1="50" y1="55" x2="62" y2="68" />
      <line x1="62" y1="68" x2="50" y2="70" />
      <!-- Hands overhead in Namaste -->
      <line x1="50" y1="23" x2="40" y2="35" />
      <line x1="40" y1="35" x2="50" y2="10" />
      <line x1="50" y1="23" x2="60" y2="35" />
      <line x1="60" y1="35" x2="50" y2="10" />
    </svg>`
  },
  {
    id: "cobra-pose",
    name: "Cobra Pose",
    sanskrit: "Bhujangasana",
    category: "Vinyasa",
    difficulty: "Beginner",
    duration: "30s",
    benefits: [
      "Strengthens the spine and back muscles",
      "Opens the chest, lungs, shoulders, and abdomen",
      "Stimulates abdominal organs and digestion",
      "Relieves fatigue, stress, and therapeutic for asthma"
    ],
    instructions: [
      "Lie flat on your stomach with your legs extended straight back and tops of feet flat on the mat.",
      "Place your hands under your shoulders, hugging your elbows close to your torso.",
      "Inhale and lift your chest off the floor by straightening your arms, keeping thighs and hips pressed down.",
      "Keep your shoulders relaxed away from your ears, and gaze slightly upward."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600",
    description: "A gentle backbend that opens the heart and chest, rejuvenating the spine and counteracting the effects of prolonged sitting.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Cobra curve lying down -->
      <!-- Head: 65, 45 -->
      <circle cx="65" cy="45" r="5" />
      <!-- Chest/Torso curve -->
      <path d="M15,80 C40,80 50,75 58,62 C62,56 64,52 65,50" />
      <!-- Arm support -->
      <line x1="58" y1="62" x2="58" y2="85" />
    </svg>`
  },
  {
    id: "triangle-pose",
    name: "Triangle Pose",
    sanskrit: "Trikonasana",
    category: "Hatha",
    difficulty: "Intermediate",
    duration: "45s",
    benefits: [
      "Stretches and strengthens thighs, knees, and ankles",
      "Stretches hips, groins, hamstrings, calves, and chest",
      "Stimulates abdominal organs and improves digestion",
      "Relieves backache, anxiety, and mild depression"
    ],
    instructions: [
      "Stand with feet wide apart. Turn right foot out 90 degrees and left foot in 15 degrees.",
      "Extend arms out to the sides parallel to the floor, palms down.",
      "Reach the right torso forward directly over the right leg, bending from the hip joint, not the waist.",
      "Lower your right hand toward the floor/ankle and sweep the left hand straight up toward the sky."
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    description: "A fundamental standing pose that improves hip flexibility and tests core stability, forming the shape of a geometric triangle.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Head -->
      <circle cx="58" cy="35" r="5" />
      <!-- Spine -->
      <line x1="58" y1="40" x2="50" y2="60" />
      <!-- Left arm (upward) -->
      <line x1="58" y1="40" x2="58" y2="10" />
      <!-- Right arm (downward) -->
      <line x1="58" y1="40" x2="58" y2="75" />
      <!-- Legs (Triangle shape) -->
      <line x1="50" y1="60" x2="25" y2="85" />
      <line x1="50" y1="60" x2="70" y2="85" />
    </svg>`
  },
  {
    id: "bridge-pose",
    name: "Bridge Pose",
    sanskrit: "Setu Bandha Sarvangasana",
    category: "Restorative",
    difficulty: "Beginner",
    duration: "60s",
    benefits: [
      "Stretches the chest, neck, spine, and thighs",
      "Calms the brain and helps alleviate stress",
      "Stimulates abdominal organs, lungs, and thyroid",
      "Reduces anxiety, fatigue, backache, and headache"
    ],
    instructions: [
      "Lie on your back, bend your knees, and place your feet flat on the floor, hip-width apart.",
      "Extend your arms by your sides, palms facing down, fingers touching your heels.",
      "Press your feet and arms into the floor, inhale, and lift your hips toward the ceiling.",
      "Clasp your hands under your back, roll your shoulders under, and lift your chest."
    ],
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600",
    description: "A calming backbend that rejuvenates the nervous system and relieves lower back tension, establishing a bridge structure.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Arch shape for Bridge -->
      <!-- Head: 18, 80 -->
      <circle cx="18" cy="80" r="5" />
      <!-- Shoulder to Bridge Peak: 18,80 -> 23,80 -> 50,55 -> 75,85 -->
      <path d="M18,80 C32,80 36,55 50,55 C64,55 68,85 75,85" />
      <!-- Arms straight on ground -->
      <line x1="23" y1="80" x2="55" y2="80" />
    </svg>`
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    sanskrit: "Balasana",
    category: "Restorative",
    difficulty: "Beginner",
    duration: "90s",
    benefits: [
      "Gently stretches the hips, thighs, and ankles",
      "Calms the mind, relieving stress and fatigue",
      "Relieves back and neck pain when supported",
      "Restores emotional balance and steady breathing"
    ],
    instructions: [
      "Kneel on the floor with your big toes touching and sit back on your heels. Separate knees hip-width.",
      "Exhale and lower your torso down between your thighs, resting your forehead on the mat.",
      "Extend your arms forward with palms down, stretching your shoulders.",
      "Allow your chest to sink heavily into the mat and breathe deeply."
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    description: "An essential resting posture in yoga, offering a safe, quiet shelter to restore breathing, calm the senses, and ease muscular tension.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Lying kneeling curled up -->
      <!-- Feet: 25, 80. Hips: 32, 70. Head: 60, 80 -->
      <circle cx="60" cy="80" r="5" />
      <!-- Back spine curve -->
      <path d="M25,82 C28,68 45,62 58,78" />
      <!-- Arm extended forward -->
      <line x1="58" y1="78" x2="80" y2="83" />
    </svg>`
  },
  {
    id: "pigeon-pose",
    name: "One-Legged King Pigeon Pose",
    sanskrit: "Eka Pada Rajakapotasana",
    category: "Yin",
    difficulty: "Advanced",
    duration: "90s",
    benefits: [
      "Opens the chest and shoulders",
      "Deeply stretches the groin, gluteus, and hip flexors",
      "Stimulates internal abdominal organs",
      "Alleviates lower back pain and increases hip mobility"
    ],
    instructions: [
      "From Downward Dog, bring your right knee forward and place it behind your right wrist.",
      "Angle your right shin towards your left hip, and slide your left leg straight back behind you.",
      "Inhale and lift your torso tall. Exhale, walk your hands forward, and lower your chest toward your shin.",
      "Rest your forehead on your hands or the mat, breathing into the tight spots for up to 90 seconds."
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    description: "A profound hip-opening posture that releases emotional tension, deeply stretching key leg and gluteal muscles.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Pigeon silhouette -->
      <!-- Head: 55, 45 -->
      <circle cx="55" cy="45" r="5" />
      <!-- Body/Spine -->
      <path d="M22,80 C40,82 45,78 50,60 C53,51 55,50 55,50" />
      <!-- Front bent leg -->
      <path d="M50,60 C48,70 58,80 65,82" />
    </svg>`
  },
  {
    id: "crow-pose",
    name: "Crow Pose",
    sanskrit: "Bakasana",
    category: "Vinyasa",
    difficulty: "Advanced",
    duration: "30s",
    benefits: [
      "Strengthens wrists, forearms, arms, and shoulders",
      "Significantly increases core muscular control",
      "Stretches the upper back and inner groins",
      "Improves balance and body coordination"
    ],
    instructions: [
      "Squat down with feet together and knees apart. Place palms flat on the mat, shoulder-width apart.",
      "Bend your elbows slightly, making a shelf with your upper arms.",
      "Rest your knees high up against the back of your triceps/armpits.",
      "Shift your weight forward onto your hands, lift your toes off the mat, and engage your core to balance."
    ],
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=600",
    description: "The primary arm balancing pose, challenging core strength and body awareness as you fly with your knees on your arms.",
    svgMarkup: `<svg viewBox="0 0 100 100" width="80" height="80" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="15" y1="85" x2="85" y2="85" stroke-opacity="0.3" />
      <!-- Balancing crow shape -->
      <!-- Head: 68, 62 -->
      <circle cx="68" cy="62" r="5" />
      <!-- Torso: 40, 50 -->
      <path d="M35,62 C40,48 55,48 64,59" />
      <!-- Support arm -->
      <line x1="55" y1="55" x2="52" y2="85" />
      <!-- Bent feet tucked up -->
      <path d="M35,62 C32,66 38,72 43,68" />
    </svg>`
  }
];

export const YOGA_ROUTINES = [
  {
    id: "morning-energizer",
    name: "Morning Energizing Flow",
    duration: "15 mins",
    difficulty: "Beginner",
    focus: "Prana & Energy Flow",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    posterUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    description: "Start your morning with deep breathing and foundational warmups. Boost focus, clear mental blockages, and charge your metabolic core.",
    poses: [
      { poseId: "child-pose", duration: "120s" },
      { poseId: "cobra-pose", duration: "60s" },
      { poseId: "downward-dog", duration: "90s" },
      { poseId: "warrior-two", duration: "60s" },
      { poseId: "triangle-pose", duration: "60s" },
      { poseId: "mountain-pose", duration: "120s" }
    ]
  },
  {
    id: "deep-restorative",
    name: "Deep Restorative Flow",
    duration: "20 mins",
    difficulty: "Beginner",
    focus: "Stress Relief & Relaxation",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    description: "Unwind your body from muscular stress. Focus on slowing your heart rate, restoring breathing sequences, and opening joints safely.",
    poses: [
      { poseId: "child-pose", duration: "180s" },
      { poseId: "bridge-pose", duration: "120s" },
      { poseId: "tree-pose", duration: "90s" },
      { poseId: "child-pose", duration: "120s" }
    ]
  },
  {
    id: "core-balance",
    name: "Core & Balance Challenge",
    duration: "25 mins",
    difficulty: "Intermediate",
    focus: "Strength, Stability, Core Flow",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600",
    description: "Develop structural alignment, wrist strength, and balance through dynamic core postures, leading to arm balances and deep hip releases.",
    poses: [
      { poseId: "mountain-pose", duration: "60s" },
      { poseId: "tree-pose", duration: "120s" },
      { poseId: "downward-dog", duration: "120s" },
      { poseId: "warrior-two", duration: "120s" },
      { poseId: "crow-pose", duration: "60s" },
      { poseId: "pigeon-pose", duration: "120s" }
    ]
  }
];
