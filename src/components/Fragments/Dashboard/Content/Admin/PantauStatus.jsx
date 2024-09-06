import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function PantauStatus() {
    const [userConsultationData, setUserConsultationData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [statusCounts, setStatusCounts] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const counts = getStatusCounts(userConsultationData);
        setStatusCounts(counts);
    }, [userConsultationData]);

    const fetchData = async () => {
        try {
            const consultationResponse = await axios.get('http://localhost:3000/konsultasis');
            const usersResponse = await axios.get('http://localhost:3000/users');

            const consultationData = consultationResponse.data;
            const usersData = usersResponse.data;

            setUserConsultationData(consultationData);
            setUsersData(usersData);

            // Set filtered data as initial data
            setFilteredData(consultationData.map(consultation => ({
                ...consultation,
                pasienUsername: getUserNameById(consultation.pasienId, usersData),
                psikologUsername: getUserNameById(consultation.psikologId, usersData),
            })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleFilter = (e) => {
        setSearchTerm(e.target.value);
        const filteredData = userConsultationData.filter(item =>
            getUserNameById(item.pasienId, usersData).toLowerCase().includes(e.target.value.toLowerCase())
        ).map(consultation => ({
            ...consultation,
            pasienUsername: getUserNameById(consultation.pasienId, usersData),
            psikologUsername: getUserNameById(consultation.psikologId, usersData),
        }));
        setFilteredData(filteredData);
    };

    const getUserNameById = (userId, usersData) => {
        const user = usersData.find(user => user.id === userId);
        return user ? user.username : 'Unknown';
    };

    const getStatusCounts = (data) => {
        const counts = {
            waiting: 0,
            complaint: 0,
            directConsultation: 0,
            reject: 0,
            completed: 0,
        };

        data.forEach(consultation => {
            if (consultation.status === 'Menunggu') {
                counts.waiting++;
            } else if (consultation.status === 'Pedalaman Keluhan') {
                counts.complaint++;
            } else if (consultation.status === 'Konseling Langsung') {
                counts.directConsultation++;
            } else if (consultation.status === 'Ditolak') {
                counts.reject++;
            } else if (consultation.status === 'Selesai') {
                counts.completed++;
            }
        });

        return counts;
    };

    const tableHead = [
        {
            name: 'Tanggal',
            selector: 'tanggal'
        },
        {
            name: 'Jam',
            selector: 'jam'
        },
        {
            name: 'Keluhan',
            selector: 'keluhan'
        },
        {
            name: 'Psikolog',
            selector: 'psikologUsername'
        },
        {
            name: 'Pasien',
            selector: 'pasienUsername'
        },
        {
            name: 'Status',
            selector: 'status'
        },
        {
            name: 'View Rekam Medis',
            cell: row => (
                <button
                    onClick={() => handleViewMedicalRecord(row)}
                    className="px-3 py-1.5 text-white bg-blue-500 rounded text-xs sm:text-sm"
                >
                    View Rekam Medis
                </button>
            ),
            sortable: false
        },
        {
            name: 'View Rekap Konsultasi',
            cell: row => (
                <button
                    onClick={() => handleViewChattingSummary(row)}
                    className="px-3 py-1.5 text-white bg-indigo-500 rounded text-xs sm:text-sm"
                >
                    View Rekap Konsultasi
                </button>
            ),
            sortable: false
        }
    ];

    const handleViewMedicalRecord = (row) => {
        Swal.fire({
            icon: 'info',
            title: 'Rekam Medis',
            html: `
                <p class="mb-4">Pasien: ${row.pasienUsername}</p>
                <p class="mb-4">Keluhan: ${row.keluhan}</p>
                <div class="border-2 border-blue-500 rounded-lg p-4">
                    <p class="mb-4 font-semibold">Rekam Medis Pasien:</p>
                    <p class="mb-4">${row.catatanMedis}</p>
                </div>
            `,
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded',
            },
        });
    };

    const handleViewChattingSummary = (row) => {
        const hasGoogleMeetLink = !!row.linkGoogleMeet;

        let message;
        if (hasGoogleMeetLink) {
            message = "Anda pernah melakukan konseling langsung dengan psikolog kami via Google Meet.";
        } else {
            message = "Konsultasi ini tidak dilakukan via Google Meet.";
        }

        let chattingSummary = renderChattingSummary(row.conversation);
        if (chattingSummary === "") {
            chattingSummary = "<p>Anda tidak memiliki rekap konsultasi via chatting.</p>";
        }

        Swal.fire({
            icon: "info",
            title: "Rekap Konsultasi",
            html: `
                <p class="mb-4">${message}</p>
                ${chattingSummary}
            `,
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded',
            },
        });
    };

    const renderChattingSummary = (conversation) => {
        if (!conversation || conversation.length === 0) {
            return "";
        }

        let summary = '<div class="mb-4">';
        conversation.forEach((msg) => {
            summary += `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`;
        });
        summary += "</div>";
        return summary;
    };

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-4">Menunggu</h3>
                    <p className="text-4xl font-bold text-center text-blue-500">{statusCounts.waiting}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-4">Ditolak</h3>
                    <p className="text-4xl font-bold text-center text-red-500">{statusCounts.reject}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-4">Pedalaman Keluhan</h3>
                    <p className="text-4xl font-bold text-center text-yellow-500">{statusCounts.complaint}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-4">Konsultasi Langsung</h3>
                    <p className="text-4xl font-bold text-center text-green-500">{statusCounts.directConsultation}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-center mb-4">Selesai</h3>
                    <p className="text-4xl font-bold text-center text-green-500">{statusCounts.completed}</p>
                </div>
            </div>
            <hr className='my-8'/>
            <input
                className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2 mt-8 mb-2"
                type="text"
                placeholder="Cari Nama Pasien"
                value={searchTerm}
                onChange={handleFilter}
            />
            {filteredData && filteredData.length > 0 ? (
                <DataTable
                    title="Aktivitas Status Konsultasi"
                    columns={tableHead}
                    data={filteredData}
                    pagination
                />
            ) : (
                <p className="text-center mt-4">Belum Ada Aktivitas Status Konsultasi</p>
            )}
        </div>
    );
}

export default PantauStatus;