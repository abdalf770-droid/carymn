import { useQuery } from "@tanstack/react-query";
import { Car as CarType } from "@shared/schema";
import CarCard from "@/components/cars/car-card";
import CarSearch from "@/components/cars/car-search";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Car, 
  Shield, 
  Handshake, 
  Award,
  Star,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";

const Home = () => {
  const { data: featuredCars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars/featured"],
  });

  const handleSearch = (filters: any) => {
    // Navigate to cars page with filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    window.location.href = `/cars?${params.toString()}`;
  };

  return (
    <div className="bg-luxury-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-luxury-black via-luxury-gray to-luxury-black py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"}}></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-amiri animate-fade-in-up">
            <span className="text-gold-400">حراج أبو حيدر</span> للسيارات المضمونة
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            سيارات مستعملة نظيفة ومجربة وجديدة بأسعار مناسبة للطبقة اليمنية البسيطة. ثقة وأمانة منذ سنوات في إب محافظة إب
          </p>
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block mb-6 animate-pulse">
            <span className="text-lg font-bold">🎉 عروض خاصة: تقسيط مريح بدون فوائد!</span>
          </div>
          
          {/* Search Box */}
          <div className="animate-slide-in-right">
            <CarSearch onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">السيارات المميزة</h2>
            <p className="text-xl text-gray-600">اختر من مجموعتنا الفاخرة من السيارات المتميزة</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars?.slice(0, 6).map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/cars" data-testid="link-view-all-cars">
              <Button className="bg-gradient-to-r from-gold-600 to-gold-500 text-white px-8 py-3 hover:from-gold-700 hover:to-gold-600 transition-all shadow-gold">
                عرض المزيد من السيارات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-luxury-gray to-luxury-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-amiri">لماذا <span className="text-gold-400">حراج ابو حيدر؟</span></h2>
            <p className="text-xl text-gray-300">نحن رواد مجال السيارات الفاخرة في اليمن</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-gold-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">جودة مضمونة</h3>
              <p className="text-gray-400">فحص شامل لكل سيارة قبل العرض</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gold-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Handshake className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">خدمة عملاء متميزة</h3>
              <p className="text-gray-400">فريق متخصص لخدمتك على مدار الساعة</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gold-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Award className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ضمان شامل</h3>
              <p className="text-gray-400">ضمان على جميع السيارات المباعة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4 font-amiri">عروض خاصة للأسر اليمنية</h2>
            <p className="text-xl text-green-700">نوفر لك أفضل الأسعار والخدمات المناسبة لميزانيتك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <TrendingUp className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">تقسيط مريح</h3>
                <p className="text-green-600">إمكانية التقسيط بدون فوائد لمدة تصل إلى 24 شهر</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Shield className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">ضمان شامل</h3>
                <p className="text-green-600">ضمان لمدة 6 أشهر على جميع قطع الغيار المهمة</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">فحص مجاني</h3>
                <p className="text-green-600">فحص شامل مجاني للسيارة قبل الشراء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">أرقام تتحدث عن جودتنا</h2>
            <p className="text-xl text-gray-600">ثقة عملائنا هي أهم إنجازاتنا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gold-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Car className="text-gold-600 w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gold-600 mb-2" data-testid="stat-total-cars">127</h3>
              <p className="text-gray-600">إجمالي السيارات</p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <CheckCircle className="text-gold-600 w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gold-600 mb-2" data-testid="stat-sold-cars">89</h3>
              <p className="text-gray-600">السيارات المباعة</p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="text-gold-600 w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gold-600 mb-2" data-testid="stat-customers">342</h3>
              <p className="text-gray-600">العملاء السعداء</p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Star className="text-gold-600 w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gold-600 mb-2" data-testid="stat-rating">4.9</h3>
              <p className="text-gray-600">تقييم العملاء</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
