import { Link } from "react-router-dom";

function AuthLayouts(props) {
    const { children, title, type } = props;

    return (
        <div className="w-full max-w-xs">
            {/* importkan logo3.png berada di posisi kanan atas */}

            {/*title */}
            <h1 className="text-3xl font-bold mb-2 text-blue-500 text-center">{title}</h1>
            <p className="text-gray-500 text-center">Welcome back</p>

            {children}

            <p className="text-gray-500 text-center mt-3">
                {type === "login" ? "Don't have an account? "  : "Already have an account? "}

                {type === "login" ? (
                    <Link to="/register" className="text-blue-500">
                        Register
                    </Link>
                ) : (
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                )}
            </p>

        </div>
    );
}

export default AuthLayouts;
