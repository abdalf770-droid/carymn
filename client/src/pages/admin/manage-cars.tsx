import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Car as CarType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import AdminNav from "@/components/admin/admin-nav";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Download,
  Upload,
  Settings,
  Car,
  CheckSquare,
  Square
} from "lucide-react";

const ManageCars = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCars, setSelectedCars] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>("");

  const { data: cars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ carIds, updates }: { carIds: string[]; updates: Partial<CarType> }) => {
      const promises = carIds.map(id => 
        apiRequest("PUT", `/api/cars/${id}`, updates)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث السيارات بنجاح",
        description: "تم تطبيق التغييرات على السيارات المحددة",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setSelectedCars(new Set());
      setBulkAction("");
    },
    onError: () => {
      toast({
        title: "خطأ في تحديث السيارات",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (carIds: string[]) => {
      const promises = carIds.map(id => 
        apiRequest("DELETE", `/api/cars/${id}`, null)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "تم حذف السيارات بنجاح",
        description: "تم حذف السيارات المحددة من النظام",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setSelectedCars(new Set());
    },
    onError: () => {
      toast({
        title: "خطأ في حذف السيارات",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const filteredCars = cars?.filter(car => 
    car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSelectCar = (carId: string) => {
    const newSelected = new Set(selectedCars);
    if (newSelected.has(carId)) {
      newSelected.delete(carId);
    } else {
      newSelected.add(carId);
    }
    setSelectedCars(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCars.size === filteredCars.length) {
      setSelectedCars(new Set());
    } else {
      setSelectedCars(new Set(filteredCars.map(car => car.id)));
    }
  };

  const handleBulkAction = () => {
    const carIds = Array.from(selectedCars);
    
    switch (bulkAction) {
      case "feature":
        bulkUpdateMutation.mutate({ 
          carIds, 
          updates: { isFeatured: true } 
        });
        break;
      case "unfeature":
        bulkUpdateMutation.mutate({ 
          carIds, 
          updates: { isFeatured: false } 
        });
        break;
      case "available":
        bulkUpdateMutation.mutate({ 
          carIds, 
          updates: { isAvailable: true } 
        });
        break;
      case "unavailable":
        bulkUpdateMutation.mutate({ 
          carIds, 
          updates: { isAvailable: false } 
        });
        break;
      case "delete":
        bulkDeleteMutation.mutate(carIds);
        break;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const exportCarsData = () => {
    const csvContent = [
      "العنوان,الماركة,الموديل,السنة,السعر,المسافة,نوع الوقود,ناقل الحركة,الموقع,متاحة,مميزة",
      ...filteredCars.map(car => 
        `"${car.title}","${car.make}","${car.model}",${car.year},${car.price},${car.mileage},"${car.fuelType}","${car.transmission}","${car.location}",${car.isAvailable ? 'نعم' : 'لا'},${car.isFeatured ? 'نعم' : 'لا'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cars_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-luxury-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">
            إدارة <span className="text-gold-600">السيارات المتقدمة</span>
          </h1>
          <p className="text-xl text-gray-600">أدوات متقدمة لإدارة مجموعة السيارات</p>
        </div>

        <AdminNav />

        {/* Bulk Actions */}
        <Card className="shadow-luxury mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 ml-2" />
              العمليات المجمعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger data-testid="select-bulk-action">
                  <SelectValue placeholder="اختر العملية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">تمييز السيارات</SelectItem>
                  <SelectItem value="unfeature">إلغاء التمييز</SelectItem>
                  <SelectItem value="available">جعل متاحة</SelectItem>
                  <SelectItem value="unavailable">جعل غير متاحة</SelectItem>
                  <SelectItem value="delete">حذف السيارات</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleBulkAction}
                disabled={selectedCars.size === 0 || !bulkAction || bulkUpdateMutation.isPending || bulkDeleteMutation.isPending}
                className="bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600"
                data-testid="button-apply-bulk"
              >
                {(bulkUpdateMutation.isPending || bulkDeleteMutation.isPending) ? (
                  <LoadingSpinner size="sm" className="ml-2" />
                ) : (
                  <CheckSquare className="w-4 h-4 ml-2" />
                )}
                تطبيق ({selectedCars.size})
              </Button>

              <Button
                onClick={exportCarsData}
                variant="outline"
                className="border-gold-600 text-gold-600 hover:bg-gold-50"
                data-testid="button-export"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير البيانات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cars Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCars.length === 0 ? (
          <Card className="shadow-luxury">
            <CardContent className="text-center py-12">
              <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد سيارات</h3>
              <p className="text-gray-500" data-testid="text-no-cars">
                {searchQuery ? "لا توجد سيارات تطابق معايير البحث" : "لم يتم إضافة أي سيارات بعد"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-luxury">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 ml-2" />
                  قائمة السيارات ({filteredCars.length})
                </CardTitle>
                <div className="flex items-center space-x-reverse space-x-2">
                  <Checkbox
                    checked={selectedCars.size === filteredCars.length && filteredCars.length > 0}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                  <span className="text-sm text-gray-600">تحديد الكل</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-right">تحديد</th>
                      <th className="p-4 text-right">الصورة</th>
                      <th className="p-4 text-right">تفاصيل السيارة</th>
                      <th className="p-4 text-right">السعر</th>
                      <th className="p-4 text-right">الحالة</th>
                      <th className="p-4 text-right">إجراءات سريعة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="border-t hover:bg-gray-50" data-testid={`row-car-${car.id}`}>
                        <td className="p-4">
                          <Checkbox
                            checked={selectedCars.has(car.id)}
                            onCheckedChange={() => handleSelectCar(car.id)}
                            data-testid={`checkbox-car-${car.id}`}
                          />
                        </td>
                        <td className="p-4">
                          <img 
                            src={car.images?.[0] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=75"} 
                            alt={car.title}
                            className="w-16 h-12 object-cover rounded"
                            data-testid={`img-car-${car.id}`}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <h3 className="font-semibold text-gray-800" data-testid={`text-car-title-${car.id}`}>
                              {car.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {car.make} {car.model} • {car.year}
                            </p>
                            <p className="text-xs text-gray-500">
                              {car.mileage.toLocaleString()} كم • {car.location}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gold-600" data-testid={`text-car-price-${car.id}`}>
                            {formatPrice(car.price)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col space-y-1">
                            <Badge 
                              variant={car.isAvailable ? "default" : "secondary"}
                              className={car.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {car.isAvailable ? "متاحة" : "غير متاحة"}
                            </Badge>
                            {car.isFeatured && (
                              <Badge className="bg-gold-100 text-gold-800">
                                مميزة
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-reverse space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                bulkUpdateMutation.mutate({
                                  carIds: [car.id],
                                  updates: { isFeatured: !car.isFeatured }
                                });
                              }}
                              className="text-xs"
                              data-testid={`button-toggle-featured-${car.id}`}
                            >
                              {car.isFeatured ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                bulkUpdateMutation.mutate({
                                  carIds: [car.id],
                                  updates: { isAvailable: !car.isAvailable }
                                });
                              }}
                              className="text-xs"
                              data-testid={`button-toggle-available-${car.id}`}
                            >
                              {car.isAvailable ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50 text-xs"
                                  data-testid={`button-delete-${car.id}`}
                                >
                                  <Trash2 className="w-3 h-3" />
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
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => bulkDeleteMutation.mutate([car.id])}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={bulkDeleteMutation.isPending}
                                  >
                                    {bulkDeleteMutation.isPending ? <LoadingSpinner size="sm" /> : "حذف"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {cars && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="shadow-luxury">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gold-600">{cars.length}</div>
                <div className="text-sm text-gray-600">إجمالي السيارات</div>
              </CardContent>
            </Card>
            <Card className="shadow-luxury">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {cars.filter(car => car.isAvailable).length}
                </div>
                <div className="text-sm text-gray-600">متاحة للبيع</div>
              </CardContent>
            </Card>
            <Card className="shadow-luxury">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {cars.filter(car => car.isFeatured).length}
                </div>
                <div className="text-sm text-gray-600">مميزة</div>
              </CardContent>
            </Card>
            <Card className="shadow-luxury">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gold-600">{selectedCars.size}</div>
                <div className="text-sm text-gray-600">محددة</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCars;
