import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import "../src/App.css"
import SignInPage from './Components/SignInPage';
import BrazeConfig from './Components/brazeConfig';
import Sidebar from './Components/Sidebar';
import MainLayout from './Components/MainLayout';


export default function App() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState('personalisation')
 
  return (
    <main className='h-dvh bg-linear-to-b from-zinc-950 to-zinc-900 flex justify-center items-center'>
      <SignedOut>
        <SignInPage/>
      </SignedOut>
      <SignedIn>
        <BrazeConfig 
        isLoaded={isLoaded}
        isSignedIn={isSignedIn}
        user={user}/>
        {(isSignedIn && isLoaded) ?
        <section 
        id='blurred-background-low-opacity'
        className='flex h-screen w-screen rounded-2xl p-4'>
        <Sidebar 
        setActiveTab = {setActiveTab}
        activeTab = {activeTab}/>
        <MainLayout
        setActiveTab = {setActiveTab}
        activeTab = {activeTab}
         user={user}/>
        </section>
         :
         null}
      </SignedIn>
    </main>
  );
}