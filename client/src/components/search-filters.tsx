import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  bodyType?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  search?: string;
}

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <div className="bg-white p-6 rounded-2xl luxury-shadow mb-8" data-testid="search-filters">
      <div className="flex items-center mb-6">
        <Filter className="ml-2 h-5 w-5 text-gold-600" />
        <h3 className="text-lg font-semibold">البحث والتصفية</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
          <Input
            placeholder="ابحث عن سيارة..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            data-testid="input-search"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نوع السيارة</label>
          <Select value={filters.bodyType || ""} onValueChange={(value) => updateFilter("bodyType", value)}>
            <SelectTrigger data-testid="select-filter-body-type">
              <SelectValue placeholder="اختر النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأنواع</SelectItem>
              <SelectItem value="سيدان">سيدان</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="هاتش باك">هاتش باك</SelectItem>
              <SelectItem value="كوبيه">كوبيه</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الماركة</label>
          <Select value={filters.brand || ""} onValueChange={(value) => updateFilter("brand", value)}>
            <SelectTrigger data-testid="select-filter-brand">
              <SelectValue placeholder="اختر الماركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الماركات</SelectItem>
              <SelectItem value="مرسيدس">مرسيدس</SelectItem>
              <SelectItem value="BMW">BMW</SelectItem>
              <SelectItem value="تويوتا">تويوتا</SelectItem>
              <SelectItem value="لكزس">لكزس</SelectItem>
              <SelectItem value="أودي">أودي</SelectItem>
              <SelectItem value="بورش">بورش</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نوع الوقود</label>
          <Select value={filters.fuelType || ""} onValueChange={(value) => updateFilter("fuelType", value)}>
            <SelectTrigger data-testid="select-filter-fuel-type">
              <SelectValue placeholder="نوع الوقود" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأنواع</SelectItem>
              <SelectItem value="بنزين">بنزين</SelectItem>
              <SelectItem value="ديزل">ديزل</SelectItem>
              <SelectItem value="هايبرد">هايبرد</SelectItem>
              <SelectItem value="كهرباء">كهرباء</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأدنى</label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice || ""}
            onChange={(e) => updateFilter("minPrice", parseInt(e.target.value) || undefined)}
            data-testid="input-min-price"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأعلى</label>
          <Input
            type="number"
            placeholder="999999"
            value={filters.maxPrice || ""}
            onChange={(e) => updateFilter("maxPrice", parseInt(e.target.value) || undefined)}
            data-testid="input-max-price"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">السنة من</label>
          <Input
            type="number"
            placeholder="2000"
            value={filters.minYear || ""}
            onChange={(e) => updateFilter("minYear", parseInt(e.target.value) || undefined)}
            data-testid="input-min-year"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">السنة إلى</label>
          <Input
            type="number"
            placeholder="2024"
            value={filters.maxYear || ""}
            onChange={(e) => updateFilter("maxYear", parseInt(e.target.value) || undefined)}
            data-testid="input-max-year"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          مسح الفلاتر
        </Button>
      </div>
    </div>
  );
}
