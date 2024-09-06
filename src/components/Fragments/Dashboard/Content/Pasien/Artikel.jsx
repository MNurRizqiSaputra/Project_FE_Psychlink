import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ArtikelPasien() {
  const [artikelContent, setArtikelContent] = useState([]);

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

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <h1 className="text-4xl font-bold text-center">Artikel Kesehatan Mental</h1>
      <p className="mt-2 text-gray-600 line-clamp-3 text-center">
        Cari artikel kesehatan mental yang sesuai dengan kebutuhanmu
      </p>

      <div className="grid grid-cols-3 gap-5 mt-8">
        {artikelContent.map((artikel) => (
          <div key={artikel.id} className="px-5 py-4 border rounded-xl">
            <img
              src={artikel.imgLink}
              alt={artikel.title}
              className="object-cover w-full h-40 rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{artikel.title}</h2>
              <p className="mt-2 text-gray-600 line-clamp-3">{artikel.content}</p>
              <p className="mt-2 font-thin italic text-gray-900">
                Kategori: {artikel.category}
              </p>
              <button
                className="mt-2 text-blue-500 hover:underline"
                onClick={() =>
                  showSweetAlert(
                    artikel.title,
                    artikel.content,
                    artikel.imgLink,
                    artikel.category
                  )
                }
              >
                Baca selengkapnya
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtikelPasien;
