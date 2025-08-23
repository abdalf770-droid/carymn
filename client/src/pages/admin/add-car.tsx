import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCarSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import AdminNav from "@/components/admin/admin-nav";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus,
  Upload,
  X,
  Car,
  Save
} from "lucide-react";
import { useLocation } from "wouter";
import type { z } from "zod";

type CarFormData = z.infer<typeof insertCarSchema>;

const AddCar = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const form = useForm<CarFormData>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: "",
      transmission: "",
      engineSize: "",
      bodyType: "",
      location: "",
      description: "",
      features: [],
      images: [],
      isAvailable: true,
      isFeatured: false,
    },
  });

  const addCarMutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      const formData = new FormData();
      
      // Append car data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "features" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "images") {
          formData.append(key, value.toString());
        }
      });

      // Append images
      selectedImages.forEach((image, index) => {
        formData.append("images", image);
      });

      return apiRequest("POST", "/api/cars", formData);
    },
    onSuccess: () => {
      toast({
        title: "تم إضافة السيارة بنجاح",
        description: "تم حفظ بيانات السيارة وإضافتها إلى المخزون",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setLocation("/admin/cars");
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة السيارة",
        description: "يرجى التحقق من البيانات والمحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 10;
    
    if (selectedImages.length + files.length > maxFiles) {
      toast({
        title: "عدد الصور كثير",
        description: `يمكن رفع ${maxFiles} صور كحد أقصى`,
        variant: "destructive",
      });
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Create preview URLs
    const newPreviewUrls = [...imagePreviewUrls];
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    });
    setImagePreviewUrls(newPreviewUrls);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const onSubmit = (data: CarFormData) => {
    if (selectedImages.length === 0) {
      toast({
        title: "صور مطلوبة",
        description: "يرجى رفع صورة واحدة على الأقل للسيارة",
        variant: "destructive",
      });
      return;
    }

    addCarMutation.mutate(data);
  };

  const makes = [
    "مرسيدس", "BMW", "لكزس", "تويوتا", "أودي", "بورش", "نيسان", "هوندا", 
    "هيونداي", "كيا", "فولكس فاغن", "فورد", "شيفروليه", "ميتسوبيشي", "سوبارو"
  ];

  const bodyTypes = [
    "سيدان", "SUV", "هاتش باك", "كوبيه", "واجن", "بيك أب", "كابريوليت", "كروس أوفر"
  ];

  const fuelTypes = [
    "بنزين", "ديزل", "هايبرد", "كهرباء", "غاز طبيعي"
  ];

  const transmissionTypes = [
    "أوتوماتيك", "يدوي", "CVT", "أوتوماتيك مع تحكم يدوي"
  ];

  const locations = [
    "صنعاء", "عدن", "تعز", "الحديدة", "إب", "مأرب", "صعدة", "حضرموت", "لحج", "أبين"
  ];

  return (
    <div className="bg-luxury-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">
            إضافة <span className="text-gold-600">سيارة جديدة</span>
          </h1>
          <p className="text-xl text-gray-600">أضف سيارة جديدة إلى المخزون</p>
        </div>

        <AdminNav />

        <Card className="shadow-luxury">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Plus className="w-6 h-6 ml-2 text-gold-600" />
              تفاصيل السيارة الجديدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان السيارة</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: مرسيدس S كلاس 2023" 
                            {...field} 
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الماركة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-make">
                              <SelectValue placeholder="اختر الماركة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {makes.map((make) => (
                              <SelectItem key={make} value={make}>{make}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الموديل</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: S كلاس" 
                            {...field} 
                            data-testid="input-model"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>سنة الصنع</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1980" 
                            max="2025" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-year"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر (ريال يمني)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المسافة المقطوعة (كم)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-mileage"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الهيكل</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-body-type">
                              <SelectValue placeholder="اختر نوع الهيكل" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bodyTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الوقود</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fuel-type">
                              <SelectValue placeholder="اختر نوع الوقود" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fuelTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع ناقل الحركة</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-transmission">
                              <SelectValue placeholder="اختر نوع ناقل الحركة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transmissionTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engineSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>حجم المحرك</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: 3.0L V6" 
                            {...field} 
                            data-testid="input-engine-size"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الموقع</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-location">
                              <SelectValue placeholder="اختر الموقع" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>{location}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          placeholder="وصف مفصل للسيارة..."
                          {...field} 
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Features */}
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المميزات (مفصولة بفاصلة)</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3}
                          placeholder="نظام ملاحة, مقاعد جلدية, فتحة سقف, نظام صوتي متطور"
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => {
                            const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                            field.onChange(features);
                          }}
                          data-testid="textarea-features"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images Upload */}
                <div className="space-y-4">
                  <FormLabel>صور السيارة</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 mb-4">
                        <label htmlFor="images" className="cursor-pointer">
                          <span className="text-gold-600 font-semibold">اختر الصور</span> أو اسحب وأفلت
                          <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            data-testid="input-images"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP حتى 5MB لكل صورة</p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`معاينة ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            data-testid={`img-preview-${index}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            data-testid={`button-remove-image-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">متاحة للبيع</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            هل السيارة متاحة للعرض والبيع؟
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-available"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">سيارة مميزة</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            عرض السيارة في القسم المميز؟
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-featured"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-reverse space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin/cars")}
                    data-testid="button-cancel"
                  >
                    إلغاء
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 transition-all shadow-gold"
                    disabled={addCarMutation.isPending}
                    data-testid="button-save"
                  >
                    {addCarMutation.isPending ? (
                      <LoadingSpinner size="sm" className="ml-2" />
                    ) : (
                      <Save className="w-4 h-4 ml-2" />
                    )}
                    حفظ السيارة
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCar;
