import Home from './Home'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Certificates from './Certificates'
import Donut from './Donut'
import WorkflowMaxCallback from './WorkflowMaxCallback'
import WorkflowMaxConnect from './WorkflowMaxConnect'
import Jobs from './Jobs'
import Trello from './Trello'
import TrelloBoards from './TrelloBoards'


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
        <Route path="/trello" element={<Trello />} />
        <Route path="/trello/boards" element={<TrelloBoards />} />
      </Routes>
    </Router>
  )
}

export default App