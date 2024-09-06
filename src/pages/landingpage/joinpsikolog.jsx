import logo from "../../assets/images/logo3.png";
import { Link } from "react-router-dom";

function JoinPsikolog() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300 relative">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="w-auto mb-3 h-7 sm:h-8" src={logo} alt="Logo" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Bergabung sebagai Psikolog
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Untuk bergabung sebagai psikolog di website kami, Anda perlu memenuhi persyaratan berikut:
          </p>
          <ul className="mt-4 list-disc list-inside text-gray-600 dark:text-gray-400">
            <li>
              Memiliki gelar sarjana psikologi yang diakui.
            </li>
            <li>
              Memiliki pengalaman minimal 2 tahun dalam praktik psikologi.
            </li>
            <li>
              Menyediakan bukti sertifikasi atau lisensi profesional yang masih berlaku.
            </li>
            <li>
              Menyetujui syarat dan ketentuan yang berlaku di platform kami.
            </li>
            <li>
              Menjalani proses verifikasi oleh tim kami.
            </li>
          </ul>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Jika Anda memenuhi syarat-syarat di atas, silakan hubungi admin kami melalui email untuk informasi lebih lanjut.
          </p>
          <div className="mt-6 flex justify-between">
            <Link to='/'>
              <button
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Kembali
              </button>
            </Link>
            <a href="mailto:admin@website.com">
              <button
                className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
              >
                Hubungi Admin
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinPsikolog;