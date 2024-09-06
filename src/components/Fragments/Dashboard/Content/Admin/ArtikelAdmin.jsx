import React, { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function ArtikelAdmin() {
  const [artikelContent, setArtikelContent] = useState([]);
  const [newArtikel, setNewArtikel] = useState({
    imgLink: "",
    title: "",
    content: "",
    category: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Kategori yang tersedia
  const kategoriOptions = [
    "Tips & Trik",
    "Inspirasi & Motivasi",
    "Pencegahan",
    "Self-Care",
    "Informasi dan Edukasi",
    "Kesehatan Fisik & Kesehatan Mental",
    "Penelitian & Temuan",
  ];

  // Fetch articles from API
  useEffect(() => {
    axios.get("http://localhost:3000/artikels")
      .then(response => {
        setArtikelContent(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const showSweetAlert = (title, content, imgLink, category) => {
    Swal.fire({
      title: title,
      html: `
        <div>
          <img src="${imgLink}" class="max-w-full h-auto mb-4" alt="${title}">
          <p>${content}</p>
          <p class="font-thin italic text-gray-800 mt-2">Kategori: ${category}</p>
        </div>
      `,
      icon: "info",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtikel({
      ...newArtikel,
      [name]: value,
    });
  };

  const handleAddArtikel = () => {
    if (editMode) {
      axios.put(`http://localhost:3000/artikels/${editId}`, newArtikel)
        .then(response => {
          const updatedArtikels = artikelContent.map((artikel) =>
            artikel.id === editId ? response.data : artikel
          );
          setArtikelContent(updatedArtikels);
          Swal.fire({
            title: "Berhasil!",
            text: "Artikel berhasil diperbarui.",
            icon: "success",
          });
          setNewArtikel({ imgLink: "", title: "", content: "", category: "" });
          setIsFormVisible(false);
          setEditMode(false);
          setEditId(null);
        })
        .catch(error => {
          console.error("There was an error updating the article!", error);
        });
    } else {
      axios.post("http://localhost:3000/artikels", newArtikel)
        .then(response => {
          setArtikelContent([...artikelContent, response.data]);
          Swal.fire({
            title: "Berhasil!",
            text: "Artikel berhasil ditambahkan.",
            icon: "success",
          });
          setNewArtikel({ imgLink: "", title: "", content: "", category: "" });
          setIsFormVisible(false);
        })
        .catch(error => {
          console.error("There was an error adding the article!", error);
        });
    }
  };

  const handleEditArtikel = (id) => {
    const artikelToEdit = artikelContent.find((artikel) => artikel.id === id);
    setNewArtikel({
      imgLink: artikelToEdit.imgLink,
      title: artikelToEdit.title,
      content: artikelToEdit.content,
      category: artikelToEdit.category,
    });
    setEditMode(true);
    setEditId(id);
    setIsFormVisible(true);
  };

  const handleDeleteArtikel = (id) => {
    Swal.fire({
      title: "Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/artikels/${id}`)
          .then(response => {
            const updatedArtikels = artikelContent.filter((artikel) => artikel.id !== id);
            setArtikelContent(updatedArtikels);
            Swal.fire({
              title: "Dihapus!",
              text: "Artikel telah dihapus.",
              icon: "success",
            });
          })
          .catch(error => {
            console.error("There was an error deleting the article!", error);
          });
      }
    });
  };

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <h1 className="text-4xl font-bold text-center">Kelola Artikel</h1>
      <p className="mt-2 text-gray-600 line-clamp-3 text-center">Kelola Artikel yang terkait dengan kesehatan mental</p>

      <div className="flex justify-center">
      <button
        className="mt-4 mb-8 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => {
          setIsFormVisible(true);
          setEditMode(false);
          setEditId(null);
        }}
      >
        Buat Artikel
      </button>
      </div>
      {isFormVisible && (
        <div className="mb-8 p-4 border rounded">
          <h2 className="text-2xl mb-4">{editMode ? "Form Edit Artikel" : "Form Tambah Artikel"}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Link Gambar</label>
            <input
              type="text"
              name="imgLink"
              value={newArtikel.imgLink}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
            <input
              type="text"
              name="title"
              value={newArtikel.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Deskripsi Artikel</label>
            <textarea
              name="content"
              value={newArtikel.content}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              name="category"
              value={newArtikel.category}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border rounded"
            >
              <option value="">Pilih Kategori</option>
              {kategoriOptions.map((kategori, index) => (
                <option key={index} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
          <button
            className="px-4 py-2 text-white bg-green-500 rounded"
            onClick={handleAddArtikel}
          >
            {editMode ? "Update Artikel" : "Simpan Artikel"}
          </button>
          <button
            className="ml-2 px-4 py-2 text-white bg-red-500 rounded"
            onClick={() => setIsFormVisible(false)}
          >
            Batal
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 mt-8">
        {artikelContent.map((artikel) => (
          <Fragment key={artikel.id}>
            <div className="px-5 py-4 border rounded-xl">
              <img
                src={artikel.imgLink}
                alt={artikel.title}
                className="object-cover w-full h-40 rounded-t-xl"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{artikel.title}</h2>
                <p className="mt-2 text-gray-600 line-clamp-3">{artikel.content}</p>
                <p className="mt-2 font-thin italic text-gray-900">Kategori: {artikel.category}</p>
                <button
                  className="mt-2 text-blue-500 hover:underline"
                  onClick={() => showSweetAlert(artikel.title, artikel.content, artikel.imgLink, artikel.category)}
                >
                  Baca selengkapnya
                </button>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="text-yellow-500 hover:text-yellow-600"
                    onClick={() => handleEditArtikel(artikel.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteArtikel(artikel.id)}
                    >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ArtikelAdmin;
