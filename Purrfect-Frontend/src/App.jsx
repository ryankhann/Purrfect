import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/cart";
import Account from "./pages/Account";
import MaineCoon from "./pages/breeds/MaineCoon";
import Persian from './pages/breeds/Persian';
import Bengal from './pages/breeds/Bengal';
import Ragdoll from './pages/breeds/Ragdoll';
import Siamese from './pages/breeds/Siamese';
import BritishShorthair from './pages/breeds/BritishShorthair';
import Food from "./pages/nutrition/PremiumFood";
import Supplements from './pages/nutrition/Supplements';
import Treats from './pages/nutrition/Treats';
import DietPlans from './pages/nutrition/DietPlans';
import Available from './pages/kittens/Available';
import UpcomingLitters from './pages/kittens/UpcomingLitters';
import Reservation from './pages/kittens/Reservation';
import HealthGuarantee from './pages/kittens/HealthGuarantee';
import Beds from './pages/accessories/Beds';
import Collars from './pages/accessories/Collars';
import Grooming from './pages/accessories/Grooming';
import Toys from './pages/accessories/Toys';
import Story from './pages/about/Story';
import Cattery from './pages/about/Cattery';
import Testimonials from './pages/about/Testimonials';
import Contact from './pages/about/Contact';
import Checkout from './pages/Checkout';
import FinalCheckout from './pages/FinalCheckout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/breeds/maine-coon" element={<MaineCoon />} />
        <Route path="/breeds/persian" element={<Persian />} />
        <Route path="/breeds/bengal" element={<Bengal />} />
        <Route path="/breeds/siamese" element={<Siamese />} />
        <Route path="/breeds/ragdoll" element={<Ragdoll />} />
        <Route path="/breeds/british-shorthair" element={<BritishShorthair />} />
        <Route path="/nutrition/food" element={<Food />} />
        <Route path="/nutrition/supplements" element={<Supplements />} />
        <Route path="/nutrition/treats" element={<Treats />} />
        <Route path="/nutrition/diet-plans" element={<DietPlans />} />
        <Route path="/kittens/available" element={<Available />} />
        <Route path="/kittens/upcoming-litters" element={<UpcomingLitters />} />
        <Route path="/kittens/reservation" element={<Reservation />} />
        <Route path="/kittens/health-guarantee" element={<HealthGuarantee />} />
        <Route path="/accessories/beds" element={<Beds />} />
        <Route path="/accessories/collars" element={<Collars />} />
        <Route path="/accessories/grooming" element={<Grooming />} />
        <Route path="/accessories/toys" element={<Toys />} />
        <Route path="/about/story" element={<Story />} />
        <Route path="/about/cattery" element={<Cattery />} />
        <Route path="/about/testimonials" element={<Testimonials />} />
        <Route path="/about/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/final-checkout" element={<FinalCheckout />} />
      </Routes>
      <Footer />
    </Router>
  </AuthProvider>
  );
}

export default App;
