# ATaskPrompt UI/UX Design

## Design Principles

### 1. Positive Phrasing
All UI elements use encouraging, positive language to motivate users rather than create pressure or anxiety.

### 2. Minimal Distractions
Clean, uncluttered interface with focus on core functionality. No unnecessary elements that could overwhelm users with ADHD.

### 3. Clear Visual Feedback
Immediate, obvious feedback for all user actions to reinforce positive behavior.

### 4. Accessibility First
Designed with accessibility in mind, supporting screen readers, keyboard navigation, and various visual needs.

### 5. Mobile-First Responsive Design
Optimized for mobile devices while maintaining functionality on larger screens.

## Color Palette

### Primary Colors
- **Primary**: #4CAF50 (Green) - Success, positive actions
- **Secondary**: #2196F3 (Blue) - Neutral actions, information
- **Accent**: #FF9800 (Orange) - Warnings, attention

### Status Colors
- **Completed**: #4CAF50 (Green)
- **Pending**: #FFC107 (Yellow)
- **Overdue**: #F44336 (Red)
- **New**: #2196F3 (Blue)

### Background Colors
- **Light Mode**: #FFFFFF (White)
- **Dark Mode**: #121212 (Dark Gray)
- **Card Background**: #F5F5F5 (Light Gray) / #1E1E1E (Dark Gray)

## Typography

### Font Family
- **Primary**: 'Open Sans' - Clean, readable sans-serif
- **Secondary**: 'Roboto' - For headings and emphasis

### Font Sizes
- **Headings**: 1.5rem (24px)
- **Subheadings**: 1.25rem (20px)
- **Body Text**: 1rem (16px)
- **Small Text**: 0.875rem (14px)
- **Captions**: 0.75rem (12px)

## UI Components

### 1. Task Card

```
+-------------------------------------+
| [Category Tag]              [Menu]  |
|                                     |
| Task description text goes here     |
| and can wrap to multiple lines      |
|                                     |
| [Complete] [Skip] [Delay]          |
+-------------------------------------+
```

**Elements**:
- Category tag with color coding
- Task description text
- Action buttons (Complete, Skip, Delay)
- Menu button for additional options

### 2. Task Prompt Modal

```
+-------------------------------------+
|                                     |
|        🌟 Time for a Task! 🌟       |
|                                     |
|  "Take a 5-minute walk outside"     |
|                                     |
|  [Sounds Fun!]  [Not Now]  [Later]  |
|                                     |
+-------------------------------------+
```

**Elements**:
- Encouraging header text
- Task description with positive phrasing
- Action buttons with positive labels
- Visual emphasis on the task

### 3. Trophy Card

```
+-------------------------------------+
|  🏆  First Completion               |
|                                     |
|  You completed your first task!     |
|                                     |
|  Earned: Today at 2:30 PM           |
+-------------------------------------+
```

**Elements**:
- Trophy icon
- Trophy name
- Achievement description
- Date earned

### 4. Progress Indicator

```
[●●●○○] 3/5 tasks completed today
```

**Elements**:
- Visual progress dots
- Numerical progress
- Encouraging text

## User Flow Diagrams

### 1. Main Dashboard Flow

```mermaid
graph TD
    A[App Launch] --> B[Home Screen]
    B --> C{Tasks Available?}
    C -->|Yes| D[Display Task List]
    C -->|No| E[Show Empty State]
    D --> F{Prompt Due?}
    F -->|Yes| G[Show Task Prompt]
    F -->|No| H[Continue Browsing]
    G --> I{User Response}
    I -->|Accept| J[Mark Task Active]
    I -->|Skip| K[Show Next Prompt]
    I -->|Delay| L[Schedule Later Prompt]
    J --> M[Update Task Status]
    K --> N[Select New Task]
    L --> O[Set Reminder]
    M --> H
    N --> G
    O --> H
```

### 2. Task Management Flow

```mermaid
graph TD
    A[Task List View] --> B{User Action}
    B -->|Add Task| C[Show Add Task Form]
    B -->|Complete Task| D[Mark Task Complete]
    B -->|Delete Task| E[Show Confirmation]
    B -->|Edit Task| F[Show Edit Form]
    C --> G[Validate Input]
    G -->|Valid| H[Save New Task]
    G -->|Invalid| I[Show Error]
    D --> J[Update Task Status]
    E -->|Confirm| K[Remove Task]
    E -->|Cancel| A
    F --> L[Validate Changes]
    L -->|Valid| M[Update Task]
    L -->|Invalid| N[Show Error]
    H --> A
    I --> C
    J --> A
    K --> A
    M --> A
    N --> F
```

### 3. Reward Flow

```mermaid
graph TD
    A[Task Completed] --> B[Trigger Reward]
    B --> C{Reward Type}
    C -->|Confetti| D[Show Confetti Animation]
    C -->|Sound| E[Play Reward Sound]
    C -->|Trophy| F[Check Trophy Conditions]
    D --> G[Animate Confetti]
    E --> H[Play Audio]
    F --> I{New Trophy Earned?}
    I -->|Yes| J[Show Trophy Animation]
    I -->|No| K[Continue]
    G --> K
    H --> K
    J --> K
    K --> L[Update UI]
```

## Screen Designs

### 1. Home Screen

