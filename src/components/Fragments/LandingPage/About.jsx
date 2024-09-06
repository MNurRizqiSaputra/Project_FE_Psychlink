import React from 'react';

const About = () => {
  return (
    <div className="container max-w-5xl m-8 mx-auto">
      <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
        Tentang Kami
      </h2>
      <div className="w-full mb-4">
        <div className="w-64 h-1 py-0 mx-auto my-0 rounded-t opacity-25 gradient"></div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-5/6 p-6 sm:w-1/2">
          <h3 className="mb-3 text-3xl font-bold leading-none text-gray-800">
            Misi Kami
          </h3>
          <p className="mb-8 text-gray-600">
            Psychlink berkomitmen untuk memberikan layanan konsultasi mental online yang inovatif dan mudah diakses. Kami percaya bahwa kesehatan mental adalah hal yang sangat penting, dan kami ingin membantu individu menemukan dukungan dan bimbingan melalui konsultasi dengan psikolog secara online.
          </p>
        </div>
        <div className="w-full p-6 sm:w-1/2">
          {/* Carikan Foto Seorang Psikolog */}
          <img className="mx-auto" width="300" src="https://www.klinikpela9.com/wp-content/uploads/2023/02/Layanan-Dokter-Psikolog.png" alt="psikolog" />
        </div>
      </div>
      <div className="flex flex-col-reverse flex-wrap sm:flex-row">
        <div className="w-full p-6 mt-6 sm:w-1/2">
          <img className="mx-auto" width="300" src="https://static.republika.co.id/uploads/images/xlarge/konsultasi-dengan-psikolog_230614160114-630.jpg" alt="konsul" />
        </div>
        <div className="w-full p-6 mt-6 sm:w-1/2">
          <div className="align-middle">
            <h3 className="mb-3 text-3xl font-bold leading-none text-gray-800">
              Filosofi Kami
            </h3>
            <p className="mb-8 text-gray-600">
              Kami percaya bahwa setiap individu memiliki perjalanan kehidupan yang unik, dan kesehatan mental merupakan bagian integral dari kebahagiaan dan kesejahteraan. Dengan Psychlink, kami berusaha menyediakan ruang aman dan mendukung untuk membantu Anda menjalani perjalanan kesehatan mental Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;