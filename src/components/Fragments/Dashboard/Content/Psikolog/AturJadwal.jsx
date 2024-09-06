import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format, differenceInSeconds, addMonths } from 'date-fns';
import id from 'date-fns/locale/id';

function AturJadwalPsikolog() {
    const [selectedDays, setSelectedDays] = useState([]);
    const [step, setStep] = useState(1);
    const [timezone, setTimezone] = useState('');
    const [quota, setQuota] = useState(0);
    const [schedules, setSchedules] = useState([]);
    const [psikologId, setPsychologistId] = useState(null);
    const [dayTimezone, setDayTimezone] = useState({});
    const [dayQuota, setDayQuota] = useState({});
    const [nextScheduleDate, setNextScheduleDate] = useState(null);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        if (loggedInUser && loggedInUser.role === 'psikolog') {
            setPsychologistId(loggedInUser.id);
        } else {
            console.error('Psychologist ID not found in localStorage.');
        }

        axios.get('http://localhost:3000/schedules')
            .then(response => {
                const userSchedules = response.data.filter(schedule => schedule.psikologId === loggedInUser.id);
                if (userSchedules.length > 0) {
                    setNextScheduleDate(new Date(userSchedules[0].tanggal.split('/').reverse().join('-')));
                }
                setSchedules(response.data);
            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
            });
    }, []);

    useEffect(() => {
        if (nextScheduleDate) {
            const interval = setInterval(() => {
                setCountdown(calculateCountdown());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [nextScheduleDate]);

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleTimezoneChange = (day, value) => {
        setDayTimezone(prevState => ({
            ...prevState,
            [day]: value,
        }));
    };

    const handleQuotaChange = (day, value) => {
        setDayQuota(prevState => ({
            ...prevState,
            [day]: parseInt(value),
        }));
    };

    const handleReset = () => {
        setSelectedDays([]);
        setTimezone('');
        setQuota(0);
        setDayTimezone({});
        setDayQuota({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedDays.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Pilih minimal satu hari untuk jadwal rutin!',
            });
            return;
        }

        const today = new Date();
        const startDate = today;
        const endDate = addMonths(today, 3);

        let scheduleId = schedules.length ? Math.max(...schedules.map(s => s.id)) + 1 : 1;

        const newSchedules = {};

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayName = format(date, 'EEEE', { locale: id });

            if (selectedDays.includes(dayName)) {
                newSchedules[scheduleId] = {
                    id: scheduleId,
                    psikologId: psikologId,
                    tanggal: format(date, 'dd/MM/yyyy', { locale: id }),
                    hari: dayName,
                    jam: `${e.target[`hour_${dayName}`]?.value || '00'}:${e.target[`minute_${dayName}`]?.value || '00'}`,
                    zona_waktu: dayTimezone[dayName] || 'WIB',
                    kuota: dayQuota[dayName] || 0,
                };
                scheduleId++;
            }
        }

        if (Object.keys(newSchedules).length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Tidak ada jadwal yang dibuat karena tidak ada hari yang cocok di periode ini!',
            });
            return;
        }

        Swal.fire({
            title: 'Konfirmasi',
            text: 'Anda yakin ingin menyimpan jadwal ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                const schedulePromises = Object.values(newSchedules).map(schedule =>
                    axios.post('http://localhost:3000/schedules', schedule)
                );

                Promise.all(schedulePromises)
                    .then(responses => {
                        setSchedules([...schedules, ...Object.values(newSchedules)]);
                        setSelectedDays([]);
                        setTimezone('');
                        setQuota(0);
                        setStep(1);
                        setNextScheduleDate(startDate);
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

    const calculateCountdown = () => {
        const now = new Date();
        if (!nextScheduleDate) return {};
        const end = addMonths(nextScheduleDate, 3);
        const seconds = differenceInSeconds(end, now);
        return {
            days: Math.floor(seconds / (3600 * 24)),
            hours: Math.floor((seconds % (3600 * 24)) / 3600),
            minutes: Math.floor((seconds % 3600) / 60),
            seconds: seconds % 60,
        };
    };

    return (
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="mb-6 text-4xl font-bold">Atur Jadwal Psikolog</h2>
                    {selectedDays.length > 0 && (
                        <p className="mb-4 text-lg text-gray-700">
                            Hari yang dipilih untuk jadwal rutin Anda adalah: {selectedDays.join(', ')}
                        </p>
                    )}
                    <p className="text-lg text-gray-700">
                        Silahkan atur ketersediaan jadwal konsultasi Anda sebagai psikolog.
                    </p>
                </div>

                {nextScheduleDate ? (
                    <div className="text-center">
                        <p className="mb-4 text-lg text-gray-700">
                            Anda dapat mengatur jadwal psikolog anda dalam:
                        </p>
                        <div className="text-2xl font-bold text-gray-800">
                            {countdown.days} Days {countdown.hours} Hours {countdown.minutes} Minutes {countdown.seconds} Seconds
                        </div>
                        <p className="mt-4 text-lg text-gray-700">
                            Jadwal berikutnya dapat diatur pada: {format(addMonths(nextScheduleDate, 3), 'dd/MM/yyyy', { locale: id })}
                        </p>
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                    <form className="space-y-4" onSubmit={() => setStep(2)}>
                        <div className="w-full px-3 mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700">Pilih Hari</label>
                            <div className="grid grid-cols-2 gap-2">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`flex items-center justify-center w-full h-12 border rounded-lg focus:outline-none focus:shadow-outline ${
                                            selectedDays.includes(day)
                                                ? 'bg-blue-500 text-white hover:bg-blue-700'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full px-3 mb-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            >
                                Selanjutnya
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2 mt-2 font-bold text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:shadow-outline"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {selectedDays.map(day => (
                            <div key={day} className="w-full px-3 mb-8">
                                <div className="mb-2 text-lg font-bold text-gray-700">{day}</div>

                                <div className="flex mb-4 space-x-2">
                                    <div className="w-1/2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700">Jam</label>
                                        <div className="flex space-x-2">
                                            <select
                                                id={`hour_${day}`}
                                                name={`hour_${day}`}
                                                className="w-1/2 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                            >
                                                <option value="">Jam</option>
                                                {Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)).map(hour => (
                                                    <option key={hour} value={hour}>{hour}</option>
                                                ))}
                                            </select>
                                            <select
                                                id={`minute_${day}`}
                                                name={`minute_${day}`}
                                                className="w-1/2 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                            >
                                                <option value="">Menit</option>
                                                {Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)).map(minute => (
                                                    <option key={minute} value={minute}>{minute}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700">Zona Waktu</label>
                                        <select
                                            value={dayTimezone[day] || 'WIB'}
                                            onChange={(e) => handleTimezoneChange(day, e.target.value)}
                                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                        >
                                            <option value="WIB">WIB (GMT+7)</option>
                                            <option value="WITA">WITA (GMT+8)</option>
                                            <option value="WIT">WIT (GMT+9)</option>
                                        </select>
                                    </div>
                                </div>

                                <label className="block mb-2 text-sm font-bold text-gray-700">Kuota</label>
                                <input
                                    type="number"
                                    value={dayQuota[day] || ''}
                                    onChange={(e) => handleQuotaChange(day, e.target.value)}
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                    placeholder="Masukkan kuota"
                                />
                            </div>
                        ))}

                        <div className="w-full px-3 mb-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            >
                                Simpan Jadwal
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2 mt-2 font-bold text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:shadow-outline"
                                onClick={() => setStep(1)}
                            >
                                Kembali
                            </button>
                        </div>
                    </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AturJadwalPsikolog;
