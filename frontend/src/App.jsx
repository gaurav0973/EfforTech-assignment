import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body";
import UserForm from "./pages/UserForm";
import UserList from "./pages/UserList";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<UserForm />} />
            <Route path="users" element={<UserList />} />
            <Route path="edit-user" element={<UserForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
