import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Car as CarType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  ArrowRight, 
  Calendar, 
  Fuel, 
  Gauge, 
  MapPin, 
  Phone, 
  Mail,
  Car,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

const CarDetails = () => {
  const [, params] = useRoute("/cars/:id");
  const carId = params?.id;

  const { data: car, isLoading, error } = useQuery<CarType>({
    queryKey: ["/api/cars", carId],
    enabled: !!carId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-light flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-luxury-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">السيارة غير موجودة</h1>
          <Link href="/cars" data-testid="link-back-to-cars">
            <Button variant="outline">العودة إلى السيارات</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-luxury-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/cars" data-testid="link-back-button">
            <Button variant="outline" className="flex items-center">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة إلى السيارات
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="relative mb-4">
              <img 
                src={car.images?.[0] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                alt={car.title}
                className="w-full h-96 object-cover rounded-2xl shadow-luxury"
                data-testid="img-car-main"
              />
              {car.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-gold-100 text-gold-800">
                  مميزة
                </Badge>
              )}
            </div>
            
            {/* Additional Images */}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {car.images.slice(1, 4).map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`${car.title} - صورة ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg"
                    data-testid={`img-car-additional-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-amiri" data-testid="text-car-title">
                {car.title}
              </h1>
              <p className="text-xl text-gray-600" data-testid="text-car-make-model">
                {car.make} {car.model}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gold-600" data-testid="text-car-price">
                {formatPrice(car.price)}
              </span>
            </div>

            {/* Specifications */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 ml-2" />
                  المواصفات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 ml-2 text-gray-500" />
                    <span className="text-sm text-gray-600">السنة:</span>
                    <span className="font-semibold mr-2" data-testid="text-car-year">{car.year}</span>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 ml-2 text-gray-500" />
                    <span className="text-sm text-gray-600">المسافة:</span>
                    <span className="font-semibold mr-2" data-testid="text-car-mileage">{car.mileage.toLocaleString()} كم</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="w-4 h-4 ml-2 text-gray-500" />
                    <span className="text-sm text-gray-600">الوقود:</span>
                    <span className="font-semibold mr-2" data-testid="text-car-fuel">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="w-4 h-4 ml-2 text-gray-500" />
                    <span className="text-sm text-gray-600">النقل:</span>
                    <span className="font-semibold mr-2" data-testid="text-car-transmission">{car.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">المحرك:</span>
                    <span className="font-semibold mr-2" data-testid="text-car-engine">{car.engineSize}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 ml-2 text-gray-500" />
                    <span className="text-sm text-gray-600">الموقع:</span>
                    <span className="font-semibold mr-2" data-testid="text-car-location">{car.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 ml-2" />
                    المميزات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center" data-testid={`text-car-feature-${index}`}>
                        <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {car.description && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>الوصف</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed" data-testid="text-car-description">
                    {car.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contact Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 transition-all shadow-gold"
                data-testid="button-call"
              >
                <Phone className="w-4 h-4 ml-2" />
                الاتصال الآن: +967 1 234 567
              </Button>
              
              <Link href="/contact" data-testid="link-contact">
                <Button 
                  variant="outline" 
                  className="w-full border-gold-600 text-gold-600 hover:bg-gold-50"
                >
                  <Mail className="w-4 h-4 ml-2" />
                  إرسال استفسار
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
