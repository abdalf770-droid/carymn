import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Fuel, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Car as CarType } from "@shared/schema";

interface CarCardProps {
  car: CarType;
}

export default function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-YE').format(price);
  };

  const getStatusBadge = () => {
    if (car.isFeatured) {
      return <Badge className="bg-gold-100 text-gold-800 hover:bg-gold-200" data-testid={`badge-featured-${car.id}`}>مميزة</Badge>;
    }
    if (car.year >= 2022) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200" data-testid={`badge-new-${car.id}`}>جديد</Badge>;
    }
    if (car.fuelType === "هايبرد") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200" data-testid={`badge-hybrid-${car.id}`}>صديق البيئة</Badge>;
    }
    return null;
  };

  return (
    <Card className="luxury-card group" data-testid={`car-card-${car.id}`}>
      <div className="relative">
        <img 
          src={car.images?.[0] || "/placeholder-car.jpg"} 
          alt={car.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`img-car-${car.id}`}
        />
        {getStatusBadge() && (
          <div className="absolute top-4 right-4">
            {getStatusBadge()}
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-2" data-testid={`text-car-title-${car.id}`}>
              {car.title}
            </h4>
            <p className="text-gray-600" data-testid={`text-car-specs-${car.id}`}>
              {car.engineSize} • {car.transmission}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-gold-600" data-testid={`text-car-price-${car.id}`}>
            {formatPrice(car.price)} ريال
          </span>
          <span className="text-gray-500" data-testid={`text-car-year-${car.id}`}>
            {car.year}
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center" data-testid={`text-car-mileage-${car.id}`}>
            <Car className="ml-1 h-4 w-4" />
            {new Intl.NumberFormat('ar-YE').format(car.mileage)} كم
          </span>
          <span className="flex items-center" data-testid={`text-car-fuel-${car.id}`}>
            <Fuel className="ml-1 h-4 w-4" />
            {car.fuelType}
          </span>
          <span className="flex items-center" data-testid={`text-car-location-${car.id}`}>
            <MapPin className="ml-1 h-4 w-4" />
            {car.location}
          </span>
        </div>
        
        <Link href={`/cars/${car.id}`} data-testid={`link-car-details-${car.id}`}>
          <Button className="w-full gold-gradient gold-gradient-hover text-white font-semibold">
            عرض التفاصيل
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
