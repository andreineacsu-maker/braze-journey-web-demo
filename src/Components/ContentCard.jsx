import React, { useEffect, useRef } from 'react';
import * as braze from "@braze/web-sdk";

const ContentCard = ({ card, spansTwo }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (card) {
      braze.logContentCardImpressions([card]);
    }
  }, [card]);

 
  const handleCardClick = () => {
    // Only log if the URL exists to prevent the SDK error
    if (card.url) {
        braze.logContentCardClick(card);
    } else {
        console.warn("Braze SDK requires a URL to log a Content Card click.");
    }
  };

  const handleLaunchClick = (e) => {
    // STOP PROPAGATION
    e.stopPropagation(); 
    e.preventDefault(); 

    // A. Log the Standard Content Card Click
    if (card.url) {
        braze.logContentCardClick(card);
    }

 
    // We pass the event name and an object with properties (like the title)
    braze.logCustomEvent("flight_booked", {
        destination: card.title, 
    });

    console.log("Launch Sequence Initiated: Flight Booked event logged.");
  };

  return (
    <div 
      ref={cardRef}
      onClick={handleCardClick}
      className="group relative w-full h-[600px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
    >
      
      {/* BACKGROUND IMAGE */}
      <img 
        src={card.imageUrl} 
        alt={card.title} 
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

      {/* BADGE */}
      {card.badgeText && (
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {card.badgeText}
        </div>
      )}

      {/* TEXT CONTENT */}
      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
          {card.title}
        </h3>
        <p className='text-zinc-400'>{card.description}</p>
        <div 
            onClick={handleLaunchClick}
            className="flex items-center gap-2 text-amber-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 delay-75 hover:text-amber-300"
        >
          <span>Initialize Launch Sequence</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m-4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;