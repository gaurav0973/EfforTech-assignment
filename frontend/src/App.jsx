import { BrowserRouter, Routes, Route } from "react-router-dom"
import Body from "./Body"
import UserForm from "./pages/UserForm"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter basename="/">
        <Routes>
            <Route path="/" element={<Body/>}>
                <Route path="/" element={<UserForm/>} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App