import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import InputForm from "../../Elements/Input";
import Button from "../../Elements/Button";
import { useNavigate } from "react-router-dom"; // Ganti menjadi useNavigate

function FormRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [nextId, setNextId] = useState(null);
  const navigate = useNavigate(); // Ganti menjadi useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        const users = response.data;

        const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

        setNextId(newId);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Kolom Kosong',
        text: 'Harap isi semua kolom.',
      });
      return;
    }

    try {
      const newUserData = { ...formData, role: "pasien", id: nextId };

      const usersFromLocalStorage = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = [...usersFromLocalStorage, newUserData];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      await axios.post("http://localhost:3000/users", newUserData);

      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil',
        text: 'Anda telah berhasil terdaftar!',
      });

      // Navigasi ke halaman login menggunakan navigate
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);

      await Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputForm
        label="Username"
        name="username"
        type="text"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
      />

      <InputForm
        label="Email"
        name="email"
        type="email"
        placeholder="email"
        value={formData.email}
        onChange={handleChange}
      />

      <InputForm
        label="Password"
        name="password"
        type="password"
        placeholder="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button
        type="submit"
        className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Register
      </Button>
    </form>
  );
}

export default FormRegister;
