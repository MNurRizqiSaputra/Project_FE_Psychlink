import AuthLayouts from "../../components/Layouts/AuthLayouts";
import FormRegister from "../../components/Fragments/Authentikasi/FormRegister";
import logo from "../../assets/images/logo3.png";

function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-300">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8 mb-3" src={logo} alt="" />
          </div>
          <AuthLayouts title="Register" type="register">
            <FormRegister />
          </AuthLayouts>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
