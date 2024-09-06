import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AjukanKonsulPasien() {
    const [psychologists, setPsychologists] = useState([]);
    const [formValues, setFormValues] = useState({
        tanggal: "",
        jam: "",
        keluhan: "",
        psikolog: "",
    });

    useEffect(() => {
        axios
            .get("http://localhost:3000/users")
            .then((response) => {
                const psikologs = response.data.filter(
                    (user) => user.role === "psikolog"
                );
                setPsychologists(psikologs);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate form fields
        if (!formValues.tanggal || !formValues.jam || !formValues.keluhan || !formValues.psikolog) {
            let errorMessage = '';
            if (!formValues.tanggal) errorMessage += 'Harap input tanggal konsultasi!<br>';
            if (!formValues.jam) errorMessage += 'Harap input jam konsultasi!<br>';
            if (!formValues.keluhan) errorMessage += 'Harap input keluhan!<br>';
            if (!formValues.psikolog) errorMessage += 'Harap pilih psikolog!<br>';

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: errorMessage,
            });
            return;
        }

        Swal.fire({
            title: 'Konfirmasi',
            text: 'Anda yakin ingin mengajukan konsultasi ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Ajukan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                const newConsultation = {
                    tanggal: formValues.tanggal,
                    jam: formValues.jam,
                    keluhan: formValues.keluhan,
                    psikologId: parseInt(formValues.psikolog), // Memastikan psikologId berupa angka
                    pasienId: JSON.parse(localStorage.getItem("user")).id,
                    status: "Menunggu",
                    linkGoogleMeet: "",
                };

                axios
                    .post("http://localhost:3000/konsultasis", newConsultation)
                    .then((response) => {
                        console.log("Consultation Submitted:", response.data);

                        Swal.fire({
                            title: "Konsultasi Diajukan!",
                            icon: "success",
                        });

                        // Clear form values after successful submission
                        setFormValues({
                            tanggal: "",
                            jam: "",
                            keluhan: "",
                            psikolog: "",
                        });

                    })
                    .catch((error) => {
                        console.error("Error submitting consultation:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Terjadi kesalahan saat mengajukan konsultasi!',
                        });
                    });
            }
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Ajukan Konsultasi Pasien</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="tanggal" className="text-sm font-medium text-gray-700">
                        Tanggal Konsultasi
                    </label>
                    <input
                        type="date"
                        id="tanggal"
                        name="tanggal"
                        value={formValues.tanggal}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="jam" className="text-sm font-medium text-gray-700">
                        Jam Konsultasi
                    </label>
                    <input
                        type="time"
                        id="jam"
                        name="jam"
                        value={formValues.jam}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="keluhan" className="text-sm font-medium text-gray-700">
                        Keluhan
                    </label>
                    <textarea
                        id="keluhan"
                        name="keluhan"
                        value={formValues.keluhan}
                        onChange={handleChange}
                        rows="3"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                    ></textarea>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="psikolog" className="text-sm font-medium text-gray-700">
                        Pilih Psikolog
                    </label>
                    <select
                        id="psikolog"
                        name="psikolog"
                        value={formValues.psikolog}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                    >
                        <option value="">Pilih Psikolog</option>
                        {psychologists.map((psikolog) => (
                            <option key={psikolog.id} value={psikolog.id}>
                                {psikolog.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Ajukan Konsultasi
                </button>
            </form>
        </div>
    );
}

export default AjukanKonsulPasien;
