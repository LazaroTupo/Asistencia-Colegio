import { NavLink } from 'react-router-dom';
import { Camera, LayoutDashboard, LogOut, MessageSquareCode } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const context = useContext(AuthContext);

  return (
    <nav className="bottom-nav">
      <NavLink to="/scanner" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Camera size={24} />
        <span>Escáner</span>
      </NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <LayoutDashboard size={24} />
        <span>Métricas</span>
      </NavLink>
      {context?.user?.role === 'ADMIN' && (
        <NavLink to="/admin/whatsapp" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <MessageSquareCode size={24} />
          <span>WhatsApp</span>
        </NavLink>
      )}
      <button onClick={context?.logout} className="nav-item">
        <LogOut size={24} />
        <span>Salir</span>
      </button>
    </nav>
  );
};
