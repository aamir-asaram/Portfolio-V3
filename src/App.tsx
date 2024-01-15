import Home from './Home'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Certificates from './Certificates'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/certificates" element={<Certificates/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
