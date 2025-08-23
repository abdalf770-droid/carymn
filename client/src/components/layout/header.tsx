import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Car, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "الرئيسية", href: "/" },
    { name: "السيارات", href: "/cars" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <header className="bg-luxury-black shadow-luxury sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="bg-gradient-to-r from-gold-600 to-gold-500 p-4 rounded-xl border-2 border-gold-400 shadow-lg">
                <div className="text-white font-bold text-center">
                  <div className="text-lg leading-none">أبو</div>
                  <div className="text-sm leading-none">حيدر</div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-amiri">حراج أبو حيدر</h1>
                <p className="text-gold-300 text-sm">إب محافظة إب - سيارات مضمونة</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-reverse space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                <span className={`font-semibold transition-colors cursor-pointer ${
                  location === item.href 
                    ? "text-gold-400" 
                    : "text-white hover:text-gold-300"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
            
            <Link href="/admin" data-testid="link-admin">
              <Button className="bg-gold-600 hover:bg-gold-700 text-white">
                <Settings className="w-4 h-4 ml-2" />
                الإدارة
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} data-testid={`link-mobile-${item.name.toLowerCase()}`}>
                  <span 
                    className={`font-semibold transition-colors cursor-pointer ${
                      location === item.href 
                        ? "text-gold-400" 
                        : "text-white hover:text-gold-300"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              
              <Link href="/admin" data-testid="link-mobile-admin">
                <Button 
                  className="bg-gold-600 hover:bg-gold-700 text-white w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 ml-2" />
                  الإدارة
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
