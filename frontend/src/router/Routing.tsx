import type { MemoryRouterProps, RouteObject } from 'react-router-dom';
import { Navigate, Route, createBrowserRouter, createMemoryRouter, createRoutesFromElements } from 'react-router-dom';
import ContextualLayout from '../components/Layout/ContextualLayout/ContextualLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Document from '../pages/Document/Document';
import Login from '../pages/Login/Login';
import NotFound from '../pages/NotFound/NotFound';
import InverseProtectedRoute from './InverseProtectedRoute';
import ProtectedRoute from './ProtectedRoute';

// const About = React.lazy(() => import("./pages/About"));
// const Dashboard = React.lazy(() => import("./pages/Dashboard"));

const routesConfig = createRoutesFromElements(
  <Route element={<ContextualLayout />}>
    {/* Routes that can be accessed only when logged out */}
    <Route path="/login" element={<InverseProtectedRoute outlet={<Login />} />} />

    {/* Routes that can be accessed only when logged in */}
    <Route path="/dashboard" element={<ProtectedRoute outlet={<Dashboard />} />} />
    <Route path="/" element={<ProtectedRoute outlet={<Navigate to="/dashboard" />} />} />

    <Route path="/income/all" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/report" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/deficiencies" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/to_send" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/to_cancel" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/sent" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/cancelled" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/from_aade" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/deviations_from_aade" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/omissions_from_aade" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/income/ignored" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/all" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/report" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/deficiencies" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/to_send" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/to_cancel" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/sent" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/cancelled" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/from_aade" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/deviations_from_aade" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/omissions_from_aade" element={<ProtectedRoute outlet={<Document />} />} />
    <Route path="/expenses/ignored" element={<ProtectedRoute outlet={<Document />} />} />

    {/* Route 404 not found */}
    <Route path="*" element={<ProtectedRoute outlet={<NotFound />} />} />
  </Route>
);

export function setupBrowserRouter(routesConfiguration: RouteObject[]) {
  return createBrowserRouter(routesConfiguration);
}

export function setupMemoryRouter(
  routesConfiguration: RouteObject[],
  initialEntries?: MemoryRouterProps['initialEntries']
) {
  return createMemoryRouter(routesConfiguration, {
    initialEntries,
  });
}

export default routesConfig;
