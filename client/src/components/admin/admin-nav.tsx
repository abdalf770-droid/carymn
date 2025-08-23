import { Link, useLocation } from "wouter";
import { Car, Plus, MessageSquare, BarChart, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminNav = () => {
  const [location] = useLocation();

  const navigation = [
    { name: "لوحة التحكم", href: "/admin", icon: Home },
    { name: "إدارة السيارات", href: "/admin/cars", icon: Car },
    { name: "إضافة سيارة", href: "/admin/add-car", icon: Plus },
    { name: "الرسائل", href: "/admin/messages", icon: MessageSquare },
    { name: "الإحصائيات", href: "/admin/stats", icon: BarChart },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-luxury rounded-2xl p-6 mb-8">
      <div className="flex flex-wrap gap-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href} data-testid={`link-admin-${item.name.toLowerCase()}`}>
              <Button
                variant={isActive ? "default" : "outline"}
                className={`flex items-center space-x-reverse space-x-2 ${
                  isActive
                    ? "bg-gold-600 text-white hover:bg-gold-700"
                    : "text-gray-700 hover:bg-gold-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminNav;
