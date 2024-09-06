import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function JadwalKonsultasiPasien() {
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
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
      case "Pedalaman Keluhan":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
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
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  const handleViewGoogleMeetLink = (link) => {
    Swal.fire({
      icon: "info",
      title: "Google Meet Link",
      html: `
        <p class="mb-4">Link: <input id="linkInput" class="w-full p-2 border rounded text-center" type="text" value="${link}" readonly></p>
        <button id="copyButton" class="bg-green-500 text-white px-4 py-2 rounded">Salin</button>
      `,
      showCancelButton: true,
      confirmButtonText: "Buka Link",
      customClass: {
        confirmButton: "bg-blue-500 text-white px-4 py-2 rounded",
        cancelButton: "bg-gray-300 text-gray-600 px-4 py-2 rounded",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(link, "_blank"); // Open link in a new tab
      }
    });

    const copyButton = document.getElementById("copyButton");
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
  };

  const renderAction = (row) => {
    switch (row.status) {
      case "Menunggu":
        return (
          <button
            onClick={() => handleReview(row)}
            className="px-4 py-2 text-gray-600 bg-gray-300 rounded"
          >
            Harap ditunggu
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
            onClick={() => handleViewGoogleMeetLink(row.linkGoogleMeet)}
            className="px-4 py-2 text-white bg-green-500 rounded"
          >
            View Link Gmeet
          </button>
        ) : (
          <button className="px-4 py-2 text-gray-600 bg-gray-300 rounded" disabled>
            Link Google Meet belum tersedia
          </button>
        );
      default:
        return (
          <button className="px-4 py-2 text-gray-600 bg-gray-300 rounded" disabled>
            Konsultasi Selesai
          </button>
        );
    }
  };

  

  const openChat = (row) => {
    MySwal.fire({
      title: 'Chat dengan ' + getUserNameById(row.psikologId),
      html: `
        <div id="chatBox" style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
          ${row.conversation.map(message => `<p><strong>${message.sender}:</strong> ${message.text}</p>`).join('')}
        </div>
        <div style="display: flex; flex-direction: column;">
          <textarea id="chatMessage" class="swal2-textarea" style="flex: 1; min-height: 100px; resize: vertical; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Type your message here..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Close',
      preConfirm: () => {
        const chatMessage = Swal.getPopup().querySelector("#chatMessage").value;
        if (!chatMessage) {
          Swal.showValidationMessage("Please enter a message");
        }
        return chatMessage;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const chatMessage = result.value;
        const updatedConversation = [...row.conversation, { sender: 'Pasien ' + getUserNameById(row.pasienId), text: chatMessage }];

        const response = await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...row,
            conversation: updatedConversation,
          }),
        });

        if (response.ok) {
          const updatedData = konsultasiData.map((item) =>
            item.id === row.id ? { ...item, conversation: updatedConversation } : item
          );
          setKonsultasiData(updatedData);
          openChat({ ...row, conversation: updatedConversation });
        } else {
          console.error('Error updating data');
          Swal.fire('Error', 'Terjadi kesalahan saat memproses permintaan.', 'error');
        }
      }
    });
  };

  const userConsultationData = konsultasiData.filter(
    (row) => loggedInUser && row.pasienId === loggedInUser.id
  );

  const filteredData = userConsultationData.filter((row) =>
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
      {userConsultationData.length > 0 ? (
        <DataTable
          title="Jadwal Konsultasi Pasien"
          columns={tableHead}
          data={filteredData}
          pagination
        />
      ) : (
        <p className="text-center">Belum mengajukan konsultasi</p>
      )}
    </div>
  );
}

export default JadwalKonsultasiPasien;
