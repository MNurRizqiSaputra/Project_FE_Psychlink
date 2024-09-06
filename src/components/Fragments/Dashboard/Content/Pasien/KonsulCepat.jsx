import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";

function KonsulCepatPasien() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [psikologData, setPsikologData] = useState([]);
  const [konsultasiData, setKonsultasiData] = useState([]);

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
            (userData) =>
              userData.role === "psikolog" &&
              userData.Availability === "bersedia"
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
          totalRating += parseInt(testimony.rating); // Parse rating as number
          totalTestimonies++;
        });
      }
    });

    return totalTestimonies > 0 ? totalRating / totalTestimonies : 0; // Check if there are testimonies before calculating average
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
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={() => handleContact(row)}
        >
          Hubungi Cepat
        </button>
      ),
    },
  ];

  const filteredData = psikologData.filter((row) =>
    row.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContact = (row) => {
    const whatsappLink = `https://wa.me/62${row.whatsapp}`;

    Swal.fire({
      title: `Hubungi ${row.username}`,
      html: `
        <div class="bg-white p-4 rounded-md shadow-md">
          <p>Silakan hubungi psikolog melalui WhatsApp untuk konsultasi:</p>
          <p>WhatsApp: ${row.whatsapp}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Beralih ke WhatsApp",
      cancelButtonText: "Batal",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        window.open(whatsappLink, "_blank");
      },
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
        title="Psikolog Cepat yang bisa dihubungi"
        columns={tableHead}
        data={filteredData}
        pagination
        noDataComponent={
          <span className="px-3 py-3 mt-5 mb-6 text-center">
            Maaf, belum ada psikolog yang bersedia melayani konsultasi cepat
          </span>
        }
      />
    </div>
  );
}

export default KonsulCepatPasien;
