import React, { useState } from 'react'
import { BellAlertIcon } from '@heroicons/react/16/solid'
import { BellIcon } from '@heroicons/react/24/outline'
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import ContentCardFeed from './ContentCardFeed'
import Spaceships from './Spaceships'
import Personalisation from './Personalisation'
import Test from "./Test"

const MainLayout = ({user, activeTab}) => {

  

  const userObject = () => {
    console.log(user)
  }
  return (
    <section className='w-full p-4'>
    <header className='flex justify-between w-full'>
       <h1 className='text-3xl text-white font-bold'>Good morning, <span className='text-amber-500'>{user.firstName}</span></h1>
        <div className='flex items-center justify-center gap-4'>
        <BellIcon className="size-6 text-amber-500"/>
        <ChatBubbleLeftEllipsisIcon className="size-6 text-amber-500"/>
        <InformationCircleIcon className="size-6 text-amber-500"/>
        </div>
    </header>
    <section className='overflow-scroll h-full'>
        {activeTab === 'flights' && <ContentCardFeed/>}
        {activeTab === 'spaceships' && <Spaceships />}
        {activeTab === 'personalisation' && <Personalisation user={user} />}
    </section>
    </section>
  )
}

export default MainLayout