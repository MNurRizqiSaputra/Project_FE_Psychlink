import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../../../assets/images/logo3.png";

function Header() {
  const navigate = useNavigate();

  // State untuk menyimpan informasi pengguna yang login
  const [user, setUser] = useState(getUserFromLocalStorage());

  // Fungsi untuk mendapatkan informasi pengguna dari local storage
  function getUserFromLocalStorage() {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Fungsi untuk melakukan logout
  function handleLogout() {
    // Tampilkan notifikasi konfirmasi SweetAlert
    Swal.fire({
      title: "Logout",
      text: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus informasi pengguna dari local storage
        localStorage.removeItem("user");
        // Hapus informasi konsultasis dari local storage (ganti "konsultasis" dengan nama key yang sesuai)
        localStorage.removeItem("konsultasis");
        // Hapus informasi pengguna dari state
        setUser(null);
        // Redirect ke halaman login
        navigate("/");
      }
    });
  }

  return (
    <header>
      {/* <!--Nav--> */}
      <nav
        aria-label="menu nav"
        className="fixed top-0 z-20 w-full h-auto px-1 pt-2 pb-1 mt-0 bg-gray-800 md:pt-1"
      >
        <div className="flex flex-wrap items-center">
          <div className="flex justify-center flex-shrink text-white md:w-1/3 md:justify-start">
            <img className="h-8 mr-2 rounded-full" src={Logo} alt="Profile" />
          </div>

          <div className="flex justify-center md:w-1/3"></div>

          <div className="flex content-center justify-between w-full pt-2 md:w-1/3 md:justify-end">
            <ul className="flex items-center justify-between flex-1 list-reset md:flex-none">
              <li className="flex-1 md:flex-none md:mr-3">
                <div className="relative inline-block">
                  {/* Tampilkan nama pengguna jika ada */}
                  {user && (
                    <button className="px-2 py-2 text-white drop-button">
                      <span className="pr-2">
                        <i className="em em-robot_face"></i>
                      </span>{" "}
                      Hi, {user.username}
                    </button>
                  )}
                </div>
              </li>

              <button className="mr-2 text-center bg-red-500 hover:bg-red-700 rounded-full p-1">
              <li className="flex-1 md:flex-none md:mr-3">
                {/* Tampilkan tombol Logout jika pengguna login */}
                {user && (
                  <div
                    className="inline-block px-4 py-2 mr-2 text-center text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    <i className="mr-3 fas fa-sign-out-alt"></i>
                    Logout
                  </div>
                )}

                {/* Tampilkan tombol Login jika pengguna tidak login */}
                {!user && (
                  <Link to="/">
                    <div className="inline-block px-4 py-2 mr-2 text-center text-white cursor-pointer">
                      <i className="mr-3 fas fa-sign-out-alt"></i>
                      Logout
                    </div>
                  </Link>
                )}
              </li>
              </button>
            </ul>
          </div>
        </div>
      </nav>
      {/* <!--End Nav--> */}
    </header>
  );
}

export default Header;
