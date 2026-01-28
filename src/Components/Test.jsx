import React, { useState, useEffect } from 'react';

// A mock Card component for the example - replace with your actual UI
const Card = ({ data, className }) => (
  <div className={`bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 shadow-lg ${className}`}>
    <div className="h-48 bg-gray-800 rounded-lg overflow-hidden relative">
        {/* Placeholder for Image */}
        <img src={data.image || "/api/placeholder/400/320"} alt="Destination" className="w-full h-full object-cover" />
        <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {data.badge || "Offer"}
        </span>
    </div>
    
    <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-white">{data.title || "Mystery Planet"}</h3>
        <p className="text-gray-400 text-sm">Experience the gravity of a new world.</p>
    </div>

    <textarea 
        className="bg-gray-800 text-gray-300 text-sm p-3 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500 resize-none h-20"
        placeholder="Any special requests for this flight?"
    />

    <button className="mt-auto bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition-colors">
        Confirm Flight
    </button>
  </div>
);

const ContentCardFeed = ({ userId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingCache, setIsUsingCache] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      // 1. CACHING STRATEGY: Load from local storage immediately
      const cachedData = localStorage.getItem(`braze-cards-${userId}`);
      if (cachedData) {
        setCards(JSON.parse(cachedData));
        setLoading(false);
        setIsUsingCache(true); 
      }

      try {
        // Replace this with your actual Braze SDK fetch logic
        // const newCards = await braze.getContentCards();
        
        // Simulating a fetch request
        console.log("Fetching fresh cards...");
        // Simulate a 503 error randomly to test resilience
        // if (Math.random() > 0.5) throw new Error("503 Service Unavailable"); 

        // Mock Data for demonstration
        const mockResponse = Array.from({ length: 9 }).map((_, i) => ({
            id: i,
            title: `Destination: Sector ${i + 1}`,
            badge: i % 3 === 0 ? "Featured" : "Standard",
            image: `https://picsum.photos/seed/${i + 50}/800/600`
        }));

        // 2. ON SUCCESS: Update State and Cache
        setCards(mockResponse);
        localStorage.setItem(`braze-cards-${userId}`, JSON.stringify(mockResponse));
        setIsUsingCache(false); // We are now using fresh data
        setLoading(false);

      } catch (error) {
        console.error("Failed to fetch fresh cards:", error);
        // 3. ON ERROR: Do nothing. 
        // We rely on the cached data loaded at the start of the effect.
        // Optionally show a toast here saying "Showing offline content"
      }
    };

    fetchCards();
  }, [userId]);

  // 4. LAYOUT STRATEGY: Helper to calculate span based on index
  const getCardStyle = (index) => {
    // We process items in groups of 6 (2 rows of 3 items in our pattern)
    // Pattern: 
    // Row 1: [1] [1] [2] (Indices 0, 1, 2) -> Index 2 is the "Right Heavy"
    // Row 2: [2] [1] [1] (Indices 3, 4, 5) -> Index 3 is the "Left Heavy"
    
    const positionInCycle = index % 6;

    // Is this the 3rd item (Right Heavy)?
    if (positionInCycle === 2) return "col-span-2";
    
    // Is this the 4th item (Left Heavy)?
    if (positionInCycle === 3) return "col-span-2";

    // Everyone else is standard
    return "col-span-1";
  };

  if (loading && cards.length === 0) {
    return <div className="text-white text-center mt-20">Loading Star Charts...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
            Available Flights
        </h2>
        {isUsingCache && (
            <span className="text-yellow-500 text-sm font-medium bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                ⚠ Network offline - Showing cached flights
            </span>
        )}
      </div>

      {/* LAYOUT GRID:
          We use grid-cols-4.
          Standard cards take 1 col. Large cards take 2 cols.
          Row 1: 1 + 1 + 2 = 4 (Full Row)
          Row 2: 2 + 1 + 1 = 4 (Full Row)
      */}
      <div className="grid grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card 
            key={card.id} 
            data={card} 
            className={getCardStyle(index)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ContentCardFeed;