'use client'

import React, { useState } from 'react'
import SignIn from './components/Sign-In'
import SignUp from './components/Sign-up'

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div >
      {isSignIn ? (
        <SignIn setIsSignIn={setIsSignIn} />
      ) : (
        <SignUp setIsSignIn={setIsSignIn} />
      )}
    </div>
  )
}

export default Auth