import type { Metadata } from "next";
import { getServerLocale } from "../api/server";

type PageKey = "home" | "tours" | "destinations" | "cars" | "customTrip" | "booking" | "about" | "contact" | "faq";

const english: Record<PageKey, [string, string]> = {
  home: ["Armenia Tours & Private Trips | Armenia Journeys", "Explore Armenia with local guides on small-group tours, private day trips and custom journeys from Yerevan."],
  tours: ["Tours in Armenia | Armenia Journeys", "Browse small-group, private and premium tours across Armenia."],
  destinations: ["Places to Visit in Armenia | Armenia Journeys", "Explore Armenia's cities, monasteries, lakes and mountain destinations."],
  cars: ["Tour Vehicles in Armenia | Armenia Journeys", "See the comfortable vehicles available for private tours and transfers in Armenia."],
  customTrip: ["Build a Custom Armenia Trip | Armenia Journeys", "Create a private Armenia itinerary around your dates, interests and preferred vehicle."],
  booking: ["Book an Armenia Tour | Armenia Journeys", "Choose your Armenia journey, date and pickup details and request your booking."],
  about: ["About Armenia Journeys", "Meet the local team helping travelers discover Armenia."],
  contact: ["Contact Armenia Journeys", "Contact our local team to plan your Armenia tour."],
  faq: ["Armenia Tour FAQ | Armenia Journeys", "Answers about booking, vehicles, pickup and tours in Armenia."],
};

const persian: Record<PageKey, [string, string]> = {
  home: ["تور ارمنستان و سفرهای خصوصی | سفرهای ارمنستان", "ارمنستان را با تورهای گروهی کوچک، سفرهای خصوصی یک‌روزه و برنامه‌های اختصاصی از ایروان کشف کنید."],
  tours: ["تورهای ارمنستان | سفرهای ارمنستان", "تورهای گروهی کوچک، خصوصی و ممتاز در سراسر ارمنستان را مشاهده و مقایسه کنید."],
  destinations: ["دیدنی‌های ارمنستان | سفرهای ارمنستان", "شهرها، صومعه‌ها، دریاچه‌ها و مقصدهای کوهستانی ارمنستان را کشف کنید."],
  cars: ["خودروهای تور در ارمنستان | سفرهای ارمنستان", "خودروهای راحت موجود برای تورهای خصوصی و ترانسفر در ارمنستان را ببینید."],
  customTrip: ["ساخت سفر اختصاصی ارمنستان | سفرهای ارمنستان", "برنامه خصوصی سفر به ارمنستان را براساس تاریخ، علایق و خودروی دلخواه خود بسازید."],
  booking: ["رزرو تور ارمنستان | سفرهای ارمنستان", "سفر، تاریخ و اطلاعات ترانسفر خود را انتخاب کنید و درخواست رزرو تور ارمنستان را ثبت کنید."],
  about: ["درباره سفرهای ارمنستان", "با تیم محلی ما که به مسافران برای کشف ارمنستان کمک می‌کند آشنا شوید."],
  contact: ["تماس با سفرهای ارمنستان", "برای برنامه‌ریزی تور ارمنستان با تیم محلی ما تماس بگیرید."],
  faq: ["پرسش‌های متداول تور ارمنستان | سفرهای ارمنستان", "پاسخ پرسش‌های مربوط به رزرو، خودرو، ترانسفر و تورهای ارمنستان."],
};

export async function pageMetadata(key: PageKey): Promise<Metadata> {
  const locale = await getServerLocale();
  const [title, description] = locale === "fa" ? persian[key] : english[key];
  return { title: { absolute: title }, description };
}
