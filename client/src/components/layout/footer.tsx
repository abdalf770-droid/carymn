import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-luxury-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-reverse space-x-4 mb-6">
              <div className="bg-gradient-to-r from-gold-600 to-gold-500 p-3 rounded-xl border-2 border-gold-400 shadow-lg">
                <div className="text-white font-bold text-center">
                  <div className="text-md leading-none">أبو</div>
                  <div className="text-xs leading-none">حيدر</div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold font-amiri">حراج أبو حيدر</h3>
                <p className="text-gold-300 text-sm">إب محافظة إب - سيارات مضمونة</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              وجهتك الأولى للسيارات الفاخرة في اليمن. نقدم أفضل الخدمات وأعلى معايير الجودة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-300">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" data-testid="link-footer-home">
                  <a className="text-gray-400 hover:text-white transition-colors">الرئيسية</a>
                </Link>
              </li>
              <li>
                <Link href="/cars" data-testid="link-footer-cars">
                  <a className="text-gray-400 hover:text-white transition-colors">السيارات</a>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact">
                  <a className="text-gray-400 hover:text-white transition-colors">تواصل معنا</a>
                </Link>
              </li>
              <li>
                <Link href="/admin" data-testid="link-footer-admin">
                  <a className="text-gray-400 hover:text-white transition-colors">الإدارة</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-300">خدماتنا</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">بيع السيارات</span></li>
              <li><span className="text-gray-400">شراء السيارات</span></li>
              <li><span className="text-gray-400">تقييم السيارات</span></li>
              <li><span className="text-gray-400">خدمات ما بعد البيع</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-300">تواصل معنا</h4>
            <div className="space-y-3">
              <p className="text-gray-400 flex items-center">
                <Phone className="text-gold-400 w-4 h-4 ml-2" />
                +967 1 234 567
              </p>
              <p className="text-gray-400 flex items-center">
                <Mail className="text-gold-400 w-4 h-4 ml-2" />
                info@abuhaidar-cars.com
              </p>
              <p className="text-gray-400 flex items-center">
                <MapPin className="text-gold-400 w-4 h-4 ml-2" />
                إب محافظة إب، اليمن
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-reverse space-x-4 mt-6">
              <a 
                href="#" 
                className="bg-gold-600 hover:bg-gold-700 p-3 rounded-full transition-colors"
                data-testid="link-social-facebook"
              >
                <Facebook className="text-white w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="bg-gold-600 hover:bg-gold-700 p-3 rounded-full transition-colors"
                data-testid="link-social-twitter"
              >
                <Twitter className="text-white w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="bg-gold-600 hover:bg-gold-700 p-3 rounded-full transition-colors"
                data-testid="link-social-instagram"
              >
                <Instagram className="text-white w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 حراج ابو حيدر للسيارات. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
