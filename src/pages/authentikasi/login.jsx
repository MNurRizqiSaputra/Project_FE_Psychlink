import AuthLayouts from "../../components/Layouts/AuthLayouts";
import FormLogin from "../../components/Fragments/Authentikasi/FormLogin";
import logo from "../../assets/images/logo3.png";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="w-auto mb-3 h-7 sm:h-8" src={logo} alt="" />
          </div>
          <AuthLayouts title="Login" type="login">
            <FormLogin />
          </AuthLayouts>
        </div>
      </div>
      <Link to ='/'>
      <button
        className="absolute px-4 py-2 font-bold text-white bg-blue-500 rounded top-5 left-5 hover:bg-blue-700"
      >
        Back
      </button>
      </Link>
    </div>
  );
}

export default LoginPage;