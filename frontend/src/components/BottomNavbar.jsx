import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Package, History, Sparkles, User } from 'lucide-react';

const BottomNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: HomeIcon,
      isActive: currentPath === '/'
    },
    {
      label: 'Products',
      path: '/offers',
      icon: Package,
      isActive: currentPath === '/offers'
    },
    {
      label: 'Custom order',
      path: '/custom-order',
      icon: Sparkles,
      isActive: currentPath === '/custom-order'
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: History,
      isActive: currentPath === '/orders'
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      isActive: currentPath === '/profile'
    }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden"
    >
      <div className="max-w-md mx-auto px-1.5 flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 transition-all duration-200 select-none group relative ${
                active 
                  ? 'text-amber-800 font-semibold' 
                  : 'text-gray-500 hover:text-amber-700 font-normal'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                active ? 'bg-amber-100/70 text-amber-900 scale-105' : 'group-hover:bg-gray-100 text-gray-500'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight text-center truncate max-w-[68px] ${
                active ? 'font-bold text-amber-900' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
