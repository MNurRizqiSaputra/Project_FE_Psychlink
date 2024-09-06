import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function RiwayatKonsultasiPsikolog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [konsultasiData, setKonsultasiData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const konsultasiResponse = await axios.get("http://localhost:3000/konsultasis");
        const userDataResponse = await axios.get("http://localhost:3000/users");

        setKonsultasiData(konsultasiResponse.data);
        setUserData(userDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  const getUserNameById = (userId) => {
    const user = userData.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
  };

  const tableHead = [
    {
      name: "Tanggal Konsultasi",
      selector: "tanggal",
      sortable: true,
    },
    {
      name: "Jam Konsultasi",
      selector: "jam",
      sortable: true,
    },
    {
      name: "Nama Pasien",
      selector: "pasienId",
      cell: (row) => getUserNameById(row.pasienId),
      sortable: true,
    },
    {
      name: "Keluhan",
      selector: "keluhan",
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Status",
      cell: (row) => renderStatus(row.status),
      sortable: true,
    },
    {
      name: "Rekam Medis",
      cell: (row) => (
        <button
          onClick={() => handleViewMedicalRecord(row)}
          className={`px-3 py-1.5 rounded text-xs sm:text-sm ${row.status === "Ditolak" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          disabled={row.status === "Ditolak"}
        >
          View Rekam Medis
        </button>
      ),
      sortable: false,
    },
    {
      name: "Rekap Konsultasi",
      cell: (row) => (
        <button
          onClick={() => handleViewChattingSummary(row)}
          className={`px-3 py-1.5 rounded text-xs sm:text-sm ${row.status === "Ditolak" ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-500 text-white"}`}
          disabled={row.status === "Ditolak"}
        >
          View Rekap Konsultasi
        </button>
      ),
      sortable: false,
    },
    {
      name: "Alasan Penolakan",
      cell: (row) => (
        <button
          onClick={() => handleViewRejectionReason(row)}
          className={`px-3 py-1.5 rounded text-xs sm:text-sm ${row.status === "Selesai" ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white"}`}
          disabled={row.status === "Selesai"}
        >
          View Alasan Penolakan
        </button>
      ),
      sortable: false,
    },
  ];

  const renderStatus = (status) => {
    switch (status) {
      case "Menunggu":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      case "Disetujui":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      case "Ditolak":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      case "Selesai":
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      default:
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  const handleViewMedicalRecord = (row) => {
    Swal.fire({
      icon: "info",
      title: "Rekam Medis",
      html: `
        <p class="mb-4">Pasien: ${getUserNameById(row.pasienId)}</p>
        <p class="mb-4">Keluhan: ${row.keluhan}</p>
        <div class="border-2 border-blue-500 rounded-lg p-4">
          <p class="mb-4 font-semibold">Rekam Medis Pasien:</p>
          <p class="mb-4">${row.catatanMedis}</p>
        </div>
      `,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-blue-500 text-white px-4 py-2 rounded",
      },
    });
  };

  const handleViewRejectionReason = (row) => {
    Swal.fire({
      icon: "info",
      title: "Alasan Penolakan",
      html: `
        <p class="mb-4">Pasien: ${getUserNameById(row.pasienId)}</p>
        <p class="mb-4">Keluhan: ${row.keluhan}</p>
        <div class="border-2 border-red-500 rounded-lg p-4">
          <p class="mb-4 font-semibold">Alasan Penolakan:</p>
          <p class="mb-4">${row.rejectionReason || "Tidak ada alasan penolakan."}</p>
        </div>
      `,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-red-500 text-white px-4 py-2 rounded",
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

  const userConsultationData = konsultasiData.filter(
    (row) =>
      loggedInUser &&
      row.psikologId === loggedInUser.id &&
      (row.status === "Selesai" || row.status === "Ditolak")
  );

  const filteredData = userConsultationData.filter((row) =>
    getUserNameById(row.pasienId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <input
        className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2 mb-3"
        type="text"
        placeholder="Cari Nama Pasien"
        onChange={handleFilter}
      />
      {userConsultationData.length > 0 ? (
        <DataTable
          title="Riwayat Konsultasi Psikolog"
          columns={tableHead}
          data={filteredData}
          pagination
        />
      ) : (
        <p className="text-center">Belum ada riwayat konsultasi</p>
      )}
    </div>
  );
}

export default RiwayatKonsultasiPsikolog;
