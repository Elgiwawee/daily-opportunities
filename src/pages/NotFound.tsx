
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500 mb-6">404</h1>
          <p className="text-2xl text-gray-700 mb-4">Page Not Found</p>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for:
            <span className="block mt-2 text-red-500 font-mono text-sm">
              {location.pathname}
            </span>
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
            <Link to="/scholarships">
              <Button variant="outline" className="w-full">
                Browse Scholarships
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
