// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import AuthPage from "./pages/Auth/AuthPage"
import Navbar from "./components/Navbar"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Register/>
        <Login/> */}
        <Navbar/>
        <AuthPage/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
