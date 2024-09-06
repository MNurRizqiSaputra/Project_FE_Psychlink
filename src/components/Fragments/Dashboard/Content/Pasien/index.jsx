// Content.js
import React from 'react';
import BerandaPasien from './Beranda';
import KonsulCepatPasien from './KonsulCepat';
import DaftarPsikologPasien from './DaftarPsikolog';
import JadwalKonsultasiPasien from './JadwalKonsultasi';
import RiwayatKonsultasiPasien from './RiwayatKonsultasi';
import ArtikelPasien from './Artikel';
import GrupPasien from './GrupPasien';
import ProfilPasien from './Profil';
import BantuanPasien from './Bantuan';
import pasienicon from '../../../../../assets/images/pasien.jpg';

const Content = ({ selectedMenu }) => {
    let renderedContent = null;

    switch (selectedMenu) {
        case 'Beranda':
            renderedContent = <BerandaPasien />;
            break;
        case 'Konsul Cepat':
        renderedContent = <KonsulCepatPasien />;
            break;
        case 'Daftar Psikolog':
            renderedContent = <DaftarPsikologPasien />;
            break;
        case 'Jadwal Konsultasi':
            renderedContent = <JadwalKonsultasiPasien />;
            break;
        case 'Riwayat Konsultasi':
            renderedContent = <RiwayatKonsultasiPasien />;
            break;
        case 'Artikel':
            renderedContent = <ArtikelPasien />;
            break;
        case 'Grup/Komunitas':
            renderedContent = <GrupPasien />;
            break;
        case 'Profil':
            renderedContent = <ProfilPasien />;
            break;
        case 'Bantuan':
            renderedContent = <BantuanPasien />;
            break;

        default:
            renderedContent = (
                <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 h-screen">
                    <div class="flex flex-col max-w-screen-lg overflow-hidden bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
                        <div class="relative lg:w-1/2">
                            <img src={pasienicon}
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
                                Selamat Datang Pasien
                            </h5>
                            <p class="mb-5 text-gray-800">
                                Kami siap melayani konsultasi psikolog anda untuk membantu anda dalam mengatasi masalah psikologis yang anda alami.
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