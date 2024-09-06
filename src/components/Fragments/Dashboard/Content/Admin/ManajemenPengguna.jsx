import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function ManajemenPengguna() {
  const [userss, setUsers] = useState([]);
  const [records, setRecords] = useState(userss);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data.filter(row => row.role === 'pasien');

      setUsers(users);
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
        fontSize: '13px',
        // backgroundColor: '#f2f4fa'
      },
    },
    headCells: {
      style: {
        fontSize: '16px',
        backgroundColor: '#f5f6ff',
        borderRadius: '10px 10px 0px 0px'
      },
    },
    pagination: {
      style: {
        fontSize: '15px'
      },
    },
  };
  const handleEditClick = (id) => {
    const findData = userss.find((data) => data.id === id);
    Swal.fire({
      title: "Mengedit Pasien",
      html:
        '<p> Nama Pasien </p>' +
        `<input id="namaPasien" class="w-3/4 swal2-input mt-2 mb-3 text-base" value="${findData.username}">` +
        '<p> Email Pasien </p>' +
        `<input id="emailPasien" class="w-3/4 swal2-input mt-2 mb-3 text-base" value="${findData.email}">` +
        '<p> Password Pasien </p>' +
        `<input id="passPasien" class="w-3/4 swal2-input mt-2 text-base" value="${findData.password}">`,
      showCancelButton: true,
      preConfirm: () => {
        if (
          document.getElementById("namaPasien").value == "" ||
          document.getElementById("emailPasien").value == "" ||
          document.getElementById("passPasien").value == ""
        ) {
          Swal.showValidationMessage("Pastikan nama dan email pasien terisi"); // Show error when validation fails.
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = document.getElementById("namaPasien").value;
        const newEmail = document.getElementById("emailPasien").value;
        const newPass = document.getElementById("passPasien").value;
  
        axios
          .put(`http://localhost:3000/users/${id}`, {
            username: newName,
            email: newEmail,
            password: newPass,
            role: "pasien",
          })
          .then(() => {
            fetchUsers();
          });
        Swal.fire("Saved!", "", "success");
      }
    });
  };

  const handleDeleteClick = (id) => {
    const findData = userss.find((data) => data.id === id);
    const foundedName = findData.username
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
        axios.delete(`http://localhost:3000/users/${id}`)
        .then(() => {
          fetchUsers();
        })
        Swal.fire({
          title: "Berhasil!",
          text: "Pasien berhasil dihapus.",
          icon: "success"
        });
      }
    });
  };
  const handleAddClick = () => {
    Swal.fire({
      title: "Menambah Pasien",
      html:
        '<p> Nama Pasien </p>' +
        `<input id="namaPasien" class="w-3/4 swal2-input mt-2 mb-3 text-base" placeHolder="Masukkan nama pasien">` +
        '<p> Email Pasien </p>' +
        `<input id="emailPasien" class="w-3/4 swal2-input mt-2 mb-3 text-base" placeHolder="Masukkan email pasien">` +
        '<p> Password Pasien </p>' +
        `<input id="passPasien" class="w-3/4 swal2-input mt-2 text-base" placeHolder="Masukkan password pasien">`,
      showCancelButton: true,
      preConfirm: () => {
        const newName = document.getElementById("namaPasien").value;
        const newEmail = document.getElementById("emailPasien").value;
        const newPass = document.getElementById("passPasien").value;
  
        if (!newName || !newEmail || !newPass) {
          Swal.showValidationMessage("Pastikan semua data pasien terisi");
          return false; // Prevent the modal from closing if validation fails
        }
  
        if (!isValidEmail(newEmail)) {
          Swal.showValidationMessage("Masukkan email yang valid");
          return false; // Prevent the modal from closing if validation fails
        }
  
        // If validation passes, continue with the API call
        return true;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = document.getElementById("namaPasien").value;
        const newEmail = document.getElementById("emailPasien").value;
        const newPass = document.getElementById("passPasien").value;
  
        axios
          .post(`http://localhost:3000/users`, {
            username: newName,
            email: newEmail,
            password: newPass,
            role: "pasien",
          })
          .then(() => {
            fetchUsers();
          });
        Swal.fire("Saved!", "", "success");
      }
    });
  };
  

  const columns = [
    {
      name: 'Nama Pasien',
      selector: row => row.username,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: "Password",
      selector: (row) => '********',
      sortable: true
    },
    {
      name: 'Action',
      cell: (d) => [
        <button
  key={d.id}
  className="focus:outline-none text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 mr-2 h-8 sm:h-10 w-16 sm:w-20"
  onClick={() => {handleEditClick(d.id)}}
>
  Edit
</button>,
<button
  key={d.id}
  className="focus:outline-none text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 mr-2 h-8 sm:h-10 w-16 sm:w-20"
  onClick={() => {handleDeleteClick(d.id)}}
>
  Hapus
</button>

      ]
    }
  ];

  function handleFilter(e) {
    const newData = userss.filter(row => {
      return row.username.toLowerCase().includes(e.target.value.toLowerCase())
    });
    setRecords(newData);
  }

    return (
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
  
        {/* <div className="max-w-xl mb-5 md:mx-auto sm:text-center lg:max-w-2xl">
          <div className="mb-4">
            <h1>Manajemen Pasien</h1>
          </div>
        </div> */}

        <div className="grid grid-rows-1 mb-2">
          <input className="col-start-1 block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:border-0 focus:ring-indigo-400 sm:text-sm sm:leading-6 mr-2" type="text" placeholder="Cari Nama Pasien" onChange={handleFilter}/>
          <button type="button" className="btn btn-input col-end-10 focus:outline-none text-white bg-indigo-400 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg px-5 py-2.5 mr-2" onClick={() => {handleAddClick()}}>
            <i className="bi bi-plus"></i> + Tambah Pasien
          </button>
        </div>
        <DataTable
          columns={columns}
          data={records}
          fixedHeader
          pagination
          highlightOnHover
          customStyles={customStyles}>
        </DataTable>
    </div>
  );
}

export default ManajemenPengguna;