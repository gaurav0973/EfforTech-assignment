import { Outlet } from "react-router-dom"

function Body() {
  return (
    <div className="flex flex-col min-h-screen">
        <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">User Management Application</h1>
        </header>
        <main className="flex-grow p-4">
            <Outlet/>
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
            &copy; 2023 User Management Application
        </footer>
    </div>
  )
}
export default Body