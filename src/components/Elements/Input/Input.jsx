import React from "react";
import { BiHide, BiShow } from 'react-icons/bi';

function Input(props) {
  const { type, placeholder, name, value, onChange } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : type}
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
      {type === "password" && (
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <BiHide /> : <BiShow />}
        </div>
      )}
    </div>
  );
}

export default Input;
