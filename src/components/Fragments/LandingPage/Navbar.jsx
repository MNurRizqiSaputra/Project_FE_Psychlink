import React, { useState, useEffect } from 'react';
import logo from '../../../assets/images/logo3.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const navbarClass = scrollPosition > 0 ? 'bg-white text-gray-900 shadow-md' : 'bg-white text-gray-900';

  return (
    <nav id="header" className={`fixed top-0 z-30 w-full ${navbarClass}`}>
      <div className="container flex flex-wrap items-center justify-between w-full py-2 mx-auto mt-0">
        <div className="flex items-center pl-4">
          <Link className="text-2xl font-bold text-gray-900 no-underline hover:no-underline lg:text-4xl" to="#">
            <img src={logo} className="h-8" alt="Psychlink" />
            PSYCHLINK
          </Link>
        </div>
        <div className="block pr-4 lg:hidden">
          <button id="nav-toggle" className="flex items-center p-1 text-gray-900 transition duration-300 ease-in-out transform hover:text-gray-900 focus:outline-none focus:shadow-outline hover:scale-105">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="z-20 flex-grow hidden w-full p-4 mt-2 text-black bg-white lg:flex lg:items-center lg:w-auto lg:mt-0 lg:bg-transparent lg:p-0" id="nav-content">
          <ul className="items-center justify-end flex-1 list-reset lg:flex">
            <li className="mr-3">
              <a className="inline-block px-4 py-2 font-bold text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="#">Beranda</a>
            </li>
            <li className="mr-3">
              <a className="inline-block px-4 py-2 text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="#About">Tentang Kami</a>
            </li>
            <li className="mr-3">
              <a className="inline-block px-4 py-2 text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="#Features">Informasi Kesehatan Mental</a>
            </li>
            <li className="mr-3">
              <a className="inline-block px-4 py-2 text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="#testimoni">Testimoni</a>
            </li>
            <li className="mr-3">
              <a className="inline-block px-4 py-2 text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="#FAQ">FAQ</a>
            </li>
            <li className="mr-3">
              <a className="inline-block px-4 py-2 text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="#kontak">Kontak</a>
            </li>
            <li className="mr-3">
              <Link to="/joinpsikolog">
                <a className="inline-block px-4 py-2 text-gray-900 no-underline hover:text-gray-800 hover:text-underline" href="">Join Psikolog</a>
              </Link>
            </li>
          </ul>
          
          {/* Tombol Login */}
          <Link to="/login">
            <button
              id="navAction"
              className="px-4 py-2 mx-auto mt-4 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 rounded-lg shadow opacity-75 lg:mx-0 hover:bg-blue-700 lg:mt-0 focus:outline-none focus:shadow-outline hover:scale-105"
              style={{ backgroundColor: scrollPosition > 0 ? '#3182ce' : '#3b82f6' }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
      <hr className="py-0 my-0 border-b border-gray-100 opacity-25" />
    </nav>
  );
};

export default Navbar;
