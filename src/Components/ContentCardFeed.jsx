
import React, { useEffect, useState } from 'react';
import * as braze from '@braze/web-sdk';
import ContentCard from './ContentCard';

const ContentCardFeed = () => {
  const [cards, setCards] = useState([]);

  console.log(cards)
  
  // This makes sure that the content cards load only for specific users
  // Not that I would ever need it cause I target all users anyway

  const userId = braze.getUser().getUserId();

  console.log(userId)

  useEffect(() => {
    // ---------------------------------------------
    // We retrieve the cached content cards from local storage first if there are any
    // ---------------------------------------------
   const cacheKey = `content-cards-${userId}`;

    // 2. READ: Try to load from this key immediately
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      console.log("Yeeeee buddy");
      setCards(JSON.parse(cachedData));
    }

    // ---------------------------------------------
    // We look for new cards if there are any 
    // ---------------------------------------------
    const subscriptionId = braze.subscribeToContentCardsUpdates((updates) => {
      const freshCards = updates.cards;
      
      // SAFETY CHECK: Only update if we actually got cards back
      if (freshCards && freshCards.length > 0) {
          console.log("✅ Network Success: Updating State & Cache");
          setCards(freshCards);
          localStorage.setItem(cacheKey, JSON.stringify(freshCards));
      } else {
          console.log("⚠️ Network returned 0 cards (or failed). Keeping cached version.");
          // We DO NOT setCards here, so the old cached cards stay on screen.
      }
    });

    // Request refresh (triggers the subscription above if successful)
    braze.requestContentCardsRefresh();

    // Cleanup
    return () => {
      braze.removeSubscription(subscriptionId);
    };
  }, [userId]); // Re-run if the user changes

  //LOGIC FOR DEBUGGING BECAUSE IT DOESN'T WORK TO CACHE THEM

  // const savedData = localStorage.getItem(`content-cards-${userId}`);
  // console.log("📦 RAW CACHE from Storage:", savedData);
  
  // if (savedData) {
  //    const parsed = JSON.parse(savedData);
  //    console.log("📦 PARSED CACHE cards:", parsed);
  //    // Check if it's an array and has items
  //    console.log("Is Array?", Array.isArray(parsed));
  //    console.log("Card Count:", parsed.length);
  // } else {
  //    console.log("⚠️ Storage is EMPTY");
  // }



  // LOGIC FOR CONTENT CARDS SPAN

  const getCardSpan = (index) => {
    // We cycle through a pattern of 6 items
    const positionInCycle = index % 6;

    // Position 2 is the 3rd item (End of Row 1) -> Needs to be Big
    // Position 3 is the 4th item (Start of Row 2) -> Needs to be Big
    if (positionInCycle === 2 || positionInCycle === 3) {
      return 'col-span-2';
    }

    // All others are standard size
    return 'col-span-1';
  };

  return (
    <div className='max-w-[1600px] mx-auto p-6'>
   <div className="grid grid-cols-4 gap-4 auto-rows-fr">
  {cards.map((card, index) => (
    <div 
      key={card.id} 
      //Run the helper function to determine the wingspan
      className={getCardSpan(index)}
    >
      <ContentCard
       spansTwo = {getCardSpan(index) === 'col-span-2'}
       card={card} />
    </div>
  ))}
</div>
</div>
  );
};

export default ContentCardFeed;