import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import axios from 'axios';
import Swal from 'sweetalert2';

function AturJadwalRutinPsikolog() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [timezone, setTimezone] = useState('');
    const [showDateError, setShowDateError] = useState(false);
    const [quota, setQuota] = useState(0);
    const [schedules, setSchedules] = useState([]); // Initialize schedules state
    const [psikologId, setPsychologistId] = useState(null); // State to track psychologist ID

    useEffect(() => {
        // Retrieve psychologistId from localStorage
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        if (loggedInUser && loggedInUser.role === 'psikolog') {
            setPsychologistId(loggedInUser.id);
        } else {
            console.error('Psychologist ID not found in localStorage.');
        }

        // Fetch existing schedules or initialize them if empty
        axios.get('http://localhost:3000/schedules')
            .then(response => {
                setSchedules(response.data.length ? response.data : []);
            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
            });
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowDateError(false);
    };

    const handleTimezoneChange = (e) => {
        setTimezone(e.target.value);
    };

    const formattedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: id }) : '';
    const formattedDay = selectedDate ? format(selectedDate, 'EEEE', { locale: id }) : 'Anda belum memilih tanggal';

    // Generate options for hours and minutes
    const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));
    const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDate) {
            setShowDateError(true);
            return;
        }

        // Prepare new schedule object with a unique ID
        const newSchedule = {
            id: schedules.length ? Math.max(schedules.map(s => s.id)) + 1 : 1, // Generate unique ID
            psikologId: psikologId, // Include psychologist ID
            tanggal: formattedDate,
            hari: formattedDay,
            jam: `${e.target.hour.value}:${e.target.minute.value}`,
            zona_waktu: timezone,
            kuota: quota,
        };

        // Confirm submission
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Anda yakin ingin menyimpan jadwal ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // Save to database (db.json)
                axios.post('http://localhost:3000/schedules', newSchedule)
                    .then(response => {
                        console.log('Schedule saved:', response.data);
                        // Reset form after submission
                        setSchedules([...schedules, response.data]);
                        setSelectedDate(null);
                        setTimezone('');
                        setQuota(0);
                        setShowDateError(false);
                        Swal.fire({
                            title: 'Sukses!',
                            text: 'Jadwal berhasil disimpan.',
                            icon: 'success',
                        });
                    })
                    .catch(error => {
                        console.error('Error saving schedule:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Terjadi kesalahan saat menyimpan jadwal!',
                        });
                    });
            }
        });
    };

    return (
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="mb-6 text-4xl font-bold">Atur Jadwal Psikolog</h2>
                    <p className="text-lg text-gray-700">
                        Silahkan atur ketersediaan jadwal konsultasi anda sebagai psikolog.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3">
                        <div className="flex items-center w-full px-3 mb-4">
                            <div className="w-1/2 pr-2">
                                <label htmlFor="date" className="block mb-2 text-sm font-bold text-gray-700">Tanggal</label>
                                <div className="relative">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${showDateError ? 'border-red-500' : ''}`}
                                        placeholderText="dd/mm/yyyy"
                                        locale={id}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <span className="text-gray-500">/</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="day" className="block mb-2 text-sm font-bold text-gray-700">Hari</label>
                                <input
                                    id="day"
                                    type="text"
                                    value={formattedDate ? formattedDay : 'Anda belum memilih tanggal'}
                                    readOnly
                                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline ${showDateError ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>

                        <div className="w-full px-3 mb-4">
                            <label htmlFor="hour" className="block mb-2 text-sm font-bold text-gray-700">Jam</label>
                            <div className="flex space-x-2">
                                <select
                                    id="hour"
                                    name="hour"
                                    className="w-1/2 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Jam</option>
                                    {hours.map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select
                                    id="minute"
                                    name="minute"
                                    className="w-1/2 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Menit</option>
                                    {minutes.map(minute => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-full px-3 mb-4">
                            <label htmlFor="timezone" className="block mb-2 text-sm font-bold text-gray-700">Zona Waktu</label>
                            <select
                                id="timezone"
                                name="timezone"
                                value={timezone}
                                onChange={handleTimezoneChange}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Pilih Zona Waktu</option>
                                <option value="WIB">WIB (Waktu Indonesia Barat)</option>
                                <option value="WITA">WITA (Waktu Indonesia Tengah)</option>
                                <option value="WIT">WIT (Waktu Indonesia Timur)</option>
                            </select>
                        </div>

                        <div className="w-full px-3 mb-4">
                            <label htmlFor="quota" className="block mb-2 text-sm font-bold text-gray-700">Kuota Pasien</label>
                            <input
                                id="quota"
                                type="number"
                                name="quota"
                                min="1"
                                value={quota}
                                onChange={(e) => setQuota(parseInt(e.target.value))}
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="w-full px-3 mb-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            >
                                Simpan Jadwal
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AturJadwalRutinPsikolog;
