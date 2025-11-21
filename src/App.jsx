
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Feed from './Feed';


function FeedPlaceholder() {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <div className="container">
      <h1>Ini Halaman Feed</h1>
      <p>Selamat datang!</p>
      <button onClick={logout} className="secondary">Logout</button>
    </div>
  );
}


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Feed />  {}
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;