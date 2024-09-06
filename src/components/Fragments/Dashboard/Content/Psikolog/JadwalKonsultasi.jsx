import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function JadwalKonsultasiPsikolog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [konsultasiData, setKonsultasiData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showGmeetLink, setShowGmeetLink] = useState(false); // State for showing Gmeet link

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
      case "Konseling Langsung":
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
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  const renderAction = (row) => {
    switch (row.status) {
      case "Menunggu":
        return (
          <button
            onClick={() => handleReview(row)}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded focus:outline-none hover:bg-blue-600"
          >
            Review
          </button>
        );
      case "Pedalaman Keluhan":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => openChat(row)}
              className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-200 rounded shadow-sm hover:bg-purple-300"
            >
              Chat
            </button>
            <button
              onClick={() => handleFinish(row)}
              className="px-4 py-1 ml-2 text-xs font-medium text-white bg-yellow-500 rounded focus:outline-none hover:bg-yellow-600"
            >
              Klik selesai
            </button>
          </div>
        );
      case "Konseling Langsung":
        if (row.linkGoogleMeet) {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewGoogleMeetLink(row.linkGoogleMeet)}
                className="px-2 py-1 text-xs text-white bg-green-500 rounded focus:outline-none hover:bg-green-600"
              >
                View Link Gmeet
              </button>
              <button
                onClick={() => handleFinish(row)}
                className="px-2 py-1 text-xs text-white bg-yellow-500 rounded focus:outline-none hover:bg-yellow-600"
              >
                Klik selesai
              </button>
            </div>
          );
        } else {
          return (
            <button className="px-3 py-1 text-sm text-gray-600 bg-gray-300 rounded cursor-not-allowed focus:outline-none">
              Link Google Meet belum tersedia
            </button>
          );
        }
      default:
        return (
          <button className="px-3 py-1 text-sm text-gray-600 bg-gray-300 rounded cursor-not-allowed focus:outline-none">
            Tidak ada aksi yang tersedia
          </button>
        );
    }
  };
  
  

  const handleReview = async (row) => {
    if (row.status === "Menunggu") {
      Swal.fire({
        title: 'Review Konsultasi',
        html: `<p><strong>Nama Pasien:</strong> ${getUserNameById(row.pasienId)}</p><p><strong>Tanggal Konsultasi:</strong> ${row.tanggal}</p><p><strong>Jam Konsultasi:</strong> ${row.jam}</p>
          <p><strong>Keluhan:</strong> ${row.keluhan}</p>`,
        text: 'Pilih aksi untuk konsultasi ini:',
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Tolak',
        cancelButtonColor: '#d33',
        showDenyButton: true,
        denyButtonText: 'Pedalaman Keluhan via Chatting',
        denyButtonColor: '#6b46c1',
        confirmButtonText: 'Tangani Langsung via Gmeet',
        confirmButtonColor: '#3085d6',
        showCloseButton: true,
        closeButtonHtml: '<i class="fas fa-times"></i>',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleGmeet(row);
        } else if (result.isDenied) {
          await startChat(row);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Show reason for rejection form
          const { value: reason } = await Swal.fire({
            title: 'Alasan Penolakan',
            input: 'textarea',
            inputLabel: 'Masukkan alasan penolakan',
            inputPlaceholder: 'Tulis alasan penolakan di sini...',
            inputAttributes: {
              'aria-label': 'Tulis alasan penolakan di sini',
              'required': true
            },
            showCancelButton: true,
            cancelButtonText: 'Batal',
            confirmButtonText: 'Submit Penolakan',
            confirmButtonColor: '#d33',
          });
  
          if (reason) {
            // Confirm rejection
            Swal.fire({
              title: 'Konfirmasi Penolakan',
              text: `Apakah Anda yakin ingin menolak konsultasi ini?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ya, Saya Yakin Tolak',
              cancelButtonText: 'Batal',
            }).then(async (confirmResult) => {
              if (confirmResult.isConfirmed) {
                await handleRejection(row, reason);
              }
            });
          }
        }
      });
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

  const handleGmeet = async (row) => {
    try {
      const response = await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...row,
          status: 'Konseling Langsung',
          adminId: 1,
        }),
      });
  
      if (response.ok) {
        const updatedData = konsultasiData.map((item) =>
          item.id === row.id ? { ...item, status: 'Konseling Langsung', adminId: 'id_admin_yang_diambil_dari_db' } : item
        );
        setKonsultasiData(updatedData);
        setShowGmeetLink(true);
        Swal.fire('Success!', 'Konseling langsung telah disetujui.', 'success');
      } else {
        console.error('Error updating data');
        Swal.fire('Error', 'Terjadi kesalahan saat memproses permintaan.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Terjadi kesalahan saat memproses permintaan.', 'error');
    }
  };

  const startChat = async (row) => {
    const response = await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...row,
        status: 'Pedalaman Keluhan',
        conversation: [], // Initialize conversation array
      }),
    });

    if (response.ok) {
      const updatedData = konsultasiData.map((item) =>
        item.id === row.id ? { ...item, status: 'Pedalaman Keluhan', conversation: [] } : item
      );
      setKonsultasiData(updatedData);
      openChat(row);
    } else {
      console.error('Error updating data');
      Swal.fire('Error', 'Terjadi kesalahan saat memproses permintaan.', 'error');
    }
  };

  const openChat = (row) => {
    MySwal.fire({
      title: 'Chat dengan ' + getUserNameById(row.pasienId),
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
      showDenyButton: true,
      denyButtonText: 'Tangani lebih lanjut via Gmeet',
      denyButtonColor: '#3085d6',
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
        const updatedConversation = [...row.conversation, { sender: 'Psikolog ' + getUserNameById(row.psikologId), text: chatMessage }];
  
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
      } else if (result.isDenied) {
        await handleGmeet(row); // Panggil handleGmeet untuk mengubah status dan memanggil adminId
      }
    });
  };  

  const handleRejection = async (row, reason) => {
    try {
      const response = await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...row,
          status: 'Ditolak',
          rejectionReason: reason,
        }),
      });
  
      if (response.ok) {
        const updatedData = konsultasiData.map((item) =>
          item.id === row.id ? { ...item, status: 'Ditolak', rejectionReason: reason } : item
        );
        setKonsultasiData(updatedData);
        Swal.fire('Success!', 'Konsultasi telah ditolak dengan alasan.', 'success');
      } else {
        console.error('Error updating data');
        Swal.fire('Error', 'Terjadi kesalahan saat memproses penolakan.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Terjadi kesalahan saat memproses penolakan.', 'error');
    }
  };

  const handleFinish = async (row) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menyelesaikan sesi konsultasi ini?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Selesaikan',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      const followUpResult = await Swal.fire({
        title: 'Apakah butuh untuk konsultasi lanjutan?',
        text: 'Pilih salah satu:',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'IYA',
        cancelButtonText: 'TIDAK',
        cancelButtonColor: '#d33',
      });
  
      if (followUpResult.isConfirmed) {
        try {
          const schedulesResponse = await fetch(`http://localhost:3000/schedules?psikologId=${loggedInUser.id}`);
          const schedules = await schedulesResponse.json();
  
          const today = new Date();
  
          const filteredSchedules = schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.tanggal.split('/').reverse().join('/'));
            return schedule.kuota > 0 && scheduleDate >= today;
          });
  
          if (filteredSchedules.length === 0) {
            Swal.fire('Tidak ada jadwal', 'Tidak ada jadwal konsultasi lanjutan yang tersedia.', 'info');
            return;
          }
  
          const { value: selectedScheduleId } = await Swal.fire({
            title: 'Pilih Jadwal Konsultasi Lanjutan',
            input: 'select',
            inputOptions: filteredSchedules.reduce((options, schedule) => {
              options[schedule.id] = `${schedule.tanggal} ${schedule.hari} ${schedule.jam} (${schedule.zona_waktu})`;
              return options;
            }, {}),
            inputLabel: 'Jadwal Konsultasi',
            inputPlaceholder: 'Pilih jadwal',
            showCancelButton: true,
            confirmButtonText: 'Berikutnya',
          });
  
          if (selectedScheduleId) {
            const selectedSchedule = filteredSchedules.find(schedule => schedule.id === parseInt(selectedScheduleId));
  
            const newConsultation = {
              tanggal: selectedSchedule.tanggal,
              jam: selectedSchedule.jam,
              keluhan: `${row.keluhan} (Penjadwalan Konsultasi Lanjutan dengan Psikolog ${loggedInUser.username})`,
              psikologId: loggedInUser.id,
              pasienId: row.pasienId,
              status: "Menunggu",
            };
  
            await fetch('http://localhost:3000/konsultasis', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newConsultation),
            });
  
            // Update the quota
            const updatedSchedule = { ...selectedSchedule, kuota: selectedSchedule.kuota - 1 };
            await fetch(`http://localhost:3000/schedules/${selectedSchedule.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedSchedule),
            });
  
            await handleMedicalRecords(row);
          }
        } catch (error) {
          console.error('Error fetching schedules:', error);
          Swal.fire('Error', 'Terjadi kesalahan saat mengambil jadwal.', 'error');
        }
      } else {
        await handleMedicalRecords(row);
      }
    }
  };
  
  const handleMedicalRecords = async (row) => {
    const { value: catatanMedis } = await Swal.fire({
      title: 'Catatan Medis',
      input: 'textarea',
      inputLabel: 'Masukkan catatan medis pasien',
      inputPlaceholder: 'Tulis catatan medis di sini...',
      inputAttributes: {
        'aria-label': 'Tulis catatan medis di sini',
      },
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonText: 'Simpan',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
  
    if (catatanMedis) {
      const updatedKonsultasiData = konsultasiData.map((konsultasi) =>
        konsultasi.id === row.id ? { ...konsultasi, status: "Selesai", catatanMedis } : konsultasi
      );
  
      setKonsultasiData(updatedKonsultasiData);
  
      await fetch(`http://localhost:3000/konsultasis/${row.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...row, status: "Selesai", catatanMedis }),
      });
  
      Swal.fire('Selesai!', 'Sesi konsultasi telah diselesaikan.', 'success');
    }
  };
  
  

  const handleViewGmeet = (row) => {
    MySwal.fire({
      title: 'Link Gmeet',
      text: 'Link Gmeet untuk konsultasi ini: ' + row.gmeetLink,
      icon: 'info',
      showCloseButton: true,
      closeButtonHtml: '<i class="fas fa-times"></i>',
    });
  };

  const filteredData = konsultasiData.filter(
    (row) => loggedInUser && row.psikologId === loggedInUser.id
  );

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <input
        className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2 mb-3"
        type="text"
        placeholder="Cari Nama Pasien"
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
        <p className="text-center">Tidak ada konsultasi untuk ditinjau</p>
      )}
    </div>
  );
}

export default JadwalKonsultasiPsikolog;