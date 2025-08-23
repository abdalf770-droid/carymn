import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [searchFilters, setSearchFilters] = useState({
    bodyType: "",
    brand: "",
    priceRange: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setLocation(`/cars?${params.toString()}`);
  };

  return (
    <section 
      className="relative bg-gradient-to-r from-luxury-black via-luxury-gray to-luxury-black py-20 overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-amiri" data-testid="text-hero-title">
          أفخم <span className="text-gold-500">موقع للسيارات</span> في اليمن
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
          اكتشف مجموعتنا الحصرية من السيارات الفاخرة والمميزة. نوفر أفضل الخدمات وأعلى معايير الجودة في عالم السيارات
        </p>
        
        {/* Search Box */}
        <div className="bg-white rounded-2xl p-6 luxury-shadow max-w-4xl mx-auto" data-testid="search-box">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={searchFilters.bodyType} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, bodyType: value }))}>
              <SelectTrigger data-testid="select-body-type">
                <SelectValue placeholder="نوع السيارة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="سيدان">سيدان</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="هاتش باك">هاتش باك</SelectItem>
                <SelectItem value="كوبيه">كوبيه</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={searchFilters.brand} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, brand: value }))}>
              <SelectTrigger data-testid="select-brand">
                <SelectValue placeholder="الماركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مرسيدس">مرسيدس</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="تويوتا">تويوتا</SelectItem>
                <SelectItem value="لكزس">لكزس</SelectItem>
                <SelectItem value="أودي">أودي</SelectItem>
                <SelectItem value="بورش">بورش</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={searchFilters.priceRange} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger data-testid="select-price">
                <SelectValue placeholder="السعر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50000">أقل من 50,000 ريال</SelectItem>
                <SelectItem value="50000-100000">50,000 - 100,000 ريال</SelectItem>
                <SelectItem value="100000-200000">100,000 - 200,000 ريال</SelectItem>
                <SelectItem value="200000+">أكثر من 200,000 ريال</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSearch}
              className="gold-gradient gold-gradient-hover text-white shadow-gold font-semibold"
              data-testid="button-search"
            >
              <Search className="ml-2 h-4 w-4" />
              البحث
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
