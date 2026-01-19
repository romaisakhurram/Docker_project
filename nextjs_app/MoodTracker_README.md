# Daily Mood Tracker

A visual and interactive mood tracking application built with Next.js and TypeScript.

## Features

- **Mood Selection**: Choose from three mood options (Happy 😊, Sad 😢, Neutral 😐)
- **Today's Mood Display**: Shows your selected mood for the current day
- **Mood Notes**: Add personal notes to your daily mood entry
- **Mood History**: View your past mood entries with dates
- **Weekly Graph**: Visual representation of your weekly mood trends
- **Persistent Storage**: Data stored in browser's localStorage

## How to Use

1. Select your mood for the day using the emoji buttons
2. Optionally add a note about your day
3. View your mood history and weekly trends
4. Your data persists between sessions

## Technical Implementation

- Built with Next.js 16.1.3 and React 19.2.3
- Uses TypeScript for type safety
- Styled with Tailwind CSS
- State managed with React hooks (useState, useEffect)
- Data persisted using localStorage
- Responsive design for all screen sizes

## Upgrade Features Implemented

- **Weekly Graph**: Visual chart showing mood trends over the past 7 days
- **Notes with Mood**: Ability to add contextual notes to each mood entry
- **Visual Design**: Color-coded mood indicators and intuitive interface

## Project Structure

```
app/
  └── page.tsx        # Main mood tracker component
```

## Local Development

To run this application locally:

1. Ensure you have Node.js installed
2. Navigate to the project directory
3. Run `npm run dev` to start the development server
4. Visit `http://localhost:3000` in your browser