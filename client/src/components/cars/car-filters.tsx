import { Button } from "@/components/ui/button";

interface CarFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const CarFilters = ({ activeFilter, onFilterChange }: CarFiltersProps) => {
  const filters = [
    { id: "all", label: "جميع السيارات" },
    { id: "سيدان", label: "سيدان" },
    { id: "SUV", label: "SUV" },
    { id: "كوبيه", label: "رياضية" },
    { id: "featured", label: "مميزة" },
  ];

  return (
    <div className="flex justify-center mb-12 space-x-reverse space-x-4 flex-wrap gap-4">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className={`font-semibold transition-colors ${
            activeFilter === filter.id
              ? "bg-gold-600 text-white hover:bg-gold-700"
              : "bg-gray-200 text-gray-700 hover:bg-gold-100"
          }`}
          data-testid={`button-filter-${filter.id}`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default CarFilters;
