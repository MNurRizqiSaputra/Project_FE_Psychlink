import React from 'react';
import { useEffect } from 'react';


// Import js Files
import { handleScroll } from '@assets/js/scrollHandler';
import { handleToggle } from '@assets/js/dropdownToggle';

// Import Components
import Navbar from '../../components/Fragments/LandingPage/Navbar';
import Headers from '../../components/Fragments/LandingPage/Header';
import About from '../../components/Fragments/LandingPage/About';
import Features from '../../components/Fragments/LandingPage/Features';
import FAQSection from '../../components/Fragments/LandingPage/Faq';
import Footer from '../../components/Fragments/LandingPage/Footer';
import Testimoni from '../../components/Fragments/LandingPage/Testimoni';

const LandingPage = () => {

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleToggle);

    return () => {
      document.removeEventListener("click", handleToggle);
    };
  }, []);
  

  return (
    <div>
  
      {/* Header */}
        <Navbar />

      {/* Header */}
      <Headers />

      {/* About */}
      <section className="py-8 bg-white border-b" id="About">
      <About />
      </section>

      {/* Features */}
      <section className="py-8 bg-white border-b" id="Features">
        <Features/>
      </section>

      {/* role */}
      <Testimoni />

      {/* FAQ */}
      <section className="py-8 bg-white border-b" id="FAQ">
        <FAQSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;