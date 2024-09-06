// Content.js
import React from "react";
import ManajemenPsikolog from "./ManajemenPsikolog";
import ManajemenPengguna from "./ManajemenPengguna";
import PantauStatus from "./PantauStatus";
import SetMeet from "./SetGmeet";
import ArtikelAdmin from "./ArtikelAdmin";
import GrupAdmin from "./GrupAdmin";
import BerandaAdmin from "./Beranda";
import ProfilAdmin from "./Profil";
import adminicon from '../../../../../assets/images/admin.jpg';

const Content = ({ selectedMenu }) => {
  let renderedContent = null;

  switch (selectedMenu) {
    case "Beranda":
      renderedContent = <BerandaAdmin />;
      break;
    case "Manajemen Psikolog":
      renderedContent = <ManajemenPsikolog />;
      break;
    case "Manajemen Pasien":
      renderedContent = <ManajemenPengguna />;
      break;
    case "Pantau Status":
      renderedContent = <PantauStatus />;
      break;
    case "Set Meet":
      renderedContent = <SetMeet />;
      break;
    case "Kelola Artikel":
      renderedContent = <ArtikelAdmin />;
      break;
    case "Kelola Grup/Komunitas":
      renderedContent = <GrupAdmin />;
      break;
    case "Profil":
      renderedContent = <ProfilAdmin />;
      break;

    default:
      renderedContent = (
        <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 h-screen">
          <div class="flex flex-col max-w-screen-lg overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
            <div class="relative lg:w-1/2">
              <img src={adminicon}
                alt=""
                class="object-cover w-full lg:absolute h-80 lg:h-full"
              />
              <svg class="absolute top-0 right-0 hidden h-full text-white lg:inline-block" viewBox="0 0 20 104" fill="currentColor">
                <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104"></polygon>
              </svg>
            </div>
            <div class="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
              <div>
                <p class="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                  Psychlink
                </p>
              </div>
              <h5 class="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
                Selamat Datang Admin
              </h5>
              <p class="mb-5 text-gray-800">
                Anda dapat mengelola data psikolog dan pasien di sini
              </p>
            </div>
          </div>
        </div>
      );
      break;
  }

  return <div className="content">{renderedContent}</div>;
};

export default Content;
