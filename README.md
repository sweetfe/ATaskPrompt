# TaskCat

============================================================
TaskCat
A task management application with gamification elements, built with React and Capacitor for both web and Android platforms.

## 📱 Features

* **Task Management**: Create, view, and complete tasks with categories, contexts, due dates, and priorities
* **Context/Mode System**: Organize tasks by contexts/modes
* **Swipe Navigation**: Intuitive swipe gestures to navigate between tasks
* **Gamification**: Earn trophies and celebrate achievements as you complete tasks
* **Reward System**: Confetti animations and visual feedback for completed tasks with multilingual messages
* **Persistent Storage**: Tasks and trophies saved in Firebase with offline support
* **Android Notifications**: Native notification support for priority and date-specific tasks
* **Bill Payment Reminders**: Specialized alerts for financial tasks
* **Search & Edit**: Find and edit tasks directly from search results with inline editing
* **Cross-Platform**: Works on both web browsers and Android devices

## 🚀 Getting Started

### Prerequisites

* Node.js (v14 or higher)
* Android Studio (for Android development)
* Firebase account (for authentication and data storage)

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/TaskCat.git
cd TaskCat
```

Install dependencies:

```bash
npm install
```

Build the web assets:

```bash
npm run build
```

Sync with Capacitor:

```bash
npx cap sync
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google authentication in the Firebase Authentication section
3. Add your web app to the Firebase project to get the configuration credentials
4. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Replace the placeholder values in `.env` with your actual Firebase project credentials

### Running the App

#### For Web:

```bash
npm run dev
```

#### For Android:

```bash
npx cap run android
```

Open in Android Studio:

```bash
npx cap open android
```

## 🎮 How to Use

1. **Add Tasks**: Use the form to create new tasks with categories, contexts, due dates, and priorities
2. **Contexts**: Organize tasks by contexts/modes using the dropdown selector
3. **Swipe Navigation**:
   * Swipe left/right to navigate between tasks
   * Use buttons for previous/next task navigation
4. **Complete Tasks**: Click "Complete Task" to mark tasks as done
5. **Earn Rewards**: Watch confetti animations and earn trophies for completed tasks
6. **Track Progress**: View your trophy collection and task history
7. **Search Tasks**: Find specific tasks and edit them directly in the search results with inline editing

## 🏆 Trophy System

* **Silver Trophies**: First 10 completed tasks in a 24-hour period
* **Bronze Trophies**: Tasks 11-20 in a 24-hour period
* **Gold Trophies**: Task 21 and beyond in a 24-hour period
* **Special Trophies**: Earned for completing tasks in 5 different categories

**Note**: Trophy progression resets every 24 hours, so completing 20 tasks over 2 days should award 20 silver trophies (10 per day) rather than a mix of silver and bronze.

## 📁 Project Structure

```
TaskCat/
├── src/                 # React source code
│   ├── components/      # React components
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── assets/          # Web assets
├── public/              # Public assets (served at root)
│   └── trophy_art/      # Trophy images
├── android/             # Android native project
├── capacitor.config.json # Capacitor configuration
└── package.json         # Project dependencies
```

## 🛠️ Development

### Building for Release

#### Web:
```bash
npm run build
```

#### Android:
In Android Studio: Build > Generate Signed Bundle / APK
Select "Release" build type
Use Android App Bundle (.aab) format for Google Play

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

* Built with React
* Mobile capabilities powered by Capacitor
* Confetti animations by canvas-confetti
* Swipe gestures handled by react-swipeable
* Native notifications powered by Capacitor Local Notifications

## 📝 Known Issues

### Current Bugs & Tweaks Needed

#### UI/Visual Issues
- **App Icon**: Top-of-screen icon needs to match Android icon (checkmark + cat, not just cat)
- **Add Context Button**: Only accepts "+Context" instead of custom contexts (e.g., "Home Depot")
- **Random Task Context Button**: Context button next to "Show Random Task" appears non-functional

#### Task Management Issues
- **Edit from Search**: Tasks found via "Search Tasks" can now be edited directly in search results
- **Pending Task Editing**: Fixed editing of pending tasks with inline editing interface

#### Trophy/Reward System Issues
- **Bronze Trophy Bug**: Issue with bronze trophy awarding mechanism
- **Trophy Timing Logic**: Trophies not following 24-hour period reset rules correctly
- **Expected Behavior**: Trophy types should reset every 24 hours (10 silver, then 10 bronze, then gold)

#### Working Features ✓
- Random trophy congratulations system
- Core task management (add/complete/delete)
- Swipe navigation between tasks
- Basic reward animations
- Inline task editing in search results

## ⚠️ Platform Support

The application works on both web browsers and Android devices. iOS compatibility has not been tested or verified.

## 📞 Support

For support, please open an issue on the GitHub repository or contact [your email/contact info].

Made with ❤️ and ☕