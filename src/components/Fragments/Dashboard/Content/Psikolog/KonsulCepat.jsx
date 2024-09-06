import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function KonsulCepatPsikolog() {
    const [isOn, setIsOn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setLoggedInUser(storedUser);
        if (storedUser && storedUser.role === "psikolog") {
            setIsOn(storedUser.Availability === "bersedia");
        }
    }, []);

    const toggleOnOff = async () => {
        const newAvailability = !isOn ? "bersedia" : "tidak bersedia";

        // Menampilkan konfirmasi alert
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan mengubah status Anda menjadi ${newAvailability}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, ubah!',
            cancelButtonText: 'Tidak, tetap'
        });

        if (result.isConfirmed) {
            setIsOn(!isOn);

            if (loggedInUser) {
                try {
                    const response = await fetch(`http://localhost:3000/users/${loggedInUser.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ Availability: newAvailability })
                    });

                    if (response.ok) {
                        const updatedUser = { ...loggedInUser, Availability: newAvailability };
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                        setLoggedInUser(updatedUser);

                        // Menampilkan alert sukses
                        Swal.fire({
                            title: 'Berhasil!',
                            text: `Status Anda telah diubah menjadi ${newAvailability}`,
                            icon: 'success'
                        });
                    } else {
                        console.error("Gagal memperbarui ketersediaan");
                    }
                } catch (error) {
                    console.error("Terjadi kesalahan saat memperbarui ketersediaan:", error);
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                onClick={toggleOnOff}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                    isOn ? 'bg-green-500' : 'bg-red-500'
                }`}
            >
                {isOn ? 'ON' : 'OFF'}
            </button>
            <p className="mt-4 text-center text-gray-600">
                Saya sedang{' '}
                <span className={isOn ? 'text-green-500' : 'text-red-500'}>
                    {isOn ? 'bersedia menerima' : 'sedang tidak menerima'} konsultasi cepat
                </span>
            </p>
        </div>
    );
}

export default KonsulCepatPsikolog;
