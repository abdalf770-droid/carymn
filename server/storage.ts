import { type Car, type InsertCar, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Car operations
  getCar(id: string): Promise<Car | undefined>;
  getAllCars(): Promise<Car[]>;
  getFeaturedCars(): Promise<Car[]>;
  getCarsByFilters(filters: {
    make?: string;
    bodyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
  }): Promise<Car[]>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
  
  // Contact operations
  getContact(id: string): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  getUnreadContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: string): Promise<boolean>;
  deleteContact(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private cars: Map<string, Car>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.cars = new Map();
    this.contacts = new Map();
    this.seedData();
  }

  private seedData() {
    // Sample luxury cars data
    const sampleCars: InsertCar[] = [
      {
        title: "مرسيدس S كلاس 2023",
        make: "مرسيدس",
        model: "S كلاس",
        year: 2023,
        price: 185000,
        mileage: 15000,
        fuelType: "بنزين",
        transmission: "أوتوماتيك",
        engineSize: "4.0L V8",
        bodyType: "سيدان",
        location: "صنعاء",
        description: "سيارة فاخرة بحالة ممتازة مع جميع الكماليات",
        features: ["نظام ملاحة", "مقاعد جلدية", "فتحة سقف", "نظام صوتي متطور"],
        images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isAvailable: true,
        isFeatured: true
      },
      {
        title: "BMW X7 2022",
        make: "BMW",
        model: "X7",
        year: 2022,
        price: 156000,
        mileage: 8500,
        fuelType: "بنزين",
        transmission: "أوتوماتيك",
        engineSize: "3.0L V6",
        bodyType: "SUV",
        location: "عدن",
        description: "BMW X7 فاخرة مع تقنيات متقدمة",
        features: ["دفع رباعي", "شاشة كبيرة", "مقاعد مدفأة", "نظام أمان متطور"],
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isAvailable: true,
        isFeatured: true
      },
      {
        title: "لكزس LS 2021",
        make: "لكزس",
        model: "LS",
        year: 2021,
        price: 128000,
        mileage: 22000,
        fuelType: "هايبرد",
        transmission: "أوتوماتيك",
        engineSize: "3.5L V6",
        bodyType: "سيدان",
        location: "تعز",
        description: "سيارة هايبرد فاخرة صديقة للبيئة",
        features: ["تقنية هايبرد", "مقاعد مساج", "نظام ترفيهي", "كاميرات 360"],
        images: ["https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isAvailable: true,
        isFeatured: false
      },
      {
        title: "تويوتا لاند كروزر 2023",
        make: "تويوتا",
        model: "لاند كروزر",
        year: 2023,
        price: 198000,
        mileage: 5200,
        fuelType: "بنزين",
        transmission: "أوتوماتيك",
        engineSize: "4.6L V8",
        bodyType: "SUV",
        location: "الحديدة",
        description: "سيارة مغامرات قوية وموثوقة",
        features: ["دفع رباعي", "تحكم في التضاريس", "مقاعد 8 أشخاص", "نظام ملاحة متقدم"],
        images: ["https://pixabay.com/get/g4d9e261263153669887c2504007877751888fe8b345f0635d4b3519a16927cd5225bd1d5dbae764e7e29e6a4817c0b203710fabea35a2fc33a6c9dfeceaf93f4_1280.jpg"],
        isAvailable: true,
        isFeatured: true
      },
      {
        title: "أودي A8 2022",
        make: "أودي",
        model: "A8",
        year: 2022,
        price: 145000,
        mileage: 12800,
        fuelType: "بنزين",
        transmission: "أوتوماتيك",
        engineSize: "3.0L V6",
        bodyType: "سيدان",
        location: "إب",
        description: "أودي A8 بتصميم أنيق وتقنيات متطورة",
        features: ["مصابيح LED", "مقاعد رياضية", "نظام صوتي بانغ آند أولفسن", "تحكم صوتي"],
        images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isAvailable: true,
        isFeatured: false
      },
      {
        title: "بورش كايين 2021",
        make: "بورش",
        model: "كايين",
        year: 2021,
        price: 175000,
        mileage: 18500,
        fuelType: "بنزين",
        transmission: "أوتوماتيك",
        engineSize: "3.0L V6 تيربو",
        bodyType: "SUV",
        location: "مأرب",
        description: "سيارة رياضية فاخرة بأداء استثنائي",
        features: ["محرك تيربو", "نظام رياضي", "مقاعد رياضية", "عجلات رياضية"],
        images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isAvailable: true,
        isFeatured: true
      }
    ];

    sampleCars.forEach(carData => {
      const id = randomUUID();
      const car: Car = {
        ...carData,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.cars.set(id, car);
    });
  }

  // Car operations
  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async getAllCars(): Promise<Car[]> {
    return Array.from(this.cars.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getFeaturedCars(): Promise<Car[]> {
    return Array.from(this.cars.values())
      .filter(car => car.isFeatured && car.isAvailable)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getCarsByFilters(filters: {
    make?: string;
    bodyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
  }): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(car => {
      if (!car.isAvailable) return false;
      if (filters.make && car.make !== filters.make) return false;
      if (filters.bodyType && car.bodyType !== filters.bodyType) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const car: Car = {
      ...insertCar,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: string, updateData: Partial<InsertCar>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;

    const updatedCar: Car = {
      ...car,
      ...updateData,
      updatedAt: new Date(),
    };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: string): Promise<boolean> {
    return this.cars.delete(id);
  }

  // Contact operations
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getUnreadContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .filter(contact => !contact.isRead)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async markContactAsRead(id: string): Promise<boolean> {
    const contact = this.contacts.get(id);
    if (!contact) return false;

    const updatedContact: Contact = {
      ...contact,
      isRead: true,
    };
    this.contacts.set(id, updatedContact);
    return true;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }
}

export const storage = new MemStorage();
