import React, { useState, useEffect } from 'react';
import { Zap, Users, Shield, Minus, Plus, ChevronRight, Rocket } from 'lucide-react';
import * as braze from "@braze/web-sdk"; 
import NebulaCruiser from "../assets/NebulaCruiser.png"
import VoidRunner from "../assets/VoidRunner.png"
import StarlightBus from "../assets/StarlightBus.png"

const ships = [
  {
    id: 'nebula_cruiser',
    name: 'Nebula Cruiser',
    description: 'Reliable comfort for long-haul interplanetary travel.',
    basePrice: 450,
    speed: '0.8c',
    capacity: 6,
    image: NebulaCruiser,
  },
  {
    id: 'void_runner',
    name: 'Void Runner',
    description: 'High-speed interceptor. Get there yesterday.',
    basePrice: 900,
    speed: '1.2c',
    capacity: 2,
    image: VoidRunner,
  },
  {
    id: 'starlight_bus',
    name: 'Starlight Hauler',
    description: 'Heavy lifting capacity for large groups or cargo.',
    basePrice: 300,
    speed: '0.4c',
    capacity: 20,
    image: StarlightBus,
  },
];

const Spaceships = () => {
  // 1. LAZY INITIALIZATION
  const [selectedShip, setSelectedShip] = useState(() => {
    const saved = localStorage.getItem('braze_ship_selection');
    return saved ? JSON.parse(saved) : null;
  });

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('braze_ship_config');
    return saved ? JSON.parse(saved) : {
      seats: 1,
      warpEnabled: false,
      addShields: false,
    };
  });

  // 2. PERSISTENCE EFFECT
  useEffect(() => {
    localStorage.setItem('braze_ship_selection', JSON.stringify(selectedShip));
    localStorage.setItem('braze_ship_config', JSON.stringify(config));
  }, [selectedShip, config]);


  // 3. SELECTION LOGIC
  const handleSelect = (ship) => {
    if (selectedShip?.id === ship.id) {
        // Optional: toggle off logic
    } else {
        setSelectedShip(ship);
        setConfig({
            seats: 1,
            warpEnabled: false,
            addShields: false
        });
    }
  };

  const updateSeats = (delta) => {
    if (!selectedShip) return;
    const newCount = config.seats + delta;
    if (newCount >= 1 && newCount <= selectedShip.capacity) {
      setConfig(prev => ({ ...prev, seats: newCount }));
    }
  };

  // Calculate Prices
  const warpCost = config.warpEnabled ? 200 : 0;
  const shieldCost = config.addShields ? 50 : 0;
  const totalPrice = selectedShip ? selectedShip.basePrice + warpCost + shieldCost : 0;

  // ---------------------------------------------------------
  // THE BRAZE INTEGRATION
  // ---------------------------------------------------------
  const handleBooking = () => {
    // 1. Construct the Nested Object (The "Showcase")
    const bookingPayload = {
        ship_id: selectedShip.id,
        ship_name: selectedShip.name,
        total_price: totalPrice,
        configuration: { 
            passenger_count: config.seats,
            is_warp_enabled: config.warpEnabled,
            has_extra_shields: config.addShields,
            engine_specs: { 
                speed: selectedShip.speed,
                type: config.warpEnabled ? "Hyperdrive" : "Standard Ion"
            }
        },
        timestamp: new Date().toISOString()
    };

    console.log("🚀 Sending to Braze:", bookingPayload);

    // 2. Send Custom Event (Best for Nested Objects)
    // This allows you to filter in Braze like: "Has booked with Warp Enabled = true"
    braze.logCustomEvent("ship_configured", bookingPayload);

    // 3. Update User Profile (Custom Attributes)
    // We flatten the key info so it sits on the user's permanent record
    const user = braze.getUser();
    if (user) {
        user.setCustomUserAttribute("current_ship_name", selectedShip.name);
        user.setCustomUserAttribute("current_ship_price", totalPrice);
        // Braze attributes handle Booleans natively
        user.setCustomUserAttribute("upgrade_warp_enabled", config.warpEnabled); 
    }

    // 4. UI Feedback
    alert(`Configuration sent to Braze! \nShip: ${selectedShip.name} \nTotal: ${totalPrice} CR`);
  };

  return (
    <section className='w-full h-full text-white'>
      <p className='opacity-80 my-4'>
        Choose the vessel that best suits your needs. <br />
        Additional configurations are available.
      </p>
      
      <section className='flex justify-between items-start gap-4 w-full p-4'>
        
        {/* LEFT SIDE: LIST */}
        <div className='flex-1 flex flex-col gap-6 mb-8'>
          {ships.map((item) => {
            const isSelected = selectedShip?.id === item.id;
            return (
              <div 
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`
                  relative w-full aspect-video md:aspect-21/9 lg:h-48
                  flex flex-row items-stretch rounded-2xl overflow-hidden p-4 gap-4 cursor-pointer
                  transition-all duration-300 ease-out border
                  ${isSelected 
                    ? 'bg-zinc-800 border-amber-500 ring-0 ring-amber-500 shadow-sm shadow-amber-900/20 scale-[1.02]' 
                    : 'bg-linear-to-br from-zinc-900 to-zinc-800 border-zinc-700/50 opacity-70 hover:opacity-100 hover:shadow-sm shadow-amber-500'
                  }
                `}
              >
                <div className={`w-1/3 shrink-0 flex items-center justify-center rounded-xl p-2 transition-colors ${isSelected ? 'bg-amber-500/10' : 'bg-black/20'}`}>
                   <img src={item.image} alt={item.name} className='w-full h-full object-contain'/>
                </div>
                
                <div className='flex-1 flex flex-col justify-between py-2'>
                  <div className='flex justify-between items-start'>
                    <h3 className={`text-xl font-bold tracking-wide transition-colors ${isSelected ? 'text-amber-400' : 'text-zinc-100'}`}>{item.name}</h3>
                    <div className='text-white font-mono font-bold text-lg'>{item.basePrice} <span className='text-xs text-zinc-500'>CR</span></div>
                  </div>
                  <p className='text-sm text-zinc-400 leading-relaxed line-clamp-2'>{item.description}</p>
                  <div className='flex items-center gap-6 mt-2'>
                    <div className='flex items-center gap-2 text-zinc-300 text-sm'>
                      <Zap size={16} className={isSelected ? "text-amber-400" : "text-zinc-500"} />
                      <span>{item.speed}</span>
                    </div>
                    <div className='flex items-center gap-2 text-zinc-300 text-sm'>
                      <Users size={16} className={isSelected ? "text-amber-400" : "text-zinc-500"} />
                      <span>{item.capacity} seats</span>
                    </div>
                  </div>
                </div>
                {/* Checkmark */}
                <div className='absolute top-4 right-4'>
                    {isSelected && <div className='w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse' />}
                </div>
              </div>
            )
          })}
        </div>

        {/* RIGHT SIDE: CONFIG PANEL */}
        <div className={`
            hidden md:block w-1/3 max-w-sm rounded-2xl p-6 min-h-[400px] border sticky top-4 transition-all duration-500
            ${selectedShip ? 'bg-zinc-900 border-amber-500/30 shadow-2xl' : 'bg-zinc-900/50 border-zinc-800 border-dashed'}
        `}>
            {selectedShip ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="border-b border-zinc-800 pb-4 mb-6">
                        <h3 className="text-xl font-bold text-amber-500">{selectedShip.name}</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Configuration</p>
                    </div>

                    {/* SEATS */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-zinc-300">Passengers</span>
                            <span className="text-xs text-zinc-500">Max: {selectedShip.capacity}</span>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-950 rounded-lg p-2 border border-zinc-800">
                            <button 
                                onClick={() => updateSeats(-1)}
                                disabled={config.seats <= 1}
                                className="p-2 hover:bg-zinc-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-mono text-lg font-bold">{config.seats}</span>
                            <button 
                                onClick={() => updateSeats(1)}
                                disabled={config.seats >= selectedShip.capacity}
                                className="p-2 hover:bg-zinc-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* CONFIG TOGGLES */}
                    <div className="mb-6 space-y-3">
                        <label className="flex items-center justify-between group cursor-pointer p-3 rounded-lg border border-zinc-800 hover:border-amber-500/50 transition-all bg-zinc-950/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md ${config.warpEnabled ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                    <Zap size={18} fill={config.warpEnabled ? "currentColor" : "none"} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-medium ${config.warpEnabled ? 'text-white' : 'text-zinc-400'}`}>Warp Speed</span>
                                    <span className="text-xs text-zinc-600">+200 CR</span>
                                </div>
                            </div>
                            <input type="checkbox" className="hidden" checked={config.warpEnabled} onChange={() => setConfig(p => ({...p, warpEnabled: !p.warpEnabled}))}/>
                            <div className={`w-4 h-4 rounded-full border ${config.warpEnabled ? 'bg-amber-500 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'border-zinc-600'}`}></div>
                        </label>

                        <label className="flex items-center justify-between group cursor-pointer p-3 rounded-lg border border-zinc-800 hover:border-blue-500/50 transition-all bg-zinc-950/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md ${config.addShields ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                    <Shield size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-medium ${config.addShields ? 'text-white' : 'text-zinc-400'}`}>Extra Shields</span>
                                    <span className="text-xs text-zinc-600">+50 CR</span>
                                </div>
                            </div>
                            <input type="checkbox" className="hidden" checked={config.addShields} onChange={() => setConfig(p => ({...p, addShields: !p.addShields}))}/>
                             <div className={`w-4 h-4 rounded-full border ${config.addShields ? 'bg-blue-500 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'border-zinc-600'}`}></div>
                        </label>
                    </div>

                    {/* CONFIRM BUTTON */}
                    <div className="mt-auto pt-6 border-t border-zinc-800">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-zinc-400 text-sm">Total Estimation</span>
                            <span className="text-3xl font-bold font-mono text-white">{totalPrice} <span className="text-sm text-zinc-500">CR</span></span>
                        </div>
                        <button 
                            onClick={handleBooking}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95"
                        >
                            Confirm Selection
                            <ChevronRight size={20} />
                        </button>
                    </div>

                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 animate-in fade-in duration-700">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                        <Rocket size={32} className="opacity-40" />
                    </div>
                    <p className="text-sm font-medium">Select a vessel to configure</p>
                </div>
            )}
        </div>

      </section>
    </section>
  )
}

export default Spaceships;