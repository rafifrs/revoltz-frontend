import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary    from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import ProtectedRoute   from './components/routing/ProtectedRoute';

import Landing           from './pages/Landing';
import About             from './pages/About';
import Login             from './pages/Login';
import Partner           from './pages/Partner';
import Product           from './pages/Product';
import Register          from './pages/Register';
import Marketplace       from './pages/Marketplace';
import BatteryDetail     from './pages/BatteryDetail';
import PublicBatteryProfile from './pages/PublicBatteryProfile';
import Dashboard         from './pages/Dashboard';
import PackAnalysis      from './pages/PackAnalysis';
import CellAnalysis      from './pages/CellAnalysis';
import WorkshopDashboard from './pages/WorkshopDashboard';
import InventoryPage     from './pages/InventoryPage';
import NotFound          from './pages/NotFound';
import WorkshopBatteryDetail from './pages/WorkshopBatteryDetail';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Landing />}      />
          <Route path="/about"         element={<About />}        />
          <Route path="/marketplace"   element={<Marketplace />}  />
          <Route path="/battery/:id"   element={<BatteryDetail />}/>
          <Route path="/battery-profile/:id" element={<PublicBatteryProfile />} />
          <Route path="/login"         element={<Login />}        />
          <Route path="/partner"       element={<Partner />}      />
          <Route path="/product"       element={<Product />}      />
          <Route path="/register"      element={<Register />}     />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"          element={<Dashboard />}         />
            <Route path="/pack-analysis"      element={<PackAnalysis />}      />
            <Route path="/cell-analysis"      element={<CellAnalysis />}      />
            <Route path="/workshop-dashboard" element={<WorkshopDashboard />} />
            <Route path="/inventory"          element={<InventoryPage />}     />
            <Route path="/inventory/:id"      element={<WorkshopBatteryDetail />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
