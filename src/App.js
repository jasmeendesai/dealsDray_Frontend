import './App.css';
import { Routes, Route, BrowserRouter, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Employee from './pages/employee/Employee';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './component/navbar/Navbar';
import Register from './pages/register/Register';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';



const Layout = () => {
  const queryClient = new QueryClient();
 

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Navbar />
        <div>
          <Outlet />  
        </div>
      </div>
    </QueryClientProvider>
  );
};


function App() {
  const {currentUser} = useContext(AuthContext)

  const ProtectedRoute = ({children}) =>{

    if(!currentUser) {
      return <Navigate to="/login"/>
    } else {
      return children
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
            <ProtectedRoute>
              <Layout/>
            </ProtectedRoute> }>
            <Route index element={<Home />} />
          <Route path="employee" element={<Employee />} />
          </Route>
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
