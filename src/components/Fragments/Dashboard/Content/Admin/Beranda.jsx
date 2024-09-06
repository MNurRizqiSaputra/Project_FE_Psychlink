import React, { useState, useEffect } from "react";

function BerandaAdmin() {
  // State untuk menyimpan informasi pengguna yang login
  const [user, setUser] = useState(getUserFromLocalStorage());

  useEffect(() => {
    // Ambil data pengguna saat komponen dimuat
    const userData = getUserFromLocalStorage();
    setUser(userData);
  }, []);

  // Fungsi untuk mendapatkan informasi pengguna dari local storage
  function getUserFromLocalStorage() {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">

            <div className="max-w-xl mb-5 md:mx-auto sm:text-center lg:max-w-2xl">
                <div className="mb-4">
                    <h1 className="font-sans text-3xl font-bold leading-none tracking-tight text-center text-gray-900 sm:text-4xl md:mx-auto"> Selamat Datang, {user && user.username ? user.username : "ADMIN"}</h1>
                </div>
            </div>

            <div className="flex flex-wrap">
                {/* Card Beranda */}
                <div className="w-full p-6 md:w-1/2 xl:w-1/3">
                    <div
                        className="p-5 border-b-4 border-green-600 rounded-lg shadow-xl bg-gradient-to-b from-green-200 to-green-100"
                    >
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="p-5 bg-green-600 rounded-full">
                                    <i className="fas fa-home fa-2x fa-inverse"></i>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h2 className="font-bold text-gray-600 uppercase">
                                    Beranda
                                </h2>
                                {/* Isi dengan data dinamis jika diperlukan */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Card Beranda */}

                {/* Card Manajemen Psikolog */}
                <div className="w-full p-6 md:w-1/2 xl:w-1/3">
                    <div
                        className="p-5 border-b-4 border-pink-500 rounded-lg shadow-xl bg-gradient-to-b from-pink-200 to-pink-100"
                    >
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="p-5 bg-pink-600 rounded-full">
                                    <i className="fas fa-user-md fa-2x fa-inverse"></i>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h2 className="font-bold text-gray-600 uppercase">
                                    Manajemen Psikolog
                                </h2>
                                {/* Isi dengan data dinamis jika diperlukan */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Card Manajemen Psikolog */}

                {/* Card Manajemen Pengguna */}
                <div className="w-full p-6 md:w-1/2 xl:w-1/3">
                    <div
                        className="p-5 border-b-4 border-yellow-600 rounded-lg shadow-xl bg-gradient-to-b from-yellow-200 to-yellow-100"
                    >
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="p-5 bg-yellow-600 rounded-full">
                                    <i className="fas fa-users fa-2x fa-inverse"></i>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h2 className="font-bold text-gray-600 uppercase">
                                    Manajemen Pasien
                                </h2>
                                {/* Isi dengan data dinamis jika diperlukan */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Card Manajemen Pengguna */}

                {/* Card Laporan */}
                <div className="w-full p-6 md:w-1/2 xl:w-1/3">
                    <div
                        className="p-5 border-b-4 border-blue-500 rounded-lg shadow-xl bg-gradient-to-b from-blue-200 to-blue-100"
                    >
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="p-5 bg-blue-600 rounded-full">
                                    <i className="fas fa-file-alt fa-2x fa-inverse"></i>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h2 className="font-bold text-gray-600 uppercase">
                                    Laporan
                                </h2>
                                {/* Isi dengan data dinamis jika diperlukan */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Card Laporan */}

                {/* Card Bantuan */}
                <div className="w-full p-6 md:w-1/2 xl:w-1/3">
                    <div
                        className="p-5 border-b-4 border-red-500 rounded-lg shadow-xl bg-gradient-to-b from-red-200 to-red-100"
                    >
                        <div className="flex flex-row items-center">
                            <div className="flex-shrink pr-4">
                                <div className="p-5 bg-red-600 rounded-full">
                                    <i className="fas fa-question-circle fa-2x fa-inverse"></i>
                                </div>
                            </div>
                            <div className="flex-1 text-right md:text-center">
                                <h2 className="font-bold text-gray-600 uppercase">
                                    Bantuan
                                </h2>
                                {/* Isi dengan data dinamis jika diperlukan */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Card Bantuan */}

            </div>
        </div>
    )
}

export default BerandaAdmin;  