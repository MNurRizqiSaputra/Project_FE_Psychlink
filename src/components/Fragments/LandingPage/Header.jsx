import React from 'react';
import heroImage from '@assets/images/hero3.png';
import { Link } from 'react-router-dom';

const Headers = () => {
  return (
    <>
      <div className="pt-24">
        <div className="container flex flex-col flex-wrap items-center px-3 mx-auto md:flex-row">
          {/* Left Col */}
          <div className="flex flex-col items-start justify-center w-full text-center md:w-2/5 md:text-left">
            <p className="w-full uppercase tracking-loose">Selamat datang di Psychlink</p>
            <h1 className="my-4 text-5xl font-bold leading-tight">
              Hubungi Psikolog Online, Kapan Saja, Dimana Saja
            </h1>
            <p className="mb-8 text-2xl leading-normal">
              Solusi konsultasi mental mudah di tangan Anda. Temukan kesehatan mental yang lebih baik.
            </p>
            <Link to="/login" className="px-8 py-4 mx-auto my-6 font-bold text-gray-800 transition duration-300 ease-in-out transform bg-white rounded-full shadow-lg lg:mx-0 hover:underline focus:outline-none focus:shadow-outline hover:scale-105">
              Mulai Konsultasi
            </Link>
          </div>
          {/* Right Col */}
          <div className="w-full py-6 text-center md:w-3/5">
            <img className="z-50 w-full md:w-4/5" src={heroImage} alt="Hero" />
          </div>
        </div>
      </div>
      <div className="relative -mt-12 lg:-mt-24">
        <svg
          viewBox="0 0 1428 174"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          {/* SVG Path */}
        </svg>
      </div>
    </>
  );
};

export default Headers;