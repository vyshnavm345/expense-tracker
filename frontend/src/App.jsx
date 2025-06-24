import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ExpenseDetail from './pages/ExpenseDetail'
import AdminDashboard from './pages/AdminDashboard'
import Register from './pages/Register'
import ExpenseEdit from './pages/ExpenseEdit'
import ExpenseCreate from './pages/ExpenseCreate'
import Navbar from './components/Navbar'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
      <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
              path="/dashboard"
              element={
                <ProtectedRoute><Dashboard/></ProtectedRoute>
              }
            />
          <Route
              path="/expense/:id"
              element={
                <ProtectedRoute><ExpenseDetail/></ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>
              }
            />
            <Route
              path="/expense/:id/edit"
              element={<ProtectedRoute><ExpenseEdit/></ProtectedRoute>}

            />
            <Route
              path="/expense/new"
              element={<ProtectedRoute><ExpenseCreate/></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
