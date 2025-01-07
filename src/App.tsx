import Home from './Home'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Certificates from './Certificates'
import Donut from './Donut'
// import Grid from './Grid'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/certificates" element={<Certificates/>}></Route>
        <Route path="/donut" element={<Donut/>}></Route>
        {/* <Route path="/grid" element={<Grid/>}></Route> */}
      </Routes>
    </Router>
  )
}

export default App
