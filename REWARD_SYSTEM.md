# ATaskPrompt Reward System

## Overview

The reward system in ATaskPrompt is designed to provide positive reinforcement for task completion, helping users with ADHD and autism spectrum disorders stay motivated and engaged. The system combines visual, auditory, and achievement-based rewards to create a satisfying experience.

## Reward Types

### 1. Visual Rewards (Confetti)

#### Canvas Confetti Implementation

We'll use the `canvas-confetti` library for visual celebrations:

```bash
npm install canvas-confetti
```

#### Confetti Effects

```javascript
import confetti from 'canvas-confetti';

// Basic celebration
function triggerBasicConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Custom celebration for achievements
function triggerAchievementConfetti() {
  confetti({
    particleCount: 150,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  });
  
  confetti({
    particleCount: 150,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  });
}

// School pride effect
function triggerSchoolPrideConfetti() {
  const end = Date.now() + (15 * 1000);
  const colors = ['#bb0000', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
```

#### Confetti Variations

- **Task Completion**: Basic confetti burst
- **Milestone Achievement**: Dual side confetti
- **Trophy Unlock**: Extended celebration
- **Streak Maintenance**: Colorful streamers

### 2. Auditory Rewards (Sounds)

#### Sound Implementation

We'll use HTML5 Audio API for sound effects:

```javascript
class SoundManager {
  constructor() {
    this.sounds = {
      'complete': new Audio('/sounds/complete.mp3'),
      'achievement': new Audio('/sounds/achievement.mp3'),
      'streak': new Audio('/sounds/streak.mp3'),
      'trophy': new Audio('/sounds/trophy.mp3')
    };
    
    // Preload sounds
    Object.values(this.sounds).forEach(sound => {
      sound.preload = 'auto';
    });
  }
  
  play(soundName) {
    if (this.sounds[soundName] && userSettings.rewards.soundEnabled) {
      // Reset playback to start
      this.sounds[soundName].currentTime = 0;
      // Play with user's volume setting
      this.sounds[soundName].volume = userSettings.rewards.volume;
      this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
    }
  }
}
```

#### Sound Pack Options

Users can choose from different sound packs:

- **Nature Sounds**: Bird chirps, water drops, wind chimes
- **Musical Tones**: Pleasant musical notes and chords
- **Digital Beeps**: Modern electronic sounds
- **Retro Gaming**: 8-bit style sounds

#### Sound Timing

- **Immediate**: Play as soon as task is completed
- **With Confetti**: Play synchronized with visual effects
- **Delayed**: Play after a short pause for emphasis

### 3. Achievement Rewards (Trophies)

#### Trophy Categories

- **Completion Trophies**: Based on number of tasks completed
- **Streak Trophies**: Based on consecutive days of task completion
- **Variety Trophies**: Based on completing tasks from different categories
- **Consistency Trophies**: Based on regular usage patterns
- **Challenge Trophies**: Based on completing difficult or specific tasks

#### Trophy Examples

| Trophy Name | Requirement | Icon |
|-------------|-------------|------|
| Silver Trophy #1-10 | Complete tasks 1-10 | Custom silver trophy image |
| Bronze Trophy #1-10 | Complete tasks 11-20 | Custom bronze trophy image |
| Gold Trophy #1+ | Complete task 21+ | Custom gold trophy image |
| Variety Seeker | Complete tasks from 5 different categories | Custom gold trophy image |

| Trophy Name | Requirement | Icon |
|-------------|-------------|------|
| First Step | Complete your first task | 🥇 |
| Consistency Starter | Complete tasks for 3 consecutive days | 📅 |
| Variety Seeker | Complete tasks from 5 different categories | 🌈 |
| Streak Master | Maintain a 7-day completion streak | 🔥 |
| Marathoner | Complete 50 tasks | 🏃 |
| Perfectionist | Complete 10 tasks without skipping | ✨ |
| Early Bird | Complete 5 tasks before noon | 🌅 |
| Night Owl | Complete 5 tasks after 8 PM | 🌙 |

#### Trophy Display

```jsx
const TrophyCard = ({ trophy, isNew = false }) => {
  return (
    <div className={`trophy-card ${isNew ? 'new' : ''}`}>
      <div className="trophy-icon">
        {typeof trophy.icon === 'string' && trophy.icon.endsWith('.png') ? (
          <img src={trophy.icon} alt={trophy.name} className="trophy-image" style={{ maxWidth: '32px', height: 'auto' }} />
        ) : (
          trophy.icon
        )}
      </div>
      <div className="trophy-content">
        <h3 className="trophy-name">{trophy.name}</h3>
        <p className="trophy-description">{trophy.description}</p>
        <p className="trophy-date">Earned: {formatDate(trophy.earnedAt)}</p>
      </div>
      {isNew && <div className="new-badge">NEW!</div>}
    </div>
  );
};
```

## Reward Triggers

### Task Completion Rewards

When a user completes a task:

1. **Visual**: Basic confetti burst
2. **Auditory**: "Complete" sound effect
3. **Achievement Check**: Evaluate for new trophies

### Milestone Rewards

When reaching milestones:

1. **Visual**: Extended confetti celebration
2. **Auditory**: "Achievement" sound effect
3. **Achievement**: Trophy unlock animation

### Streak Rewards

When maintaining streaks:

