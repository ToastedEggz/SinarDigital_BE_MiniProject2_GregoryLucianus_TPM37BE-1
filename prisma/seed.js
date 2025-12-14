const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (safe for development)
  await prisma.bookmark.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Study" },
      { name: "Novel" },
      { name: "Science" },
      { name: "Personal" },
      { name: "Other" },
    ],
  });

  const allCategories = await prisma.category.findMany();

  // Helper function
  const randomCategory = () =>
    allCategories[Math.floor(Math.random() * allCategories.length)];

  const colors = ["red", "blue", "green", "yellow", "purple"];

  // Create 20 bookmarks
  const bookmarks = Array.from({ length: 20 }).map((_, i) => ({
    title: `Bookmark ${i + 1}`,
    color: colors[i % colors.length],
    pageNumber: Math.floor(Math.random() * 300) + 1,
    notes: `Notes for bookmark ${i + 1}`,
    categoryId: randomCategory().id,
  }));

  await prisma.bookmark.createMany({
    data: bookmarks,
  });

  console.log("🌱 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
