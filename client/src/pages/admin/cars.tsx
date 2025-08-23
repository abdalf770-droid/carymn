import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Car as CarType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AdminNav from "@/components/admin/admin-nav";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  Car,
  MapPin,
  Calendar,
  Fuel
} from "lucide-react";
import { Link } from "wouter";

const AdminCars = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);

  const { data: cars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cars/${id}`, null);
    },
    onSuccess: () => {
      toast({
        title: "تم حذف السيارة بنجاح",
        description: "تم حذف السيارة من النظام نهائياً",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
    },
    onError: () => {
      toast({
        title: "خطأ في حذف السيارة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      return apiRequest("PUT", `/api/cars/${id}`, { isAvailable });
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث حالة السيارة",
        description: "تم تغيير حالة توفر السيارة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
    },
    onError: () => {
      toast({
        title: "خطأ في تحديث السيارة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const filteredCars = cars?.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "available" && car.isAvailable) ||
                         (filterStatus === "unavailable" && !car.isAvailable) ||
                         (filterStatus === "featured" && car.isFeatured);

    return matchesSearch && matchesFilter;
  }) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleAvailability = (car: CarType) => {
    toggleAvailabilityMutation.mutate({
      id: car.id,
      isAvailable: !car.isAvailable
    });
  };

  return (
    <div className="bg-luxury-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 font-amiri">
                إدارة <span className="text-gold-600">السيارات</span>
              </h1>
              <p className="text-xl text-gray-600">عرض وتعديل وحذف السيارات الموجودة</p>
            </div>
            <Link href="/admin/add-car" data-testid="link-add-car">
              <Button className="bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 transition-all shadow-gold">
                <Plus className="w-4 h-4 ml-2" />
                إضافة سيارة جديدة
              </Button>
            </Link>
          </div>
        </div>

        <AdminNav />

        {/* Search and Filters */}
        <Card className="shadow-luxury mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 ml-2" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في السيارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  data-testid="input-search"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="select-filter">
                  <SelectValue placeholder="تصفية الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع السيارات</SelectItem>
                  <SelectItem value="available">المتاحة للبيع</SelectItem>
                  <SelectItem value="unavailable">غير متاحة</SelectItem>
                  <SelectItem value="featured">المميزة</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                <Car className="w-4 h-4 ml-2" />
                <span data-testid="text-car-count">
                  {filteredCars.length} من أصل {cars?.length || 0} سيارة
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCars.length === 0 ? (
          <Card className="shadow-luxury">
            <CardContent className="text-center py-12">
              <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد سيارات</h3>
              <p className="text-gray-500 mb-6" data-testid="text-no-cars">
                {searchQuery || filterStatus !== "all" 
                  ? "لا توجد سيارات تطابق معايير البحث"
                  : "لم يتم إضافة أي سيارات بعد"
                }
              </p>
              {!searchQuery && filterStatus === "all" && (
                <Link href="/admin/add-car" data-testid="link-add-first-car">
                  <Button className="bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة السيارة الأولى
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Card key={car.id} className="shadow-luxury hover:shadow-gold transition-all duration-300 group" data-testid={`car-card-${car.id}`}>
                <div className="relative">
                  <img 
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                    alt={car.title} 
                    className="w-full h-48 object-cover"
                    data-testid={`img-car-${car.id}`}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {car.isFeatured && (
                      <Badge className="bg-gold-100 text-gold-800">مميزة</Badge>
                    )}
                    <Badge 
                      variant={car.isAvailable ? "default" : "secondary"}
                      className={car.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {car.isAvailable ? "متاحة" : "غير متاحة"}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2" data-testid={`text-car-title-${car.id}`}>
                      {car.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {car.make} {car.model} • {car.year}
                    </p>
                    <p className="text-2xl font-bold text-gold-600 mb-3" data-testid={`text-car-price-${car.id}`}>
                      {formatPrice(car.price)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 ml-1" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="w-3 h-3 ml-1" />
                      <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <MapPin className="w-3 h-3 ml-1" />
                      <span>{car.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-reverse space-x-2">
                      {/* View Details Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedCar(car)}
                            data-testid={`button-view-${car.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-amiri text-2xl">تفاصيل السيارة</DialogTitle>
                          </DialogHeader>
                          {selectedCar && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold text-lg mb-2">{selectedCar.title}</h3>
                                  <p className="text-gray-600 mb-2">{selectedCar.make} {selectedCar.model}</p>
                                  <p className="text-2xl font-bold text-gold-600">{formatPrice(selectedCar.price)}</p>
                                </div>
                                <img 
                                  src={selectedCar.images?.[0] || ""} 
                                  alt={selectedCar.title}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>السنة:</strong> {selectedCar.year}</div>
                                <div><strong>المسافة:</strong> {selectedCar.mileage.toLocaleString()} كم</div>
                                <div><strong>الوقود:</strong> {selectedCar.fuelType}</div>
                                <div><strong>النقل:</strong> {selectedCar.transmission}</div>
                                <div><strong>المحرك:</strong> {selectedCar.engineSize}</div>
                                <div><strong>الموقع:</strong> {selectedCar.location}</div>
                              </div>
                              
                              {selectedCar.description && (
                                <div>
                                  <strong>الوصف:</strong>
                                  <p className="mt-1 text-gray-700">{selectedCar.description}</p>
                                </div>
                              )}
                              
                              {selectedCar.features && selectedCar.features.length > 0 && (
                                <div>
                                  <strong>المميزات:</strong>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedCar.features.map((feature, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Edit Button */}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-blue-600 hover:bg-blue-50"
                        data-testid={`button-edit-${car.id}`}
                        disabled
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex space-x-reverse space-x-2">
                      {/* Toggle Availability */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleAvailability(car)}
                        className={car.isAvailable ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                        disabled={toggleAvailabilityMutation.isPending}
                        data-testid={`button-toggle-${car.id}`}
                      >
                        {car.isAvailable ? "إخفاء" : "إظهار"}
                      </Button>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            data-testid={`button-delete-${car.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف السيارة "{car.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="space-x-reverse space-x-2">
                            <AlertDialogCancel data-testid={`button-cancel-delete-${car.id}`}>
                              إلغاء
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(car.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deleteMutation.isPending}
                              data-testid={`button-confirm-delete-${car.id}`}
                            >
                              {deleteMutation.isPending ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                "حذف"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
