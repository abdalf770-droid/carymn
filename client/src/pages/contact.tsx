import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send
} from "lucide-react";
import type { z } from "zod";

type ContactFormData = z.infer<typeof insertContactSchema>;

const Contact = () => {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="bg-luxury-light min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-amiri">تواصل معنا</h1>
          <p className="text-xl text-gray-600">نحن هنا لخدمتك في أي وقت</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-luxury">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">أرسل لنا رسالة</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل اسمك الكامل" 
                            {...field} 
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل رقم هاتفك" 
                            {...field} 
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="أدخل بريدك الإلكتروني" 
                            {...field} 
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرسالة</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="اكتب رسالتك هنا" 
                            {...field} 
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 transition-all shadow-gold"
                    disabled={contactMutation.isPending}
                    data-testid="button-submit"
                  >
                    {contactMutation.isPending ? (
                      <LoadingSpinner size="sm" className="ml-2" />
                    ) : (
                      <Send className="w-4 h-4 ml-2" />
                    )}
                    إرسال الرسالة
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="bg-gold-600 rounded-full p-3">
                    <Phone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">اتصل بنا</h3>
                    <p className="text-gray-600">+967 1 234 567</p>
                    <p className="text-gray-600">+967 770 123 456</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="bg-gold-600 rounded-full p-3">
                    <Mail className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">البريد الإلكتروني</h3>
                    <p className="text-gray-600">info@abuhaidar-cars.com</p>
                    <p className="text-gray-600">sales@abuhaidar-cars.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="bg-gold-600 rounded-full p-3">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">العنوان</h3>
                    <p className="text-gray-600">شارع الستين، منطقة الحصبة</p>
                    <p className="text-gray-600">صنعاء، اليمن</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="bg-gold-600 rounded-full p-3">
                    <Clock className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">ساعات العمل</h3>
                    <p className="text-gray-600">السبت - الخميس: 8:00 ص - 8:00 م</p>
                    <p className="text-gray-600">الجمعة: 2:00 م - 8:00 م</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
