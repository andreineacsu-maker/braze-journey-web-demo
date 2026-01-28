import React from 'react'
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import * as braze from "@braze/web-sdk";
import {BrainCircuit, PersonStanding, Spotlight, Speech, Earth, Printer, MonitorUp, Ampersands, Upload,Lock, Fingerprint, Mail, Shield, CheckCircle2, Crown} from 'lucide-react'

const Personalisation = ({ user }) => {


  // --- 1.LOCAL STORAGE CHECK ---
  //First we check local storage to see if there are any items from a previous session.
  const getTravelInfoFromStorage = (key, defaultValue) => {
    try {
      const savedItem = localStorage.getItem(key);
      return savedItem ? JSON.parse(savedItem) : defaultValue;
    } catch (error) {
      console.warn("Error reading from localStorage", error);
      return defaultValue;
    }
  };

 // --- 2. LAZY INITIALIZATION ---
  // Instead of passing [] directly, we pass a function. 
  // React runs this ONLY on the very first render.
  const [selectedAddons, setSelectedAddons] = useState(() => 
    getTravelInfoFromStorage("braze_travel_upgrades", [])
  );
  
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(() => 
    getTravelInfoFromStorage("braze_accepted_terms", false)
  );

  const [isVIP, setIsVIP] = useState(()=> 
    getTravelInfoFromStorage("vip",false))

  const isFirstRender = useRef(true);



  const squares = [
    { label: "Temporary Backup Clone",
       description:"In case of an accident, a clone with your memory will be created at destination",
       color: "from-zinc-900 to-zinc-800",
       price:"95 CR" },

    { label: "Digital Conscience Upload",
      description:"Continue to exist to spite the universe",
       color: "from-zinc-900 to-zinc-800",
       price: "100CR" },

    { label: "3D Onsite Luggage Printing",
      description:"Spatial limitations are not an obstacle anymore",
       color: "from-zinc-900 to-zinc-800",
       price:"50CR" },

    { label: "Memory Archive",
      description:"Keeps your memories safe in case of head trauma",
       color: "from-zinc-900 to-zinc-800",
      price:"30CR" },

    { label: "Neural Link",
      description:"Looks cool, like very very cool",
       color: "from-zinc-900 to-zinc-800",
      price: "10CR" },

    { label: "Synthetic Dreams",
       description:"Manifest your desires even in your sleep",
        color: "from-zinc-900 to-zinc-800",
        price:"5CR"
       },
    { label: "No In-Flight Advertisement",
      description:"Help us support interplanetary travel",
       color: "from-zinc-900 to-zinc-800",
       price:"20CR"
       },
    { label: "Earth-like Gravitation",
       description:"Forget about being strapped to a chair",
       color: "from-zinc-900 to-zinc-800",
      price:"30CR" },

    { label: "Universal Translator",
      description:"Facilitates negotiations with space pirates",
       color: "from-zinc-900 to-zinc-800",
      price:"10CR" }
  ];

  // --- 3. LOCAL STORAGE EFFECT ---
  // useEffect hooks that runs everytime the addons are selected and adds them to local storage
  useEffect(() => {
    localStorage.setItem("braze_travel_upgrades", JSON.stringify(selectedAddons));
    localStorage.setItem("braze_accepted_terms", JSON.stringify(hasAcceptedTerms));
    localStorage.setItem("vip", JSON.stringify(isVIP))
  }, [selectedAddons, hasAcceptedTerms, isVIP]);

  // --- 4. BRAZE EFFECT (DELAYED SYNC) ---
  useEffect(() => {
    // Determine if this is the first real run
    // Note: Since we load from LocalStorage now, the "First Render" might actually 
    // have data in it! But we usually don't need to re-send it to Braze immediately 
    // on page load unless you want to be 100% sure the server is in sync.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const selectedLabels = squares
        .filter((_, index) => selectedAddons.includes(index))
        .map(item => item.label);

      console.log("🚀 Syncing to Braze (Debounced):", selectedLabels);

      const currentUser = braze.getUser();
      if (currentUser) {
        currentUser.setCustomUserAttribute("travel_upgrades", selectedLabels);
        currentUser.setCustomUserAttribute("accepted_space_terms", hasAcceptedTerms);
        currentUser.setCustomUserAttribute("vip", isVIP)
      }
    }, 2000); 

    return () => clearTimeout(handler);
  }, [selectedAddons, hasAcceptedTerms], isVIP); 

  
  const handleToggle = (index) => {
    if (selectedAddons.includes(index)) {
        setSelectedAddons(prev => prev.filter(i => i !== index));
    } else {
        setSelectedAddons(prev => [...prev, index]);
    }
  };

  return (
    <section className='w-full h-full text-white'>
      <p className='opacity-80 my-4'>
        In order to ensure the best experience travelling, please double check all the details needed for your journey. <br>
        </br>
        Addons are also available.
      </p>

      {/* MAIN CONTAINER */}
      <section className='flex justify-between gap-4 w-full p-4'>
        
        {/* LEFT SIDE: GRID LAYOUT (2/3 width) */}
        <div className='flex-1 grid grid-cols-3 gap-6 place-items-center mb-8'>
          {squares.map((item, index) => {
            // Check if this specific item is currently selected
            const isSelected = selectedAddons.includes(index);

            return (
              <div 
                key={index}
                onClick={() => handleToggle(index)}
               className={`
               bg-linear-to-br ${item.color} 
                rounded-2xl p-4 h-50 w-full flex flex-col items-center justify-between gap-4
  
              /* ANIMATION BASE */
            transition-all duration-300 ease-out cursor-pointer

              /* STATES */
              hover:-translate-y-1 hover:shadow-md hover:shadow-amber-500/40 hover:brightness-110
               active:scale-95 active:translate-y-0
  
              /* SELECTED STATE */
              ${isSelected ? 'ring-1 ring-amber-500 shadow-amber-500/50 border-amber-900/20 ' : 'opacity-80 hover:opacity-100'}
            `}
              >
             <div className='flex justify-around items-center w-full'>
              {item.icon}
                {isSelected ? (
                  <CheckCircleIcon className='size-6 text-green-700' />
                ) : (
                  <PlusCircleIcon className='size-5 text-amber-500' />
                )}
                </div>
                
                <p className={`text-center text-lg ${isSelected ? 'font-semibold text-amber-100' : ''}`}>
                    {item.label}
                </p>
                <p className='text-sm text-center opacity-80'>{item.description}</p>
                <span className='uppercase text-sm opacity-50'>Price: {item.price}</span>
              </div>
            )
          })}
        </div>

        {/* RIGHT SIDE: PROFILE CARD (1/3 width) */}
        {/* Changed 'w-40' and 'flex-1' to 'w-1/3' to ensure it stays 33% width */}
        <div className='w-1/3 max-w-sm bg-zinc-900 rounded-2xl p-4 min-h-[500px] max-h-[600px] mb-8 border border-amber-500/30 shadow-2xl'>
          <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="relative group cursor-default">
            {/* Rotating Ring Effect for Sci-Fi feel */}
            <div className={`absolute -inset-1 rounded-full border border-dashed transition-all duration-[10s] animate-[spin_10s_linear_infinite] ${isVIP ? 'border-amber-500 opacity-60' : 'border-zinc-700 opacity-30'}`}></div>
            
            {/* Clerk Avatar */}
            <div className={`w-20 h-20 rounded-full overflow-hidden border-2 relative z-10 ${isVIP ? 'border-amber-500' : 'border-zinc-800'}`}>
                   {user?.imageUrl && <img src={user.imageUrl} alt="user avatar" className='w-full h-full object-cover'/>}
            </div>

            {/* VIP Badge */}
            {isVIP && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-black p-1.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                    <Crown size={12} fill="black" />
                </div>
            )}
        </div>
        
        <h2 className={`mt-3 text-xl font-bold tracking-wide ${isVIP ? 'text-amber-500' : 'text-white'}`}>
            {user.firstName} {user.lastName}
        </h2>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-1">
            {isVIP ? 'Diplomatic Clearance' : 'Standard Passenger'}
        </span>
      </div>

      {/* 2. READ-ONLY DATA FIELDS (Styled as Terminals) */}
      <div className="space-y-3 mb-6 relative z-10">
        <div className="group relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors"/>
            </div>
            {/* We use a div instead of input to show it's read-only data, not a disabled form field */}
            <div className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-400 font-mono flex justify-between items-center">
                <span className="truncate">{user.primaryEmailAddress?.emailAddress}</span>
                <Lock size={12} className="opacity-30" />
            </div>
        </div>
      </div>

      {/* 3. ACTIVE AUGMENTATIONS (Stacking Icons) */}
      {selectedAddons.length > 0 && (
          <div className="mb-6 bg-zinc-950/30 rounded-xl p-3 border border-zinc-800/50">
            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2 ml-1">Active Modules</p>
            <div className="flex items-center gap-2 flex-wrap">
                {selectedAddons.map((addon, index) => (
                    <div key={index} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center tooltip-trigger group relative">
                        <p>+1</p>
                        {/* Simple CSS Tooltip */}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Module Active
                        </span>
                    </div>
                ))}
                {/* Visual filler for empty slots */}
                <div className="w-8 h-8 rounded-full border border-dashed border-zinc-800 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                </div>
            </div>
          </div>
      )}

      {/* 4. UPSELL: OFFICIAL ESCORT / VIP */}
      <div 
        onClick={() => setIsVIP(!isVIP)}
        className={`
            cursor-pointer relative overflow-hidden mb-6 p-3 rounded-xl border transition-all duration-300 group
            ${isVIP ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-zinc-800/30 border-zinc-800 hover:border-zinc-600'}
        `}
      >
         <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-lg ${isVIP ? 'bg-amber-500 text-black' : 'bg-zinc-700 text-zinc-400'}`}>
                <Shield size={18} fill={isVIP ? "currentColor" : "none"}/>
            </div>
            <div className="flex flex-col">
                <span className={`text-sm font-bold ${isVIP ? 'text-amber-400' : 'text-zinc-200'}`}>Diplomatic Immunity</span>
                <span className="text-[10px] text-zinc-500">Bypass customs • Anti-Piracy Squad</span>
            </div>
            <div className="ml-auto">
                 <span className={`text-xs font-mono ${isVIP ? 'text-amber-400' : 'text-zinc-600'}`}>+500CR</span>
            </div>
         </div>
      </div>

      {/* 5. TERMS & CONDITIONS (Biometric Scan Style) */}
      <div className="mt-auto relative z-10">
        <p className="text-[10px] text-zinc-600 text-justify mb-4 leading-relaxed">
            I confirm awareness that travel may be affected by solar flares, gravity fields, and space pirates. Braze assumes no responsibility for timeline fracturing.
        </p>
        
        <button
            onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
            className={`
                w-full py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 border
                ${hasAcceptedTerms
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400'
                }
            `}
        >
            {hasAcceptedTerms? (
                <>
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Identity Verified</span>
                </>
            ) : (
                <>
                    <Fingerprint size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Authorize Biometrics</span>
                </>
            )}
        </button>
      </div>

      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

    </div>

      </section>
    </section>
  )
}

export default Personalisation