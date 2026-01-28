import { UserButton } from '@clerk/clerk-react'
import React from 'react'
import Logo from './Logo'
import { MapIcon } from '@heroicons/react/24/outline'
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

const Sidebar = ({activeTab,setActiveTab}) => {
  return (
    <aside className='rounded-tl-2xl rounded-bl-2xl p-4 flex flex-col justify-between min-w-50 max-w-60'>
        <Logo height={80} width={80}/>
        <ul className='text-white flex flex-col gap-4'>
            <li 
            onClick={()=> setActiveTab('flights')}
            className={`flex items-center justify-between  gap-2 cursor-pointer font-bold hover:opacity-100 transition-all delay-100 ease-in-out ${activeTab === 'flights'? 'font-bold text-white' :'opacity-80'}`}>
            
              
              <span className='flex items-center gap-2'>
                <MapIcon className='size-5 text-amber-500'/>
                Flights</span>
          
               <span className={`${activeTab === 'flights'? "p-1 rounded-full bg-amber-500" : "hidden transition-all transition-discrete"}`}></span>
              </li>
            <li 
            onClick={()=> setActiveTab('spaceships')} className={`flex items-center justify-between  gap-2 cursor-pointer font-bold hover:opacity-100 transition-all delay-100 ease-in-out ${activeTab === 'spaceships'? 'font-bold text-white' :'opacity-80'}`}>
              <span className='flex items-center gap-2'>
              <RocketLaunchIcon className='size-5 text-amber-500'/>
              Spaceships
              </span>

             
              <span className={`${activeTab === 'spaceships'? "p-1 rounded-full bg-amber-500" : "hidden transition-all transition-discrete"}`}></span>
               </li>

            <li 
            onClick = {()=> setActiveTab('personalisation')}
             className={`flex items-center justify-between  gap-2 cursor-pointer font-bold hover:opacity-100 transition-all delay-100 ease-in-out ${activeTab === 'personalisation'? 'font-bold text-white' :'opacity-80'}`}>
              <span className='flex items-center gap-2'>
              <AdjustmentsHorizontalIcon className='size-5 text-amber-500'/>Preferences
              </span>
              
               <span className={`${activeTab === 'personalisation'? "p-1 rounded-full bg-amber-500" : "hidden transition-all transition-discrete"}`}></span>
              </li>
        </ul>
        <UserButton/>
    </aside>
  )
}

export default Sidebar