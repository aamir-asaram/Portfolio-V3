import Home from './Home'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Certificates from './Certificates'
import Donut from './Donut'
import WorkflowMaxCallback from './WorkflowMaxCallback'
import WorkflowMaxConnect from './WorkflowMaxConnect'
import Jobs from './Jobs'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/donut" element={<Donut />} />
        <Route path="/workflowmax-connect" element={<WorkflowMaxConnect />} />
        <Route path="/workflowmax/callback" element={<WorkflowMaxCallback />} />
        <Route path="/workflowmax/jobs" element={<Jobs />} />
      </Routes>
    </Router>
  )
}

export default App