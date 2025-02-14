
import { Link } from "react-router-dom";
import { LogIn, UserPlus, MessageCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MessageCircle className="text-primary" />
            <span className="text-primary text-2xl font-bold">Kehelot.ai</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg glass hover-glow text-primary"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link 
              to="/register" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-kihelot-dark hover-glow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
