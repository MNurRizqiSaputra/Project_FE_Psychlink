import { useEffect, useState } from "react";
import { BiEdit, BiUser, BiEnvelope, BiLock } from "react-icons/bi";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ProfilPasien() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [dataUser, setDataUser] = useState({});
  const navigate = useNavigate();

  const getUserLoggedIn = async () => {
    const res = localStorage.getItem("user");
    const user = JSON.parse(res);
    setLoggedInUser(user);
    setUserLoggedIn(true);
  };

  const getUserData = async () => {
    const res = await axios.get("http://localhost:3000/users");
    const filter = res.data.filter(
      (user) =>
        user.role === "pasien" && user.username === loggedInUser.username
    );

    const data = filter.map((user) => ({
      ...user,
    }));

    setDataUser(data[0]);
  };

  useEffect(() => {
    getUserLoggedIn();
  }, []);

  useEffect(() => {
    if (userLoggedIn) {
      getUserData();
    }
  }, [userLoggedIn]);

  const data = {
    image: `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${dataUser.username || ""}`,
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEdit = async () => {
    try {
      // Show Swal modal for editing profile
      const { value: formValues, dismiss } = await Swal.fire({
        title: "Edit Profil",
        html: `<input id="swal-input1" class="swal2-input" placeholder="Nama" value="${dataUser.username || ""}">
        <input id="swal-input2" class="swal2-input" placeholder="Email" value="${dataUser.email || ""}">
        <input id="swal-input3" class="swal2-input" placeholder="Password" type="text" value="${dataUser.password || ""}">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const name = document.getElementById("swal-input1").value;
          const email = document.getElementById("swal-input2").value;
          const password = document.getElementById("swal-input3").value;

          if (!name.trim() || !email.trim() || password === undefined || password.trim() === "") {
            Swal.showValidationMessage("Pastikan semua data terisi");
            return false;
          }

          if (!isValidEmail(email)) {
            Swal.showValidationMessage("Masukkan email yang valid");
            return false;
          }

          return [name, email, password];
        },
      });

      // Process formValues if not canceled
      if (formValues) {
        // Show SweetAlert2 konfirmasi menggunakan tombol "Ya, saya yakin" dan "Batal"
        const confirmResult = await Swal.fire({
          title: "Konfirmasi Edit Profil",
          text: "Pastikan Anda sudah yakin untuk mengedit data Anda, karena sistem akan terlogout otomatis.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, saya yakin",
          cancelButtonText: "Batal",
          reverseButtons: true,
        });

        // Jika pengguna menekan tombol "Ya, saya yakin"
        if (confirmResult.isConfirmed) {
          const [name, email, password] = formValues;
          const data = {
            username: name,
            email: email,
            password: password,
          };

          await axios.patch(
            `http://localhost:3000/users/${dataUser.id}`,
            data
          );
          localStorage.setItem("user", JSON.stringify(data));

          // Logout user
          setUserLoggedIn(false);

          // Redirect to "/login" using useNavigate
          navigate("/login");
        } else if (dismiss === Swal.DismissReason.cancel) {
          // Handle cancel action here
          console.log("Editing canceled");
        }
      }
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-3">
      <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex items-center px-6 py-3 bg-gray-900 justify-center">
          <BiUser size={20} className="text-white mr-2" />
          <h1 className="text-lg font-semibold text-white">
            {dataUser.role || ""}
          </h1>
        </div>

        <img
          className="object-cover object-center w-full h-56"
          src={data.image}
          alt={`Foto profil ${dataUser.username || ""}`}
        />

        <div className="px-6 py-4 text-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white bg-slate-200">
            {dataUser.username || ""}
          </h1>

          <div className="flex items-center mt-2 justify-center">
            <BiEnvelope size={20} className="text-gray-500 mr-2" />
            <p className="text-gray-700 dark:text-gray-400">
              {dataUser.email || ""}
            </p>
          </div>

          <div className="flex items-center mt-2 justify-center">
            <BiLock size={20} className="text-gray-500 mr-2" />
            <p className="text-gray-700 dark:text-gray-400">
              Password: {dataUser.password || ""}
            </p>
          </div>

          <button
            onClick={handleEdit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 h-full w-full flex items-center justify-center"
          >
            <BiEdit size={20} className="mr-2" />
            Edit Profil
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilPasien;
