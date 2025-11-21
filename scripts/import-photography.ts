import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const portfolio = [
  {
    title: "Moroccan Equestrian Art",
    category: "Cultural",
    image: "/photography/Moroccan-equestrian-art--tbourida----and-shots-that-stayed-way-too-long-in-my-camera.--yourshotp.jpg",
    description: "",
    featured: false,
    order: 1,
  },
  {
    title: "Tbourida Art",
    category: "Cultural",
    image: "/photography/Moroccan-equestrian-art--tbourida----and-shots-that-stayed-way-too-long-in-my-camera.--yourshotp--1-.jpg",
    description: "",
    featured: false,
    order: 2,
  },
  {
    title: "Equestrian Photography",
    category: "Cultural",
    image: "/photography/Moroccan-equestrian-art--tbourida----and-shots-that-stayed-way-too-long-in-my-camera.--yourshotp--2-.jpg",
    description: "",
    featured: false,
    order: 3,
  },
  {
    title: "Sandstorm Aesthetics",
    category: "Adventure",
    image: "/photography/sandstorm-aesthetics-enduro.jpg",
    description: "",
    featured: true,
    order: 4,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_285944640_749473589809454_3150065497059521760_n.jpg",
    description: "",
    featured: false,
    order: 5,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_285958631_797175361278497_4156943208252385210_n.jpg",
    description: "",
    featured: false,
    order: 6,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_286229915_139955931962559_4114156546180902768_n.jpg",
    description: "",
    featured: false,
    order: 7,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_286264897_166436049179832_8576628153007616255_n.jpg",
    description: "",
    featured: false,
    order: 8,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_286395359_1010442232943605_1364096570174400269_n.jpg",
    description: "",
    featured: false,
    order: 9,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_286596297_347472930853333_5959751300077876313_n.jpg",
    description: "",
    featured: false,
    order: 10,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_348482759_1118041429586596_6948911033448556305_n.jpg",
    description: "",
    featured: false,
    order: 11,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_348501697_804820757676409_5029574931353129042_n.jpg",
    description: "",
    featured: false,
    order: 12,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_348502222_1952458561772876_2037669789508555136_n.jpg",
    description: "",
    featured: false,
    order: 13,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_348832367_282667814105577_2350016748184074076_n.jpg",
    description: "",
    featured: false,
    order: 14,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_383210293_3378731082437356_2040821813781284353_n.jpg",
    description: "",
    featured: false,
    order: 15,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_384121194_1225548718839850_3622562154938087237_n.jpg",
    description: "",
    featured: false,
    order: 16,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_384225380_1673584376500810_7947164182321983601_n.jpg",
    description: "",
    featured: false,
    order: 17,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_384513449_339403928453340_1402748163538938923_n.jpg",
    description: "",
    featured: false,
    order: 18,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_384692195_325629423471897_1987290720100708418_n.jpg",
    description: "",
    featured: false,
    order: 19,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_385152302_320581647291316_5138119132852301915_n.jpg",
    description: "",
    featured: false,
    order: 20,
  },
  {
    title: "Instagram Story",
    category: "Social Media",
    image: "/photography/SnapInsta.to_434839034_975640473681383_3714742764191781847_n.jpg",
    description: "",
    featured: false,
    order: 21,
  },
];

async function importPhotography() {
  try {
    console.log("📸 Starting photography import...");
    
    // Check if photos already exist
    const existingCount = await prisma.photography.count();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing photos in database.`);
      console.log("   Skipping import to avoid duplicates.");
      console.log("   If you want to re-import, delete existing photos first.");
      return;
    }

    // Import all photos
    for (const photo of portfolio) {
      await prisma.photography.create({
        data: photo,
      });
      console.log(`✅ Imported: ${photo.title}`);
    }

    console.log(`\n✅ Successfully imported ${portfolio.length} photos!`);
    console.log("   You can now see them in the admin photography panel.");
  } catch (error) {
    console.error("❌ Error importing photography:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importPhotography();




