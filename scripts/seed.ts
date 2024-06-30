const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Web Development" },
        { name: "Mobile Development" },
        { name: "Data Science" },
        { name: "Machine Learning" },
        { name: "Artificial Intelligence" },
        { name: "Blockchain" },
        { name: "Cybersecurity" },
        { name: "Cloud Computing" },
        { name: "DevOps" },
        { name: "Databases" },
        { name: "Programming Languages" },
        { name: "Game Development" },
        { name: "Software Testing" },
        { name: "Software Engineering" },
      ],
    });
    console.log("Categories seeded successfully");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
