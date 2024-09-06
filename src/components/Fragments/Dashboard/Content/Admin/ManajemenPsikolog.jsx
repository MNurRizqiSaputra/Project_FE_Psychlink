import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function ManajemenPsikolog() {
  const [records, setRecords] = useState([]);
  const [psikologs, setPsikologs] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data.filter((row) => row.role === "psikolog");

      setPsikologs(users);
      setRecords(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const customStyles = {
    rows: {
      style: {
        fontSize: "13px",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        backgroundColor: "#f5f6ff",
        borderRadius: "10px 10px 0px 0px",
      },
    },
    pagination: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const handleEditClick = (id) => {
    const findData = psikologs.find((data) => data.id === id);
    Swal.fire({
      title: "Mengedit Psikolog",
      html:
        '<p> Nama Psikolog </p>' +
        `<input id="namaPsikolog" class="w-3/4 swal2-input mt-2 mb-3 text-base" value="${findData.username}">` +
        '<p> Email Psikolog </p>' +
        `<input id="emailPsikolog" class="w-3/4 swal2-input mt-2 mb-3 text-base" value="${findData.email}">` +
        '<p> Password Psikolog </p>' +
        `<input id="passPsikolog" class="w-3/4 swal2-input mt-2 text-base" value="${findData.password}">` +
        '<p> Spesialisasi Psikolog </p>' +
        `<input id="spesialisasiPsikolog" class="w-3/4 swal2-input mt-2 text-base" value="${findData.spesialisasi}">` +
        '<p> No. WhatsApp Psikolog </p>' +
        `<input id="whatsappPsikolog" class="w-3/4 swal2-input mt-2 text-base" value="${findData.whatsapp}">` +
        '<p> Link Foto Psikolog </p>' +
        `<input id="fotoPsikolog" class="w-3/4 swal2-input mt-2 text-base" value="${findData.foto}">`,
      showCancelButton: true,
      preConfirm: () => {
        const newName = document.getElementById("namaPsikolog").value;
        const newEmail = document.getElementById("emailPsikolog").value;
        const newPass = document.getElementById("passPsikolog").value;
        const newSpesialisasi = document.getElementById("spesialisasiPsikolog").value;
        const newWhatsapp = document.getElementById("whatsappPsikolog").value;
        const newFoto = document.getElementById("fotoPsikolog").value;

        if (!newName || !newEmail || !newPass || !newSpesialisasi || !newWhatsapp || !newFoto) {
          Swal.showValidationMessage("Pastikan semua data Psikolog terisi");
        } else if (!isValidEmail(newEmail)) {
          Swal.showValidationMessage("Masukkan email yang valid");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = document.getElementById("namaPsikolog").value;
        const newEmail = document.getElementById("emailPsikolog").value;
        const newPass = document.getElementById("passPsikolog").value;
        const newSpesialisasi = document.getElementById("spesialisasiPsikolog").value;
        const newWhatsapp = document.getElementById("whatsappPsikolog").value;
        const newFoto = document.getElementById("fotoPsikolog").value;

        axios
          .put(`http://localhost:3000/users/${id}`, {
            username: newName,
            email: newEmail,
            password: newPass,
            role: "psikolog",
            spesialisasi: newSpesialisasi,
            whatsapp: newWhatsapp,
            foto: newFoto,
          })
          .then(() => {
            fetchUsers();
          });
        Swal.fire("Saved!", "", "success");
      }
    });
  };

  const handleDeleteClick = (id) => {
    const findData = psikologs.find((data) => data.id === id);
    const foundedName = findData.username;
    Swal.fire({
      title: `Apakah anda yakin ingin menghapus ${foundedName}?`,
      text: "Anda tidak bisa membatalkan penghapusan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/users/${id}`).then(() => {
          fetchUsers();
        });
        Swal.fire({
          title: "Berhasil!",
          text: "Psikolog berhasil dihapus.",
          icon: "success",
        });
      }
    });
  };

  const handleAddClick = () => {
    Swal.fire({
      title: "Menambah Psikolog",
      html:
        '<p> Nama Psikolog </p>' +
        `<input id="namaPsikolog" class="w-3/4 swal2-input mt-2 mb-3 text-base" placeHolder="Masukkan nama Psikolog">` +
        '<p> Email Psikolog </p>' +
        `<input id="emailPsikolog" class="w-3/4 swal2-input mt-2 mb-3 text-base" placeHolder="Masukkan email Psikolog">` +
        '<p> Password Psikolog </p>' +
        `<input id="passPsikolog" class="w-3/4 swal2-input mt-2 text-base" placeHolder="Masukkan password Psikolog">` +
        '<p> Spesialisasi Psikolog </p>' +
        `<input id="spesialisasiPsikolog" class="w-3/4 swal2-input mt-2 text-base" placeHolder="Masukkan spesialisasi Psikolog">` +
        '<p> No. WhatsApp Psikolog </p>' +
        `<input id="whatsappPsikolog" class="w-3/4 swal2-input mt-2 text-base" placeHolder="Masukkan no. WhatsApp Psikolog">` +
        '<p> Link Foto Psikolog </p>' +
        `<input id="fotoPsikolog" class="w-3/4 swal2-input mt-2 text-base" placeHolder="Masukkan link foto Psikolog">`,
      showCancelButton: true,
      preConfirm: () => {
        const namaPsikolog = document.getElementById("namaPsikolog").value;
        const emailPsikolog = document.getElementById("emailPsikolog").value;
        const passPsikolog = document.getElementById("passPsikolog").value;
        const spesialisasiPsikolog = document.getElementById("spesialisasiPsikolog").value;
        const whatsappPsikolog = document.getElementById("whatsappPsikolog").value;
        const fotoPsikolog = document.getElementById("fotoPsikolog").value;

        if (!namaPsikolog || !emailPsikolog || !passPsikolog || !spesialisasiPsikolog || !whatsappPsikolog || !fotoPsikolog) {
          Swal.showValidationMessage("Pastikan semua data Psikolog terisi");
        } else if (!isValidEmail(emailPsikolog)) {
          Swal.showValidationMessage("Masukkan email yang valid");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = document.getElementById("namaPsikolog").value;
        const newEmail = document.getElementById("emailPsikolog").value;
        const newPass = document.getElementById("passPsikolog").value;
        const newSpesialisasi = document.getElementById("spesialisasiPsikolog").value;
        const newWhatsapp = document.getElementById("whatsappPsikolog").value;
        const newFoto = document.getElementById("fotoPsikolog").value;

        axios
          .post(`http://localhost:3000/users`, {
            username: newName,
            email: newEmail,
            password: newPass,
            role: "psikolog",
            spesialisasi: newSpesialisasi,
            whatsapp: newWhatsapp,
            foto: newFoto,
          })
          .then(() => {
            fetchUsers();
          });
        Swal.fire("Saved!", "", "success");
      }
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const columns = [
    {
      name: "Nama Psikolog",
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <img
              src={row.foto}
              alt={row.username}
              className="h-30 w-30 object-cover mb-1 justify-center"
            />
            <div className="text-xl text-center font-medium">{row.username}</div>
          </div>
        </div>
      ),
      sortable: true,
    },    
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Spesialisasi",
      selector: (row) => row.spesialisasi,
      sortable: true,
    },
    {
      name: "No. WhatsApp",
      selector: (row) => row.whatsapp,
      sortable: true,
    },
    {
      name: "Action",
      cell: (d) => (
        <>
          <button
            key={d.id}
            className="focus:outline-none text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 mr-2 h-8 sm:h-10 w-16 sm:w-20"
            onClick={() => {
              handleEditClick(d.id);
            }}
          >
            Edit
          </button>
          <button
            key={d.id}
            className="focus:outline-none text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 mr-2 h-8 sm:h-10 w-16 sm:w-20"
            onClick={() => {
              handleDeleteClick(d.id);
            }}
          >
            Hapus
          </button>
        </>
      ),
    },
  ];

  function handleFilter(e) {
    const newData = psikologs.filter((row) => {
      return row.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(newData);
  }

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="grid grid-rows-1 mb-2">
        <input
          className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2"
          type="text"
          placeholder="Cari Nama Psikolog"
          onChange={handleFilter}
        />
        <button
          type="button"
          className="btn btn-input col-end-10 focus:outline-none text-white bg-indigo-400 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg px-5 py-2.5 mr-2"
          onClick={() => {
            handleAddClick();
          }}
        >
          <i className="bi bi-plus"></i> + Tambah Psikolog
        </button>
      </div>
      <DataTable
        columns={columns}
        data={records}
        fixedHeader
        pagination
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
  );
}

export default ManajemenPsikolog;
