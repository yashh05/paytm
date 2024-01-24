import {BrowserRouter,Routes,Route} from "react-router-dom"
import Signin from "./routes/Signin"
import Signup from "./routes/signup"
import Dashboard from "./routes/Dashboard"

function App() {

  return (
      <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
