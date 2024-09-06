import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function RiwayatKonsultasiPasien() {
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

  // Define the common columns for all statuses
  const commonColumns = [
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
      name: "Nama Psikolog",
      selector: "psikologId",
      cell: (row) => getUserNameById(row.psikologId),
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
  ];

  // Define the conditional columns
  const conditionalColumns = [
    {
      name: "Rekam Medis",
      cell: (row) => (
        <button
          onClick={() => handleViewMedicalRecord(row)}
          disabled={row.status === "Ditolak"}
          className={`px-3 py-1.5 text-white ${row.status === "Ditolak" ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'} rounded text-xs sm:text-sm`}
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
          disabled={row.status === "Ditolak"}
          className={`px-3 py-1.5 text-white ${row.status === "Ditolak" ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500'} rounded text-xs sm:text-sm`}
        >
          View Rekap Konsultasi
        </button>
      ),
      sortable: false,
    },
    {
      name: "Testimoni",
      cell: (row) => (
        <button
          onClick={() => handleGiveTestimony(row)}
          disabled={row.status === "Ditolak" || (row.testimonies && row.testimonies.length > 0)}
          className={`px-3 py-1.5 text-white ${row.status === "Ditolak" || (row.testimonies && row.testimonies.length > 0) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500'} rounded text-xs sm:text-sm`}
        >
          {row.testimonies && row.testimonies.length > 0 ? 'Testimoni Diberikan' : 'Beri Testimoni'}
        </button>
      ),
      sortable: false,
    },
    {
      name: "Penolakan",
      cell: (row) => (
        <button
          onClick={() => handleViewRejectionReason(row)}
          disabled={row.status === "Selesai"}
          className={`px-3 py-1.5 text-white ${row.status === "Selesai" ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500'} rounded text-xs sm:text-sm`}
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

  const handleViewRejectionReason = (row) => {
    Swal.fire({
      icon: "info",
      title: "Alasan Penolakan",
      html: `<p>${row.rejectionReason || "Alasan penolakan tidak tersedia."}</p>`,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-blue-500 text-white px-4 py-2 rounded",
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

  const handleViewMedicalRecord = (row) => {
    Swal.fire({
      icon: "info",
      title: "Rekam Medis",
      html: `
        <p class="mb-4">Pasien: ${getUserNameById(row.pasienId)}</p>
        <p class="mb-4">Keluhan: ${row.keluhan}</p>
        <div class="border-2 border-blue-500 rounded-lg p-4">
          <p class="mb-4 font-semibold">Rekam Medis Anda:</p>
                    <p class="mb-4">${row.catatanMedis}</p>
        </div>
      `,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-blue-500 text-white px-4 py-2 rounded",
      },
    });
  };

  const handleGiveTestimony = (row) => {
    if (row.testimonies && row.testimonies.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Anda sudah memberikan testimoni untuk konsultasi ini.',
      });
      return;
    }

    Swal.fire({
      title: 'Beri Testimoni',
      html: `
        <div style="display: flex; flex-direction: column;">
          <input type="number" id="rating" class="swal2-input" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Rating (1-5)" inputmode="numeric" pattern="[1-5]" min="1" max="5">
        </div>

        <br>
        <span class="text-sm text-gray-500 mt-2 mb-2">1: sangat buruk, 5: sangat bagus</span>
        <div style="display: flex; flex-direction: column;">
          <textarea id="review" class="swal2-textarea" style="flex: 1; min-height: 100px; resize: vertical; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Ulasan"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const rating = parseInt(Swal.getPopup().querySelector('#rating').value);
        const review = Swal.getPopup().querySelector('#review').value;
        if (!rating || !review) {
          Swal.showValidationMessage(`Masukkan rating dan ulasan`);
        } else if (rating < 1 || rating > 5) {
          Swal.showValidationMessage(`Rating harus antara 1 dan 5`);
        }
        return { rating: rating, review: review };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { rating, review } = result.value;
        const updatedTestimonies = row.testimonies ? [...row.testimonies] : [];

        updatedTestimonies.push({ rating, review });

        axios
          .put(`http://localhost:3000/konsultasis/${row.id}`, {
            ...row,
            testimonies: updatedTestimonies.map((testimony) => ({
              rating: parseInt(testimony.rating),
              review: testimony.review,
            })),
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Testimoni telah ditambahkan!",
              showConfirmButton: false,
              timer: 1500,
            });

            // Update the local state to reflect the new testimonies data
            setKonsultasiData((prevData) =>
              prevData.map((item) =>
                item.id === row.id ? { ...item, testimonies: updatedTestimonies } : item
              )
            );
          })
          .catch((error) => {
            console.error("Error adding testimony:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };

  // Filter data based on the logged-in user and status
  const userConsultationData = konsultasiData.filter(
    (row) =>
      loggedInUser &&
      row.pasienId === loggedInUser.id &&
      (row.status === "Selesai" || row.status === "Ditolak")
  );

  // Filter data based on the search term
  const filteredData = userConsultationData.filter((row) =>
    getUserNameById(row.psikologId)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Conditionally set columns based on the row status
  const getColumns = (row) => {
    const columns = [
      ...commonColumns,
      ...conditionalColumns,
    ];

    if (row.status === "Selesai") {
      return columns.map((col) =>
        col.name === "Penolakan"
          ? {
              ...col,
              cell: (row) => (
                <button
                  onClick={() => handleViewRejectionReason(row)}
                  disabled
                  className="px-3 py-1.5 text-white bg-gray-300 cursor-not-allowed rounded text-xs sm:text-sm"
                >
                  View Alasan Penolakan
                </button>
              ),
            }
          : col
      );
    } else if (row.status === "Ditolak") {
      return columns.map((col) =>
        ["Rekam Medis", "Rekap Konsultasi", "Testimoni"].includes(col.name)
          ? {
              ...col,
              cell: (row) => (
                <button
                  onClick={col.cell(row).props.onClick}
                  disabled
                  className="px-3 py-1.5 text-white bg-gray-300 cursor-not-allowed rounded text-xs sm:text-sm"
                >
                  {col.name}
                </button>
              ),
            }
          : col
      );
    }

    return columns;
  };

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <input
        className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2 mb-3"
        type="text"
        placeholder="Cari Nama Psikolog"
        onChange={handleFilter}
      />
      {userConsultationData.length > 0 ? (
        <DataTable
          title="Riwayat Konsultasi Pasien"
          columns={filteredData.map(row => getColumns(row)).flat()}
          data={filteredData}
          pagination
        />
      ) : (
        <p className="text-center">Belum ada riwayat konsultasi</p>
      )}
    </div>
  );
}

export default RiwayatKonsultasiPasien;
