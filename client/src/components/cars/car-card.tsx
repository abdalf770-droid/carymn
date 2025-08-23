import { Car as CarType } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, MapPin, Calendar, Gauge } from "lucide-react";
import { Link } from "wouter";
import { formatDualCurrency } from "@/lib/currency";

interface CarCardProps {
  car: CarType;
}

const CarCard = ({ car }: CarCardProps) => {
  const dualCurrency = formatDualCurrency(car.price);

  return (
    <Card className="bg-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-gold transition-all duration-300 group">
      <div className="relative">
        <img 
          src={car.images?.[0] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
          alt={car.title} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {car.isFeatured && (
          <Badge className="absolute top-4 right-4 bg-gold-100 text-gold-800">
            مميزة
          </Badge>
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
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gold-600" data-testid={`text-car-price-sar-${car.id}`}>
              {dualCurrency.sar}
            </span>
            <span className="text-lg text-green-600 font-semibold" data-testid={`text-car-price-yer-${car.id}`}>
              {dualCurrency.yer}
            </span>
          </div>
          <span className="text-gray-500" data-testid={`text-car-year-${car.id}`}>
            {car.year}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 ml-1" />
            <span data-testid={`text-car-mileage-${car.id}`}>{car.mileage.toLocaleString()} كم</span>
          </div>
          <div className="flex items-center">
            <Fuel className="w-4 h-4 ml-1" />
            <span data-testid={`text-car-fuel-${car.id}`}>{car.fuelType}</span>
          </div>
          <div className="flex items-center col-span-2">
            <MapPin className="w-4 h-4 ml-1" />
            <span data-testid={`text-car-location-${car.id}`}>{car.location}</span>
          </div>
        </div>
        
        <Link href={`/cars/${car.id}`} data-testid={`link-car-details-${car.id}`}>
          <Button className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 transition-all">
            عرض التفاصيل
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CarCard;