```
+-------------------------------------+
| ATaskPrompt                   [⚙️]  |
+-------------------------------------+
| [Today: 3/5 tasks]                  |
|                                     |
| 🌟 Time for a Task!                 |
| "Take a 5-minute walk outside"      |
| [Sounds Fun!]  [Not Now]            |
|                                     |
| Your Tasks:                         |
| +---------------------------------+ |
| | [Health] Drink water          ✓ | |
| |                                 | |
| | [Work]   Reply to emails      ✓ | |
| |                                 | |
| | [Personal] Call mom           ○ | |
| +---------------------------------+ |
|                                     |
| [+ Add Task]                        |
+-------------------------------------+
| [🏠 Home] [📊 History] [🏆 Trophies] |
+-------------------------------------+
```

### 2. Task List Screen

```
+-------------------------------------+
| Your Tasks                    [⚙️]  |
+-------------------------------------+
| Filter: [All ▼] [Health] [Work]     |
|                                     |
| +---------------------------------+ |
| | [Health] Drink water          ✓ | |
| | [Complete] [Skip] [Delay]       | |
| +---------------------------------+ |
|                                     |
| +---------------------------------+ |
| | [Work]   Reply to emails      ✓ | |
| | [Complete] [Skip] [Delay]       | |
| +---------------------------------+ |
|                                     |
| +---------------------------------+ |
| | [Personal] Call mom           ○ | |
| | [Complete] [Skip] [Delay]       | |
| +---------------------------------+ |
|                                     |
| [+ Add Task]                        |
+-------------------------------------+
| [🏠 Home] [📊 History] [🏆 Trophies] |
+-------------------------------------+
```

### 3. Task Prompt Screen

```
+-------------------------------------+
|                                     |
|        🌟 Time for a Task! 🌟       |
|                                     |
|                                     |
|   "Take a 5-minute walk outside"    |
|                                     |
|                                     |
|      [Sounds Fun!]  [Not Now]       |
|                                     |
|              [Later]                 |
|                                     |
|                                     |
+-------------------------------------+
```

### 4. Trophy Board Screen

```
+-------------------------------------+
| Your Trophies                 [⚙️]  |
+-------------------------------------+
| 🏆 First Completion                 |
| You completed your first task!      |
| Earned: Today at 2:30 PM            |
|                                     |
| 🏆 Consistency Starter              |
| You completed tasks for 3 days!     |
| Earned: Yesterday at 5:15 PM        |
|                                     |
| 🏆 Variety Seeker                   |
| You completed 5 different tasks!    |
| Earned: Aug 8 at 10:45 AM           |
|                                     |
| [+] More trophies coming soon...    |
+-------------------------------------+
| [🏠 Home] [📊 History] [🏆 Trophies] |
+-------------------------------------+
```

### 5. History Screen

```
+-------------------------------------+
| Task History                  [⚙️]  |
+-------------------------------------+
| Filter: [Last 7 Days ▼]             |
|                                     |
| Aug 10, 2025                        |
| ✓ Drink water (10:30 AM)            |
| ✓ Reply to emails (2:15 PM)         |
|                                     |
| Aug 9, 2025                         |
| ✓ Call mom (4:20 PM)                |
| ✓ Take vitamins (9:00 AM)           |
|                                     |
| Aug 8, 2025                         |
| ✓ Morning stretch (8:30 AM)         |
+-------------------------------------+
| [🏠 Home] [📊 History] [🏆 Trophies] |
+-------------------------------------+
```

### 6. Settings Screen

```
+-------------------------------------+
| Settings                      [⚙️]  |
+-------------------------------------+
| Prompt Frequency                    |
| [Every 30-60 minutes ▼]             |
|                                     |
| Categories                          |
| [Health] [Work] [Personal] [+]      |
|                                     |
| Rewards                             |
| [✓ Confetti] [✓ Sounds]             |
| Volume: [█████░░░░░] 50%            |
|                                     |
| Accessibility                       |
| [Large Text] [High Contrast]        |
|                                     |
| [Reset to Defaults]                 |
+-------------------------------------+
| [🏠 Home] [📊 History] [🏆 Trophies] |
+-------------------------------------+
```

## Responsive Design

### Mobile Layout (320px - 480px)
- Single column layout
- Larger touch targets (minimum 44px)
- Simplified navigation
- Full-width buttons

### Tablet Layout (481px - 768px)
- Two column layout for task list
- More information per screen
- Enhanced filtering options

### Desktop Layout (769px+)
- Three column layout
- Advanced filtering and sorting
- Keyboard shortcuts
- Multi-window support

## Accessibility Features

### Visual
- High contrast mode
- Large text option
- Colorblind-friendly palette
- Reduced motion option

### Navigation
- Full keyboard navigation
- Screen reader support
- Focus indicators
- Skip links

### Cognitive
- Consistent interface patterns
- Clear labeling
- Undo functionality
- Progressive disclosure

## Animation Guidelines

### Micro-interactions
- Button hover effects (subtle color change)
- Task completion animation (checkmark)
- Page transitions (slide effects)

### Reward Animations
- Confetti (5 seconds max)
- Trophy reveal (3 seconds)
- Progress indicators (smooth transitions)

### Performance
- All animations under 300ms
- Reduced motion option disables non-essential animations
- Hardware acceleration for smooth performance

## User Onboarding

### First Launch
1. Welcome screen with app purpose
2. Quick tutorial of main features
3. Initial category setup
4. Prompt frequency selection

### Progressive Disclosure
- Introduce advanced features gradually
- Contextual tips based on usage
- Achievement-based unlocks

## Error Handling

### Validation Errors
- Clear error messages
- Visual highlighting of problematic fields
- Suggested corrections

### System Errors
- Friendly error messages
- Recovery options
- Contact support option

### Offline States
- Clear offline indicator
- Cached data availability
- Sync status when reconnected