1. **Visual**: Special streak confetti
2. **Auditory**: "Streak" sound effect
3. **Achievement**: Streak trophy consideration

### First-Time Rewards

For first-time achievements:

1. **Visual**: Enhanced confetti with custom colors
2. **Auditory**: "Trophy" sound effect
3. **Achievement**: Trophy reveal animation

## Reward Customization

### User Settings

Users can customize their reward experience:

```javascript
const defaultRewardSettings = {
  // Visual rewards
  confettiEnabled: true,
  confettiIntensity: 'medium', // low, medium, high
  
  // Auditory rewards
  soundEnabled: true,
  volume: 0.7, // 0-1
  soundPack: 'nature', // nature, musical, digital, retro
  
  // Achievement rewards
  trophyNotifications: true,
  trophyAnimation: true,
  
  // Special effects
  hapticFeedback: true, // mobile only
  screenFlash: false // accessibility option
};
```

### Reward Packs

Users can select from predefined reward packs:

- **Subtle**: Minimal confetti, soft sounds
- **Moderate**: Standard confetti, medium sounds
- **Enthusiastic**: Maximum confetti, loud sounds
- **Custom**: User-defined settings

## Technical Implementation

### Reward Controller

```javascript
class RewardController {
  constructor() {
    this.soundManager = new SoundManager();
    this.confetti = confetti;
  }
  
  triggerReward(rewardType, options = {}) {
    // Check if rewards are enabled
    if (!this.isRewardEnabled(rewardType)) return;
    
    // Trigger visual reward
    if (rewardType === 'taskComplete' || rewardType === 'milestone') {
      this.triggerConfetti(rewardType, options);
    }
    
    // Trigger auditory reward
    if (rewardType === 'taskComplete' || rewardType === 'milestone') {
      this.triggerSound(rewardType);
    }
    
    // Check for achievements
    if (rewardType === 'taskComplete') {
      this.checkForAchievements(options.task);
    }
  }
  
  triggerConfetti(type, options) {
    if (!userSettings.rewards.confettiEnabled) return;
    
    switch(type) {
      case 'taskComplete':
        this.confetti({
          particleCount: 50 * this.getIntensityMultiplier(),
          spread: 60,
          origin: { y: 0.7 }
        });
        break;
      case 'milestone':
        this.triggerAchievementConfetti();
        break;
    }
  }
  
  triggerSound(type) {
    if (!userSettings.rewards.soundEnabled) return;
    
    switch(type) {
      case 'taskComplete':
        this.soundManager.play('complete');
        break;
      case 'milestone':
        this.soundManager.play('achievement');
        break;
    }
  }
  
  checkForAchievements(task) {
    const newTrophies = evaluateTrophyConditions(task);
    if (newTrophies.length > 0) {
      this.triggerTrophyRewards(newTrophies);
    }
  }
  
  triggerTrophyRewards(trophies) {
    // Trigger special reward for trophy unlock
    this.confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 }
    });
    
    this.soundManager.play('trophy');
    
    // Show trophy notification
    if (userSettings.rewards.trophyNotifications) {
      showTrophyNotification(trophies[0]);
    }
  }
}
```

### Performance Considerations

#### Resource Management

- Preload audio files to prevent delays
- Limit confetti particle count to maintain performance
- Clean up audio resources when not in use
- Use requestAnimationFrame for smooth animations

#### Battery Optimization

- Reduce animation intensity on battery power
- Disable non-essential effects when battery is low
- Use efficient confetti configurations

#### Memory Management

- Reuse audio elements instead of creating new ones
- Clean up event listeners properly
- Cancel ongoing animations when components unmount

## Accessibility Features

### Visual Alternatives

For users with visual impairments:

- Enhanced sound effects
- Haptic feedback (mobile)
- Screen reader announcements
- High contrast reward indicators

### Auditory Alternatives

For users with hearing impairments:

- Enhanced visual effects
- Screen flash options
- Vibration patterns (mobile)
- Text-based reward notifications

### Cognitive Considerations

- Option to reduce animation intensity
- Clear, simple reward messaging
- Consistent reward patterns
- Ability to preview rewards

## Testing Scenarios

### Performance Testing

- Verify confetti performance on low-end devices
- Test audio loading and playback
- Validate trophy display rendering
- Check memory usage during extended use

### Cross-Platform Testing

- Test confetti rendering on different browsers
- Verify audio compatibility across platforms
- Validate trophy display on various screen sizes
- Check haptic feedback on supported devices

### Accessibility Testing

- Test with screen readers
- Verify keyboard navigation
- Check high contrast mode
- Validate reduced motion settings

## Future Enhancements

### Personalized Rewards

- **Adaptive Rewards**: Adjust reward intensity based on user engagement
- **Mood-Based Rewards**: Different rewards based on user's mood input
- **Time-Based Rewards**: Special rewards for completing tasks at specific times

### Social Features

- **Shared Celebrations**: Celebrate friends' achievements
- **Reward Trading**: Trade rewards with other users
- **Leaderboard Rewards**: Special rewards for top performers

### Advanced Effects

- **3D Confetti**: More immersive visual effects
- **Spatial Audio**: 3D sound effects
- **AR Rewards**: Augmented reality reward experiences

### Integration Possibilities

- **Smart Home Integration**: Trigger smart home devices as rewards
- **Wearable Integration**: Special rewards for wearable devices
- **Gaming Integration**: Unlock gaming achievements