import React from 'react';

const Testimoni = () => {
  return (
    <section className="bg-white dark:bg-gray-900" id="testimoni">
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
          Apa kata <span className="text-blue-500">klien</span> kami
        </h1>

        <section className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 lg:grid-cols-2 xl:grid-cols-3">
          <div className="p-8 border rounded-lg dark:border-gray-700">
            <p className="leading-loose text-gray-500 dark:text-gray-400">
              "Saya sangat terkesan dengan Psychlink. Dengan bantuan mereka, saya dapat mengatasi stres dan merasa lebih bahagia setiap hari."
            </p>

            <div className="flex items-center mt-8 -mx-2">
              <img
                className="object-cover mx-2 rounded-full w-14 shrink-0 h-14 ring-4 ring-gray-300 dark:ring-gray-700"
                src="https://i.pravatar.cc/150?img=1"
                alt=""
              />

              <div className="mx-2">
                <h1 className="font-semibold text-gray-800 dark:text-white">Dian</h1>
                <span className="text-sm text-gray-500">Pengusaha</span>
              </div>
            </div>
          </div>

          <div className="p-8 border rounded-lg dark:border-gray-700">
            <p className="leading-loose text-gray-500 dark:text-gray-400">
              "Psychlink membawa perubahan positif dalam hidup saya. Konsultasi dengan psikolog mereka membantu saya memahami diri sendiri dan meningkatkan kesehatan mental saya."
            </p>

            <div className="flex items-center mt-8 -mx-2">
              <img
                className="object-cover mx-2 rounded-full w-14 shrink-0 h-14 ring-4 ring-gray-300 dark:ring-gray-700"
                src="https://i.pravatar.cc/150?img=3"
                alt=""
              />

              <div className="mx-2">
                <h1 className="font-semibold text-gray-800 dark:text-white">Budi</h1>
                <span className="text-sm text-gray-500">Mahasiswa</span>
              </div>
            </div>
          </div>

          <div className="p-8 border rounded-lg dark:border-gray-700">
            <p className="leading-loose text-gray-500 dark:text-gray-400">
              "Psychlink adalah tempat yang sangat membantu. Konsultasi yang saya dapatkan membuka wawasan baru dan membantu saya mengelola tekanan pekerjaan."
            </p>

            <div className="flex items-center mt-8 -mx-2">
              <img
                className="object-cover mx-2 rounded-full w-14 shrink-0 h-14 ring-4 ring-gray-300 dark:ring-gray-700"
                src="https://i.pravatar.cc/150?img=5"
                alt=""
              />

              <div className="mx-2">
                <h1 className="font-semibold text-gray-800 dark:text-white">Siti</h1>
                <span className="text-sm text-gray-500">Karyawan</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Testimoni;