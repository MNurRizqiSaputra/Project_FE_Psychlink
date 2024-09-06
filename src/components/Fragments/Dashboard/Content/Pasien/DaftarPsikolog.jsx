import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";

function DaftarPsikologPasien() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [psikologData, setPsikologData] = useState([]);
  const [konsultasiData, setKonsultasiData] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const storedUserDataString = localStorage.getItem("user");
  
    if (!storedUserDataString) {
      console.error("User data not found in local storage.");
      return;
    }
  
    try {
      const storedUserData = JSON.parse(storedUserDataString);
  
      axios
        .get("http://localhost:3000/users")
        .then((response) => {
          const user = response.data.find(
            (userData) => userData.id === storedUserData.id
          );
  
          if (!user) {
            console.error("Logged-in user not found in the fetched data.");
            return;
          }
  
          setLoggedInUser(user);
  
          const psikologs = response.data.filter(
            (userData) => userData.role === "psikolog"
          );
  
          setPsikologData(psikologs);
  
          axios
            .get("http://localhost:3000/konsultasis")
            .then((response) => {
              setKonsultasiData(response.data);
            })
            .catch((error) => {
              console.error("Error fetching konsultasi data:", error);
            });
  
          axios
            .get("http://localhost:3000/schedules")
            .then((response) => {
              // Sort schedules by ID in ascending order
              const sortedSchedules = response.data.sort((a, b) => a.id - b.id);
              setSchedules(sortedSchedules);
            })
            .catch((error) => {
              console.error("Error fetching schedules data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
    }
  }, []);
  

  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  const calculateAverageRating = (psikologId) => {
    const konsultasis = konsultasiData.filter(
      (konsultasi) => konsultasi.psikologId === psikologId
    );
    if (!konsultasis.length) return 0;

    let totalRating = 0;
    let totalTestimonies = 0;
    konsultasis.forEach((konsultasi) => {
      if (konsultasi.testimonies && konsultasi.testimonies.length) {
        konsultasi.testimonies.forEach((testimony) => {
          totalRating += parseInt(testimony.rating); // Parse rating sebagai angka
          totalTestimonies++;
        });
      }
    });

    return totalTestimonies > 0 ? totalRating / totalTestimonies : 0; // Periksa apakah ada testimoni sebelum menghitung rata-rata
  };

  const getTestimonies = (psikologId) => {
    const konsultasis = konsultasiData.filter(
      (konsultasi) => konsultasi.psikologId === psikologId
    );
    if (!konsultasis.length) return [];

    let testimonies = [];
    konsultasis.forEach((konsultasi) => {
      if (konsultasi.testimonies && konsultasi.testimonies.length) {
        testimonies = testimonies.concat(
          konsultasi.testimonies.map((testimony) => testimony.review)
        );
      }
    });

    return testimonies;
  };

  const tableHead = [
    {
      name: "Nama Psikolog",
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex flex-col items-center">
          <img
            src={row.foto}
            alt={row.username}
            className="justify-center object-cover mb-1 h-30 w-30"
          />
            <div className="text-sm font-normal text-center">{row.username}</div>
        </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Spesialisasi",
      selector: "spesialisasi",
      sortable: true,
    },
    {
      name: "Rating",
      selector: "rating",
      sortable: true,
      cell: (row) => calculateAverageRating(row.id).toFixed(1) + " / 5.0" || "0.0",
    },
    {
      name: "Ulasan",
      selector: "ulasan",
      sortable: true,
      cell: (row) => getTestimonies(row.id).join(", ") || "-",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => handleKonsulClick(row)}
        >
          Ajukan Konsul
        </button>
      ),
    },
  ];

  const filteredData = psikologData.filter((row) =>
    row.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKonsulClick = (psikolog) => {
    // Dapatkan jadwal yang tersedia untuk psikolog yang dipilih
    const jadwalTersedia = schedules
      .filter((schedule) => schedule.psikologId === psikolog.id && schedule.kuota > 0)
      .map((schedule) => ({
        id: schedule.id,
        text: `${schedule.hari}, ${schedule.tanggal} - ${schedule.jam} ${schedule.zona_waktu} (${schedule.kuota} kuota tersedia)`
      }));

    // Menampilkan SweetAlert dengan jadwal tersedia
    Swal.fire({
      title: `Jadwal Konsultasi dengan ${psikolog.username}`,
      html: `
        <div>
          <p class="mb-2">Silakan pilih jadwal yang tersedia:</p>
          <select id="jadwal-select" class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            ${jadwalTersedia.map(jadwal => `<option value="${jadwal.id}">${jadwal.text}</option>`).join('')}
          </select>
          <textarea id="keluhan" placeholder="Masukkan keluhan Anda" class="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2" rows="10" cols="50"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajukan',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded',
        content: 'py-5 px-6',
      },
      buttonsStyling: false,
      preConfirm: () => {
        const jadwalId = parseInt(document.getElementById('jadwal-select').value, 10);
        const keluhan = document.getElementById('keluhan').value;

        const jadwalTerpilih = jadwalTersedia.find(jadwal => jadwal.id === jadwalId);
        console.log(`Jadwal terpilih:`, jadwalTerpilih);

        // Ajukan konsultasi
        ajukanKonsultasi(psikolog.id, jadwalId, keluhan);
      }
    });
  };

  const ajukanKonsultasi = (psikologId, jadwalId, keluhan) => {
    // Perbarui kuota jadwal konsultasi
    const jadwal = schedules.find(schedule => schedule.id === jadwalId);
    if (!jadwal || jadwal.kuota <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Jadwal tidak tersedia',
        text: 'Maaf, jadwal konsultasi yang Anda pilih sudah tidak tersedia.',
      });
      return;
    }
  
    // Kurangi kuota jadwal
    const updatedJadwal = {
      ...jadwal,
      kuota: jadwal.kuota - 1,
    };
  
    axios.put(`http://localhost:3000/schedules/${jadwalId}`, updatedJadwal)
      .then(() => {
        // Buat objek konsultasi baru
        const newConsultation = {
          tanggal: jadwal.tanggal,
          jam: jadwal.jam,
          keluhan: keluhan,
          psikologId: psikologId,
          pasienId: loggedInUser.id,
          status: "Menunggu",
          linkGoogleMeet: "",
        };
  
        // Simpan konsultasi ke database
        axios.post("http://localhost:3000/konsultasis", newConsultation)
          .then((response) => {
            console.log("Consultation Submitted:", response.data);
  
            Swal.fire({
              title: "Konsultasi Diajukan!",
              icon: "success",
            });
  
            // Perbarui data konsultasi
            setKonsultasiData([...konsultasiData, response.data]);
  
            // Perbarui state jadwal
            const updatedSchedules = schedules.map(schedule =>
              schedule.id === jadwalId ? updatedJadwal : schedule
            );
            setSchedules(updatedSchedules);
          })
          .catch((error) => {
            console.error("Error submitting consultation:", error);
            Swal.fire({
              icon: 'error',
              title: 'Gagal Mengajukan Konsultasi',
              text: 'Terjadi kesalahan saat mengajukan konsultasi. Silakan coba lagi nanti.',
            });
          });
      })
      .catch((error) => {
        console.error("Error updating schedule:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengajukan Konsultasi',
          text: 'Terjadi kesalahan saat mengajukan konsultasi. Silakan coba lagi nanti.',
        });
      });
  };
  

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <input
        className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2 mb-3"
        type="text"
        placeholder="Cari Nama Psikolog"
        onChange={handleFilter}
      />

      <DataTable
        columns={tableHead}
        data={filteredData}
        noHeader
        pagination
        highlightOnHover
      />
    </div>
  );
}

export default DaftarPsikologPasien;
