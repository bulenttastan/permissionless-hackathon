"use client"
import SwipeCard from "../components/SwipeCard";
import { useState } from "react";

const images = [
  {
    left: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    right: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    left: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    right: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<string | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setLastSwipe(direction);
    setTimeout(() => {
      setLastSwipe(null);
      setIndex((prev) => (prev + 1) % images.length);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mt-8 mb-4">Swipe Left or Right</h1>
      <SwipeCard
        leftImage={images[index].left}
        rightImage={images[index].right}
        onSwipe={handleSwipe}
      />
      {lastSwipe && (
        <div className="mt-6 text-lg font-semibold text-blue-600 animate-pulse">
          You swiped {lastSwipe}!
        </div>
      )}
      <p className="mt-8 text-gray-500">Try swiping the card left or right.</p>
    </div>
  );
}
