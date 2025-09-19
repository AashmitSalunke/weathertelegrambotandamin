import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddCity from './components/AddCity';
import Notifications from './components/Notifications';
import HistoricalData from "./components/Historical";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-city" element={<AddCity />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/historical" element={<HistoricalData />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;