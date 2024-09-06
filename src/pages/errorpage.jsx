import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    return (
        <div className="flex justify-center items-center min-h-screen bg-black flex-col">
            <h1 className="text-3xl font-bold mb-2 text-red-500">Oops! Sorry there was an error</h1>
            <p className="text-white text-md mt-3">{error.statusText || error.message}</p>
        </div>
    );
}

export default ErrorPage;