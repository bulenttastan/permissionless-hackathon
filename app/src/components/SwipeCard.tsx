import React, { useRef, useState } from 'react';

interface SwipeCardProps {
  leftImage: string;
  rightImage: string;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ leftImage, rightImage, onSwipe }) => {
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX !== null) {
      setDragDelta(e.touches[0].clientX - dragStartX);
      e.preventDefault(); // Prevent browser scroll
    }
  };

  const handleTouchEnd = () => {
    if (dragDelta > 80) {
      onSwipe('right');
    } else if (dragDelta < -80) {
      onSwipe('left');
    }
    setDragStartX(null);
    setDragDelta(0);
  };

  return (
    <div
      ref={cardRef}
      className="w-full max-w-sm mx-auto mt-8 rounded-xl shadow-lg overflow-hidden bg-white touch-pan-x"
      style={{
        transform: `translateX(${dragDelta}px) rotate(${dragDelta / 20}deg)`,
        transition: dragStartX === null ? 'transform 0.3s' : 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex w-full h-64">
        <div className="w-1/2 h-full relative">
          <img src={leftImage} alt="Left" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent pointer-events-none" />
        </div>
        <div className="w-1/2 h-full relative">
          <img src={rightImage} alt="Right" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-l from-white/70 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
