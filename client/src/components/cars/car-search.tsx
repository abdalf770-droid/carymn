import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CarSearchProps {
  onSearch: (filters: {
    make?: string;
    bodyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

const CarSearch = ({ onSearch }: CarSearchProps) => {
  const [filters, setFilters] = useState({
    make: "",
    bodyType: "",
    priceRange: "",
  });

  const makes = [
    "مرسيدس", "BMW", "لكزس", "تويوتا", "أودي", "بورش", "نيسان", "هوندا", "هيونداي", "كيا"
  ];

  const bodyTypes = [
    "سيدان", "SUV", "هاتش باك", "كوبيه", "واجن", "بيك أب"
  ];

  const priceRanges = [
    { label: "أقل من 50,000 ريال", min: 0, max: 50000 },
    { label: "50,000 - 100,000 ريال", min: 50000, max: 100000 },
    { label: "100,000 - 200,000 ريال", min: 100000, max: 200000 },
    { label: "أكثر من 200,000 ريال", min: 200000, max: undefined },
  ];

  const handleSearch = () => {
    const searchFilters: any = {};
    
    if (filters.make && filters.make !== 'all-makes') searchFilters.make = filters.make;
    if (filters.bodyType && filters.bodyType !== 'all-types') searchFilters.bodyType = filters.bodyType;
    
    if (filters.priceRange) {
      const range = priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        searchFilters.minPrice = range.min;
        if (range.max) searchFilters.maxPrice = range.max;
      }
    }
    
    onSearch(searchFilters);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-luxury">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select 
          value={filters.bodyType} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, bodyType: value }))}
        >
          <SelectTrigger data-testid="select-body-type">
            <SelectValue placeholder="نوع السيارة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">جميع الأنواع</SelectItem>
            {bodyTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.make} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, make: value }))}
        >
          <SelectTrigger data-testid="select-make">
            <SelectValue placeholder="الماركة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-makes">جميع الماركات</SelectItem>
            {makes.map((make) => (
              <SelectItem key={make} value={make}>{make}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.priceRange} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
        >
          <SelectTrigger data-testid="select-price-range">
            <SelectValue placeholder="السعر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-prices">جميع الأسعار</SelectItem>
            {priceRanges.map((range) => (
              <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleSearch}
          className="bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 transition-all shadow-gold"
          data-testid="button-search"
        >
          <Search className="w-4 h-4 ml-2" />
          البحث
        </Button>
      </div>
    </div>
  );
};

export default CarSearch;
