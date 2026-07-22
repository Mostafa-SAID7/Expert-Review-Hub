import { db, foodsTable } from "../index.js";

export async function seedFoods() {
  console.log("Seeding foods...");
  const foods = [
    {
      name: "Organic Honey",
      nameAr: "عسل طبيعي نقي",
      category: "Honey & Sweets",
      status: "tayyib" as const,
      description: "100% Raw unprocessed organic honey.",
      descriptionAr: "عسل طبيعي خام 100% خالي من الإضافات والسكر.",
    },
    {
      name: "Extra Virgin Olive Oil",
      nameAr: "زيت زيتون بكر ممتاز",
      category: "Oils",
      status: "tayyib" as const,
      description: "Cold-pressed extra virgin olive oil from Palestine.",
      descriptionAr: "زيت زيتون معصور على البارد من أجود أنواع الزيتون.",
    },
    {
      name: "Processed Meats with Nitrates",
      nameAr: "لحوم مصنعة تحتوي على نترات",
      category: "Meats",
      status: "khabeeth" as const,
      description: "Highly processed meat containing artificial preservatives and harmful nitrates.",
      descriptionAr: "لحوم مكررة تحتوي على مواد حافظة اصطناعية ونترات مضرة بالصحة.",
    },
    {
      name: "Ajwa Dates",
      nameAr: "تمر عجوة المدينة",
      category: "Fruits & Dates",
      status: "tayyib" as const,
      description: "Premium Medina Ajwa dates rich in antioxidants.",
      descriptionAr: "تمر عجوة فاخر غني بالمغذيات ومضادات الأكسدة.",
    },
    {
      name: "Artificial Energy Drink",
      nameAr: "مشروب طاقة اصطناعي",
      category: "Beverages",
      status: "khabeeth" as const,
      description: "High caffeine content with excessive refined sugar and artificial dyes.",
      descriptionAr: "مشروب عالي الكافيين يحتوي على نسب عالية من السكر المكرر والألوان الاصطناعية.",
    },
  ];

  await db.insert(foodsTable).values(foods).onConflictDoNothing();
  console.log("✓ Foods seeded successfully.");
}
