import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Car as CarType } from "@shared/schema";
import CarCard from "@/components/cars/car-card";
import CarSearch from "@/components/cars/car-search";
import CarFilters from "@/components/cars/car-filters";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Cars = () => {
  const [filters, setFilters] = useState<any>({});
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: cars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
      });
      
      const response = await fetch(`/api/cars?${params.toString()}`);
      if (!response.ok) throw new Error("فشل في جلب السيارات");
      return response.json();
    },
  });

  const handleSearch = (searchFilters: any) => {
    setFilters(searchFilters);
    setActiveFilter("all");
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilters({});
    } else if (filter === "featured") {
      setFilters({ featured: true });
    } else {
      setFilters({ bodyType: filter });
    }
  };

  const filteredCars = cars?.filter(car => {
    if (activeFilter === "featured") return car.isFeatured;
    return true;
  }) || [];

  return (
    <div className="bg-luxury-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">جميع السيارات</h1>
          <p className="text-xl text-gray-600">اكتشف مجموعتنا الكاملة من السيارات الفاخرة</p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <CarSearch onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <CarFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600" data-testid="text-results-count">
                عدد النتائج: {filteredCars.length} سيارة
              </p>
            </div>
            
            {filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600" data-testid="text-no-results">
                  لا توجد سيارات تطابق معايير البحث
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;
