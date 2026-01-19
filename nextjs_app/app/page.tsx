'use client';

import { useState, useEffect } from 'react';

// Define types
type Mood = 'happy' | 'sad' | 'neutral';
type MoodEntry = {
  id: string;
  date: string;
  mood: Mood;
  note?: string;
};

export default function MoodTracker() {
  // State for current mood and history
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [note, setNote] = useState('');
  const [today, setToday] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize today's date
  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    setToday(todayDate);

    // Load mood history from localStorage
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory));
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Handle mood selection
  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);

    // Check if there's already an entry for today
    const existingIndex = moodHistory.findIndex(entry => entry.date === today);

    if (existingIndex !== -1) {
      // Update existing entry
      const updatedHistory = [...moodHistory];
      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        mood,
        note: updatedHistory[existingIndex].note || ''
      };
      setMoodHistory(updatedHistory);
    } else {
      // Add new entry
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: today,
        mood,
        note: ''
      };
      setMoodHistory([newEntry, ...moodHistory]);
    }
  };

  // Handle note submission
  const handleNoteSubmit = () => {
    if (!currentMood || !note.trim()) return;

    const updatedHistory = moodHistory.map(entry =>
      entry.date === today ? { ...entry, note } : entry
    );

    setMoodHistory(updatedHistory);
    setNote('');
  };

  // Clear all history
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all mood history?')) {
      setMoodHistory([]);
      localStorage.removeItem('moodHistory');
    }
  };

  // Get today's mood entry
  const todaysEntry = moodHistory.find(entry => entry.date === today);

  // Mood options with emojis and colors
  const moodOptions: { value: Mood; label: string; emoji: string; color: string; bgColor: string; darkBgColor: string }[] = [
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-pink-500', bgColor: 'bg-pink-50', darkBgColor: 'dark:bg-pink-900/30' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'text-blue-500', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-900/30' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-gray-500', bgColor: 'bg-gray-50', darkBgColor: 'dark:bg-gray-700/30' },
  ];

  // Calculate weekly mood data
  const getWeeklyMoodData = () => {
    const weekData: { [key: string]: { happy: number; sad: number; neutral: number } } = {};

    // Initialize with empty data for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      weekData[dateString] = { happy: 0, sad: 0, neutral: 0 };
    }

    // Fill in actual data from moodHistory
    moodHistory.forEach(entry => {
      const entryDate = entry.date;
      if (weekData[entryDate]) {
        weekData[entryDate][entry.mood]++;
      }
    });

    return weekData;
  };

  const weeklyMoodData = getWeeklyMoodData();
  const weekDates = Object.keys(weeklyMoodData);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-white text-black' : 'bg-gradient-to-br from-indigo-50 to-cyan-50 text-gray-800'} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Daily Mood Tracker
            </h1>
            <p className={`${darkMode ? 'text-gray-700' : 'text-gray-600'} mt-2`}>Track your emotions and reflect on your day</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-indigo-600 text-yellow-300 hover:bg-indigo-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {moodHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className={`p-2 rounded-full ${darkMode ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
                aria-label="Clear history"
              >
                🗑️
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Guided Reflection & Mood Selection */}
          <div className="lg:col-span-1 bg-white dark:bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Reflect on Your Day</h2>

            {/* Guided Questions */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-indigo-600 dark:text-indigo-600">Take a moment to think:</h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>What made you smile today?</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>What challenged you?</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>How do you feel right now?</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">How are you feeling?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleMoodSelect(option.value)}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      currentMood === option.value
                        ? `border-indigo-500 ${option.bgColor} ${option.darkBgColor} scale-105 shadow-md`
                        : `${darkMode ? 'border-gray-300 hover:border-indigo-400' : 'border-gray-200 hover:border-indigo-300'}`
                    }`}
                  >
                    <span className="text-4xl mb-2">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {todaysEntry && (
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-gray-100 border-gray-300 text-black' : 'bg-indigo-50 border-indigo-200'} transition-all duration-300 animate-fadeIn`}>
                <div className="flex items-center justify-center mb-3">
                  <span className="text-5xl">
                    {moodOptions.find(opt => opt.value === todaysEntry.mood)?.emoji}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-center capitalize">
                  Today's Mood: {todaysEntry.mood}
                </h3>

                {todaysEntry.note && (
                  <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-white text-black' : 'bg-white text-gray-700'} text-sm`}>
                    <p className="italic">"{todaysEntry.note}"</p>
                  </div>
                )}

                <div className="mt-4 text-center text-sm italic">
                  {todaysEntry.mood === 'happy' && "Great to see you're feeling positive! Keep that energy going!"}
                  {todaysEntry.mood === 'sad' && "Remember, it's okay to have tough days. Take care of yourself."}
                  {todaysEntry.mood === 'neutral' && "A balanced day is still valuable. Take a deep breath."}
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Notes and Weekly Graph */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes Section */}
            <div className="bg-white dark:bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Add a Note</h2>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What made you feel this way? What happened today?"
                className={`w-full h-32 p-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none ${
                  darkMode ? 'bg-gray-100 border-gray-400 text-black' : 'bg-gray-50 border-gray-200'
                }`}
              />

              <p className="text-sm mt-2 text-gray-500 dark:text-gray-600 italic">
                Share your thoughts to help reflect on your day
              </p>

              <button
                onClick={handleNoteSubmit}
                disabled={!currentMood || !note.trim()}
                className={`mt-4 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentMood && note.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-0.5'
                    : 'bg-gray-200 dark:bg-gray-200 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Note
              </button>
            </div>

            {/* Weekly Graph Section */}
            <div className="bg-white dark:bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Weekly Mood Overview</h2>

              {moodHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className={`${darkMode ? 'text-gray-700' : 'text-gray-500'}`}>
                    Track some moods to see your weekly overview!
                  </p>
                  <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-600">
                    Start by reflecting on how you feel today
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex items-end justify-between h-40 pt-4 pb-8 min-w-max">
                    {weekDates.map((date) => {
                      const dateObj = new Date(date);
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNumber = dateObj.getDate();

                      // Determine dominant mood for this day
                      const dayMood = weeklyMoodData[date];
                      let dominantMood: Mood | null = null;

                      if (dayMood.happy > 0) dominantMood = 'happy';
                      else if (dayMood.sad > 0) dominantMood = 'sad';
                      else if (dayMood.neutral > 0) dominantMood = 'neutral';

                      // Calculate bar height based on mood presence
                      const barHeight = dominantMood ? 80 : 10;

                      const moodOption = moodOptions.find(opt => opt.value === dominantMood);

                      return (
                        <div key={date} className="flex flex-col items-center w-12 mx-1">
                          <div className="flex flex-col items-center justify-end h-32 w-10">
                            <div
                              className={`w-8 rounded-t-lg transition-all duration-500 ${
                                moodOption ? `${moodOption.bgColor} ${moodOption.darkBgColor}` : 'bg-gray-200 dark:bg-gray-200'
                              }`}
                              style={{ height: `${barHeight}px` }}
                            >
                              {dominantMood && (
                                <div className="text-center -mt-6 text-xl">
                                  {moodOption?.emoji}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-700' : 'text-gray-600'}`}>
                            <div>{dayName}</div>
                            <div>{dayNumber}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center mt-6 space-x-4">
                    {moodOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-1 ${opt.bgColor.replace('bg-', 'bg-')}`}></div>
                        <span className={`text-xs ${darkMode ? 'text-gray-700' : ''}`}>{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8 bg-white dark:bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">Mood History</h2>
            <span className={`text-sm ${darkMode ? 'text-gray-700' : 'text-gray-500'}`}>
              {moodHistory.length} entries
            </span>
          </div>

          {moodHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className={`mb-2 ${darkMode ? 'text-gray-700' : 'text-gray-500'}`}>
                No mood entries yet. Select a mood to begin!
              </p>
              <p className="text-sm italic text-gray-500 dark:text-gray-600">
                Every day is a chance to reflect and grow
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...moodHistory].reverse().map((entry) => {
                const date = new Date(entry.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });

                const moodOption = moodOptions.find(opt => opt.value === entry.mood);

                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-xl border-l-4 transition-all duration-300 transform hover:scale-[1.02] ${
                      entry.mood === 'happy' ? 'border-pink-500 bg-pink-50 dark:bg-pink-50 dark:border-pink-400' :
                      entry.mood === 'sad' ? 'border-blue-500 bg-blue-50 dark:bg-blue-50 dark:border-blue-400' :
                      'border-gray-500 bg-gray-50 dark:bg-gray-50 dark:border-gray-400'
                    } ${darkMode ? 'text-black' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{moodOption?.emoji}</span>
                        <div>
                          <h3 className="font-medium capitalize">{entry.mood}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-700' : 'text-gray-600'}`}>{formattedDate}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        entry.date === today
                          ? 'bg-indigo-100 dark:bg-indigo-100 text-indigo-800 dark:text-indigo-800'
                          : darkMode ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.date === today ? 'Today' : ''}
                      </span>
                    </div>

                    {entry.note && (
                      <p className={`mt-3 text-sm italic ${darkMode ? 'text-black' : 'text-gray-700'}`}>"{entry.note}"</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}