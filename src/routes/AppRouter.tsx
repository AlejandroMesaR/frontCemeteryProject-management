import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Dashboard from '../pages/dashboard/Dashboard';
import BodiesRegister from '../pages/bodiesRegister/BodiesRegister';
import CemeteryMap from '../pages/cemetery/Cemetery';
import StatisticsLayout from '../pages/statistics/StatisticsLayout';
import DocumentsLayout from '../pages/documents/DocumentsLayout';
import SettingsLayout from '../pages/settings/SettingsLayout';
import GeneralSettings from '../pages/settings/GeneralSettings';
import UsersManagment from '../pages/settings/UserManagment';
import DocumentsPage from '../pages/documents/DocumentsPage';
import GeneralsStadistics from '@/pages/statistics/GeneralsStadistics';
import OccupancyAnalysisPage from '@/pages/statistics/OccupancyAnalysisPage';
import DocumentationStatistics from '@/pages/statistics/DocumentationStatistics';
import DigitalizedDocumentsPage from '../pages/documents/DigitalizedDocumentsPage';
import PrivateRoute from './PrivateRoute';
import UnauthorizedPage from '../pages/login/UnauthorizedPage';
import LoginPage from '../pages/login/LoginPage';


function AppRouter() {

  return (
    <>
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Dashboard />}/>

          <Route
            path="/bodies"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
                <BodiesRegister />
              </PrivateRoute>
            }
          />

          <Route
            path="/map"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
                <CemeteryMap />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
                <StatisticsLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<GeneralsStadistics />} />
            <Route path="generalStadistics" element={<GeneralsStadistics />} />
            <Route path="occupancy" element={<OccupancyAnalysisPage />} />
            <Route path="documentationStadistics" element={<DocumentationStatistics />} />
          </Route>
          <Route
            path="/documents"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
                <DocumentsLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DocumentsPage />} />
            <Route path="allDocuments" element={<DocumentsPage />} />
            <Route path="digitized" element={<DigitalizedDocumentsPage />} />
          </Route>
          <Route
            path="/settings"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <SettingsLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<GeneralSettings />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="users" element={<UsersManagment />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default AppRouter;

