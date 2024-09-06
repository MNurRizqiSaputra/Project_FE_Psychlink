import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';

function JadwalAndaPsikolog() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [months, setMonths] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const schedulesPerPage = 10;

    // Retrieve psychologistId from localStorage
    const loggedInPsychologistId = JSON.parse(localStorage.getItem("user")).id;

    // Days of the week in Bahasa Indonesia
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    useEffect(() => {
        axios.get(`http://localhost:3000/schedules?psikologId=${loggedInPsychologistId}`)
            .then(response => {
                const sortedSchedules = response.data.sort((a, b) => a.id - b.id);
                setSchedules(sortedSchedules);

                const uniqueMonths = [...new Set(sortedSchedules.map(schedule => schedule.tanggal.split('/')[1]))].sort();
                setMonths(uniqueMonths);

                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [loggedInPsychologistId]);

    const handleEdit = (id) => {
        // Find the schedule to edit
        const scheduleToEdit = schedules.find(schedule => schedule.id === id);
    
        // Display SweetAlert with input fields for editing
        Swal.fire({
            title: 'Edit Jadwal Konsultasi',
            html: `
                <div>
                    <p><strong>Hari:</strong> ${scheduleToEdit.hari}</p>
                    <p><strong>Tanggal:</strong> ${scheduleToEdit.tanggal}</p>
                    <p><strong>Jam:</strong> ${scheduleToEdit.jam}</p>
                    <p><strong>Zona Waktu:</strong> ${scheduleToEdit.zona_waktu}</p>
                    <p><strong>Kuota:</strong> ${scheduleToEdit.kuota}</p>
                    <hr class="mb-2">
                    <p><strong>Jadwal Baru:</strong></p>
                    <label for="newTanggal" class="block">Tanggal Baru:</label>
                    <input type="date" id="newTanggal" class="swal2-input mb-2 w-1/2" value="${scheduleToEdit.tanggal}">
                    <label for="newJam" class="block">Jam Baru:</label>
                    <div class="flex items-center mb-2">
                        <select id="newJam" class="swal2-input mr-2 w-1/2">
                            ${Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)).map(hour => (
                                `<option value="${hour}" ${scheduleToEdit.jam.split(':')[0] === hour ? 'selected' : ''}>${hour}</option>`
                            ))}
                        </select>
                        <span>:</span>
                        <select id="newMenit" class="swal2-input ml-2 w-1/2">
                            ${Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)).map(minute => (
                                `<option value="${minute}" ${scheduleToEdit.jam.split(':')[1] === minute ? 'selected' : ''}>${minute}</option>`
                            ))}
                        </select>
                    </div>
                    <label for="newZonaWaktu" class="block">Zona Waktu Baru:</label>
                    <select id="newZonaWaktu" class="swal2-input mb-2">
                        <option value="WIB" ${scheduleToEdit.zona_waktu === 'WIB' ? 'selected' : ''}>WIB (Waktu Indonesia Barat)</option>
                        <option value="WITA" ${scheduleToEdit.zona_waktu === 'WITA' ? 'selected' : ''}>WITA (Waktu Indonesia Tengah)</option>
                        <option value="WIT" ${scheduleToEdit.zona_waktu === 'WIT' ? 'selected' : ''}>WIT (Waktu Indonesia Timur)</option>
                    </select>
                    <label for="newKuota" class="block">Kuota Baru:</label>
                    <input type="number" id="newKuota" class="swal2-input mb-2" value="${scheduleToEdit.kuota}">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            showLoaderOnConfirm: true,
            customClass: {
                popup: 'popup-class',
                confirmButton: 'btn-confirm-class',
                cancelButton: 'btn-cancel-class'
            },
            preConfirm: () => {
                const newTanggal = Swal.getPopup().querySelector('#newTanggal').value;
                const newJam = Swal.getPopup().querySelector('#newJam').value;
                const newMenit = Swal.getPopup().querySelector('#newMenit').value;
                const newZonaWaktu = Swal.getPopup().querySelector('#newZonaWaktu').value;
                const newKuota = Swal.getPopup().querySelector('#newKuota').value;
    
                // Format tanggal ke "DD/MM/YYYY"
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };
    
                const formattedNewTanggal = formatDate(newTanggal);
    
                // Prepare the updated schedule object
                const updatedSchedule = {
                    ...scheduleToEdit,
                    tanggal: formattedNewTanggal,
                    jam: `${newJam}:${newMenit}`, // Update jam with newMenit
                    zona_waktu: newZonaWaktu,
                    kuota: newKuota,
                    hari: daysOfWeek[new Date(newTanggal).getDay()] // Update hari
                };
    
                // Update the schedule in the database (mocked)
                axios.put(`http://localhost:3000/schedules/${id}`, updatedSchedule)
                    .then(response => {
                        const updatedSchedules = schedules.map(schedule => {
                            if (schedule.id === id) {
                                return updatedSchedule;
                            }
                            return schedule;
                        });
                        setSchedules(updatedSchedules);
                        Swal.fire('Berhasil', 'Jadwal berhasil diperbarui!', 'success');
                    })
                    .catch(error => {
                        Swal.fire('Error', `Gagal memperbarui jadwal: ${error.message}`, 'error');
                    });
            }
        });
    };
    

    const handleDelete = (id) => {
        const scheduleToDelete = schedules.find(schedule => schedule.id === id);

        Swal.fire({
            title: 'Hapus Jadwal Konsultasi',
            html: `
                <div>
                    <p><strong>Hari:</strong> ${scheduleToDelete.hari}</p>
                    <p><strong>Tanggal:</strong> ${scheduleToDelete.tanggal}</p>
                    <p><strong>Jam:</strong> ${scheduleToDelete.jam}</p>
                    <p><strong>Zona Waktu:</strong> ${scheduleToDelete.zona_waktu}</p>
                    <p><strong>Kuota:</strong> ${scheduleToDelete.kuota}</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3000/schedules/${id}`)
                    .then(() => {
                        const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
                        setSchedules(updatedSchedules);
                        Swal.fire('Dihapus!', 'Jadwal berhasil dihapus.', 'success');
                    })
                    .catch(error => {
                        Swal.fire('Error', `Gagal menghapus jadwal: ${error.message}`, 'error');
                    });
            }
        });
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setCurrentPage(1);
    };

    const filteredSchedules = schedules.filter(schedule => schedule.tanggal.split('/')[1] === selectedMonth);

    const indexOfLastSchedule = currentPage * schedulesPerPage;
    const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
    const currentSchedules = filteredSchedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-full">
                <div className="mb-10 text-center">
                    <h2 className="mb-6 text-4xl font-bold">Jadwal Konsultasi Anda</h2>
                    <p className="text-lg text-gray-700">
                        Lihat jadwal konsultasi Anda sebagai psikolog.
                    </p>
                </div>

                <div className="mb-6">
                    <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan:</label>
                    <select
                        id="monthSelect"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Semua Bulan</option>
                        {months.map(month => (
                            <option key={month} value={month}>
                                {new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentSchedules.map((schedule, index) => (
                        <div key={schedule.id} className="flex-shrink-0 w-full p-2">
                            <div className="relative p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Jadwal Konsultasi ke-{indexOfFirstSchedule + index + 1}</h3>
                                    <p className="text-sm text-gray-600">
                                        Hari: {schedule.hari}<br />
                                        Tanggal: {schedule.tanggal}<br />
                                        Jam: {schedule.jam}<br />
                                        Zona Waktu: {schedule.zona_waktu}<br />
                                        Kuota: {schedule.kuota}
                                    </p>
                                </div>
                                <div className="flex justify-center mt-4 space-x-4">
                                    <button
                                        className="text-gray-500 hover:text-gray-800"
                                        onClick={() => handleEdit(schedule.id)}
                                    >
                                        <FaEdit size={20} />
                                        <span className="sr-only">Edit</span>
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-800"
                                        onClick={() => handleDelete(schedule.id)}
                                    >
                                        <FaTrash size={20} />
                                        <span className="sr-only">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                
            </div>
        </div>
    );
};

export default JadwalAndaPsikolog;
