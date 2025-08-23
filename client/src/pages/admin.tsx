import { useQuery } from "@tanstack/react-query";
import { Car as CarType, Contact } from "@shared/schema";
import AdminNav from "@/components/admin/admin-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  Car, 
  CheckCircle, 
  Users, 
  MessageSquare,
  TrendingUp,
  Star
} from "lucide-react";

const Admin = () => {
  const { data: cars } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const { data: unreadContacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts/unread"],
  });

  const stats = {
    totalCars: cars?.length || 0,
    availableCars: cars?.filter(car => car.isAvailable).length || 0,
    featuredCars: cars?.filter(car => car.isFeatured).length || 0,
    totalContacts: contacts?.length || 0,
    unreadContacts: unreadContacts?.length || 0,
  };

  return (
    <div className="bg-luxury-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">
            لوحة <span className="text-gold-600">التحكم</span>
          </h1>
          <p className="text-xl text-gray-600">إدارة شاملة للسيارات والموقع</p>
        </div>

        <AdminNav />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-luxury hover:shadow-gold transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي السيارات</p>
                  <p className="text-3xl font-bold text-gold-600" data-testid="stat-total-cars">
                    {stats.totalCars}
                  </p>
                </div>
                <div className="bg-gold-100 rounded-full p-3">
                  <Car className="w-6 h-6 text-gold-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury hover:shadow-gold transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">السيارات المتاحة</p>
                  <p className="text-3xl font-bold text-green-600" data-testid="stat-available-cars">
                    {stats.availableCars}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury hover:shadow-gold transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">السيارات المميزة</p>
                  <p className="text-3xl font-bold text-blue-600" data-testid="stat-featured-cars">
                    {stats.featuredCars}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury hover:shadow-gold transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الرسائل الجديدة</p>
                  <p className="text-3xl font-bold text-purple-600" data-testid="stat-unread-messages">
                    {stats.unreadContacts}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-luxury hover:shadow-gold transition-all cursor-pointer bg-gradient-to-br from-gold-50 to-gold-100">
            <CardHeader>
              <CardTitle className="flex items-center text-gold-700">
                <Car className="w-6 h-6 ml-2" />
                إدارة السيارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">عرض وتعديل وحذف السيارات الموجودة</p>
              <div className="text-sm text-gray-500">
                {stats.totalCars} سيارة في النظام
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury hover:shadow-gold transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <TrendingUp className="w-6 h-6 ml-2" />
                إضافة سيارة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">أضف سيارات جديدة مع كامل التفاصيل والصور</p>
              <div className="text-sm text-gray-500">
                نموذج سهل ومتكامل
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury hover:shadow-gold transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <MessageSquare className="w-6 h-6 ml-2" />
                رسائل العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">عرض والرد على استفسارات العملاء</p>
              <div className="text-sm text-gray-500">
                {stats.unreadContacts} رسالة جديدة
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <Card className="shadow-luxury">
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 ml-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">تم إضافة سيارة جديدة</p>
                      <p className="text-sm text-gray-500">منذ ساعتين</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 ml-3">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">استفسار جديد من عميل</p>
                      <p className="text-sm text-gray-500">منذ 4 ساعات</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-gold-100 rounded-full p-2 ml-3">
                      <Star className="w-4 h-4 text-gold-600" />
                    </div>
                    <div>
                      <p className="font-medium">تم تحديث سيارة مميزة</p>
                      <p className="text-sm text-gray-500">منذ يوم واحد</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
