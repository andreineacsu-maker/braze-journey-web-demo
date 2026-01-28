import * as braze from "@braze/web-sdk";
import { useEffect, useState } from 'react';




const BrazeConfig = ({user, isLoaded, isSignedIn}) => {

  const [brazeInitialised, setBrazeInitialised] = useState(false)


   console.log(user)
   console.log(isSignedIn)

   // We initialise Braze with the first useEffect hook and await for it to finishh initialising before calling other methods.
   // The dependency array ensures this only runs once.

useEffect(() => {
    if (!brazeInitialised) {
    
      try {
       braze.initialize("e4b1646d-6189-499d-b4fb-87c5e3dd20c5", {
    baseUrl: "sondheim.braze.com", 
    sessionTimeoutInSeconds: 30, 
    enableLogging: true,
    allowUserSuppliedJavascript:true,
    manageServiceWorkerExternally: false, 
    serviceWorkerLocation: "/serviceWorker.js"
    

    

    
  });
  braze.openSession();

  braze.automaticallyShowInAppMessages();

  braze.requestPushPermission();

  braze.subscribeToContentCardsUpdates(function(cards){
   
});
        
        setBrazeInitialised(true);
        if (typeof window !== "undefined") {
  window.braze = braze;
}
        console.log("Braze initialization called.");
      } catch (error) {
        console.error("Failed to call braze.initialize:", error);
      }
    }
  }, [brazeInitialised]);

  //We confirm the braze instance is initialised and the user signed in, we can now set the External ID and other miscelanous details. 

  useEffect(() => {
    // Only run if Clerk data is loaded AND Braze has been initialized
    if (isLoaded) {

      // Wait for a small delay to ensure Braze is fully ready after initialization,
      // as the SDK methods might not be instantly available.
      // This is a common pattern for potentially slow external scripts.
      const delay = setTimeout(() => {
        
        if (isSignedIn && user) {
          const brazeExternalId = user.id;

          console.log(`Setting Braze user to ID: ${brazeExternalId}`);
          
          // 1. Change User
          braze.changeUser(brazeExternalId);

          // 2. Set Attributes
          const brazeUser = braze.getUser();
          if (brazeUser) {
            
            // Set first name (Clerk gives user.firstName)
            if (user.firstName) {
                brazeUser.setFirstName(user.firstName);
                brazeUser.setLastName(user.lastName);
            }
            
            // Set email (using the primary email from the array)
            const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
            if (primaryEmail) {
                brazeUser.setEmail(primaryEmail);
            }
            
            // Note: Braze often handles setting last name via setLastName() if available
            // If you need last name, check Clerk's user object: user.lastName
            
            console.log("Braze user attributes set.");

          } else {
            console.warn("Braze user object is not available yet after changeUser.");
          }

          // 3. Tracking Actions
          braze.requestImmediateDataFlush();
          braze.openSession();
          console.log("Braze session opened and data flushed.");

        } else if (!isSignedIn) {
          console.log('User signed out. Clearing Braze user.');
          // Clear user when signed out
          braze.changeUser(null);
          braze.closeSession(true); // Close session and discard queued events
        }
      }, 500); // 500ms delay

      return () => clearTimeout(delay); // Cleanup the timeout if the component unmounts or deps change
    }
  }, [isLoaded, isSignedIn, user, brazeInitialised]);

  return (
    <></>
  )
}

export default BrazeConfig