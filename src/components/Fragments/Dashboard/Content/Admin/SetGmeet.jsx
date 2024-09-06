import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function SetMeet() {
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
        const konsultasiResponse = await fetch("http://localhost:3000/konsultasis");
        const userDataResponse = await fetch("http://localhost:3000/users");

        const konsultasiData = await konsultasiResponse.json();
        const userData = await userDataResponse.json();

        setKonsultasiData(konsultasiData);
        setUserData(userData);
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
    const user = userData.find(user => user.id === userId);
    return user ? user.username : 'Unknown User';
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
      name: "Nama Psikolog",
      selector: "psikologId",
      cell: (row) => getUserNameById(row.psikologId),
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
      grow: 2, // Adjust the value based on your layout and preferences
      wrap: true, // Wrap the content to the next line if it's too long
    },
    {
      name: "Status",
      cell: (row) => renderStatus(row.status),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => renderAction(row),
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
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      case "Pedalaman Keluhan":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      case "Konseling Langsung":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
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

  const handleViewGoogleMeetLink = (row) => {
    MySwal.fire({
      icon: "info",
      title: "Google Meet Link",
      html: `
        <p class="mb-4">Link: <input id="linkInput" class="w-full p-2 border rounded text-center" type="text" value="${row.linkGoogleMeet}" readonly></p>
        <button id="copyButton" class="bg-green-500 text-white px-4 py-2 rounded">Salin</button>
        <button id="editButton" class="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
        <button id="openButton" class="bg-blue-500 text-white px-4 py-2 rounded">Buka Link</button>
        <button id="cancelButton" class="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
      `,
      showCancelButton: false,
      showConfirmButton: false,
    });
  
    const copyButton = document.getElementById("copyButton");
    const editButton = document.getElementById("editButton");
    const openButton = document.getElementById("openButton");
    const cancelButton = document.getElementById("cancelButton");
  
    copyButton.addEventListener("click", () => {
      const inputField = document.getElementById("linkInput");
      inputField.select();
      inputField.setSelectionRange(0, 99999); // For mobile devices
      document.execCommand("copy");
  
      Swal.fire({
        icon: "success",
        title: "Link tersalin!",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  
    editButton.addEventListener("click", () => {
      MySwal.fire({
        title: 'Edit Google Meet Link',
        input: 'text',
        inputLabel: 'Link Google Meet',
        inputValue: row.linkGoogleMeet,
        inputPlaceholder: 'Masukkan link Google Meet di sini',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: (link) => {
          if (!link) {
            Swal.showValidationMessage('Link tidak boleh kosong');
          }
          return link;
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          const newLinkGoogleMeet = result.value;
  
          MySwal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
          }).then(async (confirmationResult) => {
            if (confirmationResult.isConfirmed) {
              const response = await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...row,
                  linkGoogleMeet: newLinkGoogleMeet,
                }),
              });
  
              if (response.ok) {
                const updatedData = konsultasiData.map((item) =>
                  item.id === row.id ? { ...item, linkGoogleMeet: newLinkGoogleMeet } : item
                );
                setKonsultasiData(updatedData);
                Swal.fire('Berhasil', 'Link Google Meet telah diperbarui', 'success');
              } else {
                console.error('Error updating data');
                Swal.fire('Error', 'Terjadi kesalahan saat memperbarui link.', 'error');
              }
            }
          });
        }
      });
    });
  
    openButton.addEventListener("click", () => {
      window.open(row.linkGoogleMeet, "_blank");
    });
  
    cancelButton.addEventListener("click", () => {
      MySwal.close();
    });
  };
  
  
  const renderAction = (row) => {
    switch (row.status) {
      case "Menunggu":
        return (
          <button
            onClick={() => handleReview(row)}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Review
          </button>
        );
      case "Pedalaman Keluhan":
        return (
          <button
            onClick={() => openChat(row)}
            className="px-4 py-2 text-white bg-purple-500 rounded"
          >
            Chat
          </button>
        );
      case "Konseling Langsung":
        return row.linkGoogleMeet ? (
          <button
            onClick={() => handleViewGoogleMeetLink(row)}
            className="px-4 py-2 text-white bg-green-500 rounded"
          >
            View Link Gmeet
          </button>
        ) : (
          <button
            onClick={() => promptForMeetingLink(row)}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Set Link Gmeet
          </button>
        );
      default:
        return (
          <button className="px-4 py-2 text-gray-600 bg-gray-300 rounded" disabled>
            Tinjau
          </button>
        );
    }
  };

  const promptForMeetingLink = (row) => {
    MySwal.fire({
      title: 'Set Google Meet Link',
      input: 'text',
      inputLabel: 'Link Google Meet',
      inputPlaceholder: 'Masukkan link Google Meet di sini',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      preConfirm: (link) => {
        if (!link) {
          Swal.showValidationMessage('Link tidak boleh kosong');
        }
        return link;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const linkGoogleMeet = result.value;
        
        MySwal.fire({
          title: 'Konfirmasi',
          text: 'Apakah Anda yakin ingin menyimpan link ini?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Simpan',
          cancelButtonText: 'Batal',
        }).then(async (confirmationResult) => {
          if (confirmationResult.isConfirmed) {
            const response = await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...row,
                linkGoogleMeet,
              }),
            });
  
            if (response.ok) {
              const updatedData = konsultasiData.map((item) =>
                item.id === row.id ? { ...item, linkGoogleMeet } : item
              );
              setKonsultasiData(updatedData);
              Swal.fire('Berhasil', 'Link Google Meet telah disimpan', 'success');
            } else {
              console.error('Error updating data');
              Swal.fire('Error', 'Terjadi kesalahan saat menyimpan link.', 'error');
            }
          }
        });
      }
    });
  };

  const filteredData = konsultasiData.filter(
    (row) => row.status === "Konseling Langsung" &&
    getUserNameById(row.psikologId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <input
        className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2 mb-3"
        type="text"
        placeholder="Cari Nama Psikolog"
        onChange={handleFilter}
      />
      {filteredData.length > 0 ? (
        <DataTable
          title="Jadwal Konsultasi Psikolog"
          columns={tableHead}
          data={filteredData}
          pagination
        />
      ) : (
        <p className="text-center">Tidak ada konsultasi dengan status "Konseling Langsung"</p>
      )}
    </div>
  );
}

export default SetMeet;
