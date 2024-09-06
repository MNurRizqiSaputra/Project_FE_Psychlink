import React from "react";


function SidebarAdmin({ onMenuClick }) {
  const menuItems = [
    { label: "Beranda", icon: "fas fa-home" },
    { label: "Manajemen Psikolog", icon: "fas fa-user-md" },
    { label: "Manajemen Pasien", icon: "fas fa-users" },
    { label: "Pantau Status", icon: "fas fa-chart-line" },
    { label: "Set Meet", icon: "fas fa-video" },
    { label: "Kelola Artikel", icon: "fas fa-file-alt" },
    { label: "Kelola Grup/Komunitas", icon: "fas fa-comments" },
    { label: "Profil", icon: "fas fa-user" }
  ];

  return (
    <nav aria-label="alternative nav">
      <div className="fixed bottom-0 z-10 content-center w-full h-20 mt-12 bg-gray-800 shadow-xl md:relative md:h-screen md:w-48">
        <div className="content-center justify-between text-left md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 md:content-start">
          <ul className="flex flex-row px-1 pt-3 text-center list-reset md:flex-col md:py-3 md:px-2 md:text-left">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="flex-1 mr-3"
                onClick={() => onMenuClick(item.label)}
              >
                <a className="block py-1 pl-1 text-white no-underline align-middle border-b-2 border-gray-800 md:py-3 hover:text-white hover:border-pink-500">
                  {/* Hanya tampilkan ikon di bawah lebar tertentu */}
                  <span className="hidden md:inline">
                    <i className={`${item.icon} mr-2`} /> {item.label}
                  </span>
                  <span className="md:hidden">
                    <i className={`${item.icon} mr-2`} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default SidebarAdmin;