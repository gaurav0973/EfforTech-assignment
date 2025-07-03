import { Outlet, Link } from "react-router-dom";

function Body() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management Application</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold border-b-2 border-white"
                      : "hover:text-gray-300"
                  }
                  end
                >
                  Add User
                </Link>
              </li>
              <li>
                <Link
                  to="/users"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold border-b-2 border-white"
                      : "hover:text-gray-300"
                  }
                >
                  View Users
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2025 User Management Application
      </footer>
    </div>
  );
}
export default Body;
