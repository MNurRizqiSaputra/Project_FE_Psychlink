import React from 'react';

const BantuanPsikolog = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-5 md:mx-auto sm:text-center lg:max-w-2xl">
        <div className="mb-4">
          <h2 className="mb-6 text-4xl font-bold text-center">Butuh Bantuan?</h2>
          <p className="mb-6 text-lg text-gray-700">
            Selalu siap membantu Anda! Tim dukungan kami tersedia untuk memberikan bantuan
            dan jawaban atas pertanyaan Anda. Jangan ragu untuk menghubungi kami kapan saja.
          </p>
          <div className="flex justify-between mx-10 ">
            {/* Email Section */}
            <div className="flex flex-col items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-50 ">
              <i className="text-3xl text-indigo-500 fas fa-envelope" />
              <a href="mailto: Q5r9v@example.com" className="mt-2 text-lg font-semibold text-gray-700">
                Email
              </a>
            </div>

            {/* WhatsApp Section */}
            <div className="flex flex-col items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-50">
              <i className="text-3xl text-indigo-500 fab fa-whatsapp" />
              <a href="https://wa.me/6281234567890" className="mt-2 text-lg font-semibold text-gray-700">
                Whatsapp
              </a>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default BantuanPsikolog;