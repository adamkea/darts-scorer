# Darts Scorer

A simple and intuitive web application for scoring darts games between two players.

## Features

- **Configurable Game Settings**: Set the number of sets (best of X) and legs per set
- **Custom Starting Score**: Choose your starting score (default 501)
- **Real-time Scoring**: Enter scores for each player's turn
- **Quick Score Buttons**: Fast access to common scores (20, T20, 19, T19, Bull, etc.)
- **Win Detection**: Automatically detects leg, set, and game wins
- **Score Validation**: Prevents invalid scores (busts, negative numbers)
- **Undo Functionality**: Undo the last score entry
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
bun run build
```

The production build will be in the `dist` directory.

## How to Use

1. **Setup**: Configure your game settings (sets to win, legs per set, starting score)
2. **Start Game**: Click "Start Game" to begin
3. **Enter Scores**: 
   - Use the number input to enter any score (0-180)
   - Or use the quick score buttons for common values
   - Click "Submit" to record the score
4. **Switch Turns**: The app automatically switches to the next player after each score
5. **Win Conditions**: 
   - A player wins a leg when they reach exactly 0 (must finish on double or bull)
   - A player wins a set when they win the required number of legs
   - A player wins the game when they win the required number of sets

## Technology Stack

- **Runtime**: Bun
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
