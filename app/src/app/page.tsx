"use client"
import SwipeCard from "../components/SwipeCard";
import WalletConnect from "../components/WalletConnect";
import { useState } from "react";

const images = [
  {
    left: "/trump.jpg",
    right: "/kamala.jpg",
  },
  {
    left: "/lakers.png",
    right: "/warriors.png",
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
    <div className="flex flex-col items-center justify-center px-4 min-h-screen bg-gradient-to-br from-sky-300 via-blue-500 to-indigo-500">
      <h1 className="text-6xl font-bold text-transparent absolute top-16 bg-gradient-to-r from-pink-500 to-orange-700 bg-clip-text">YesNo</h1>
      <h1 className="text-2xl font-bold text-white drop-shadow">Bet $1</h1>
      <WalletConnect />
      <SwipeCard
        leftImage={images[index].left}
        rightImage={images[index].right}
        onSwipe={handleSwipe}
      />
      {lastSwipe && (
        <div className=" text-lg font-semibold text-blue-100 animate-pulse drop-shadow">
          You swiped {lastSwipe}!
        </div>
      )}
      <p className="mt-20 text-blue-100">Try swiping the card left or right.</p>
    </div>
  );
}
