import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import {BiLogoWhatsapp, BiLogoGmail } from 'react-icons/bi';
import InputForm from "../../Elements/Input";
import Button from "../../Elements/Button";

function FormLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    // Periksa apakah email dan password tidak kosong
    if (!email || !password) {
      // Tampilkan pesan SweetAlert2 untuk kolom yang kosong
      Swal.fire({
        icon: 'error',
        title: 'Kolom Kosong',
        text: 'Silakan masukkan email dan password.',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
      const user = response.data[0];

      if (user) {
        // Simpan data pengguna ke local storage
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect berdasarkan peran pengguna
        switch (user.role) {
          case "pasien":
            // Tampilkan pesan sukses menggunakan SweetAlert2
            await Swal.fire({
              icon: 'success',
              title: 'Login Berhasil',
              text: 'Selamat datang kembali!',
            });
            navigate("/homepasien");
            break;
          case "psikolog":
            await Swal.fire({
              icon: 'success',
              title: 'Login Berhasil',
              text: 'Selamat datang kembali!',
            });
            navigate("/homepsikolog");
            break;
          case "admin":
            await Swal.fire({
              icon: 'success',
              title: 'Login Berhasil',
              text: 'Selamat datang kembali!',
            });
            navigate("/homeadmin");
            break;
          default:
            setError("Peran pengguna tidak valid");
            break;
        }
      } else {
        // Tampilkan pesan error menggunakan SweetAlert2
        await Swal.fire({
          icon: 'error',
          title: 'Kredensial Tidak Valid',
          text: 'Email atau password tidak valid. Silakan coba lagi.',
        });
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      // Tampilkan pesan error menggunakan SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Gagal masuk. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <InputForm label="Email" name="email" type="email" placeholder="email" />
      <InputForm label="Password" name="password" type="password" placeholder="password" />
      <Button
        className={`w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="submit"
        disabled={loading}
      >
        {loading ? 'Masuk...' : 'Masuk'}
      </Button>

      <div className="mt-2 text-center font-thin">
      <p className="mt-2 text-sm text-gray-600">
        Lupa password? Hubungi admin!
        <a href="mailto:admin@gmail.com" className="ml-1" target="_blank" >
          <BiLogoGmail className="inline-block text-blue-500" />
        </a>
        <a href="https://wa.me/1234567890" className="ml-2" target="_blank">
          <BiLogoWhatsapp className="inline-block text-green-500" />
        </a>
      </p>
      </div>
    </form>
  );
}

export default FormLogin;
