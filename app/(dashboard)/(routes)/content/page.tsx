import Head from "next/head";
import Section from "@/components/content/section";
import NavigationButtons from "@/components/content/button";

const sectionsData = [
  {
    title: "Evolution of Omicron Subvariants (Part I)",
    imageSrc: "/images/Evolution of Omicron Subvariants (Part I).png",
    imageAlt: "Evolution of Omicron Subvariants Part I",
    description: `The image shows the "Evolution of Omicron Subvariants (Part I)." This means it maps out how different subvariants have evolved from the Omicron variant of the COVID-19 virus. It shows how different subvariants are related to each other.`,
    points: [
      'Ancestor: This is the starting point for this part of the diagram, similar to "parents" in a family tree. It shows the original strain from which subsequent variants have evolved.',
      'Direct and Ancestral: The arrows illustrate how one subvariant has evolved or mutated into another. For example: B.1.1.529 ("Omicron") has given rise to BA.1 ("Progenitor Ancestor") and BA.2 ("Hidden Ancestor"). This indicates a direct evolutionary pathway.',
      "BA.1 and BA.2: These are primary subvariants that have evolved from BA.2. BA.1 has further evolved into subvariants like BA.2.5, indicating a branching evolutionary pathway.",
      'Other Evolution: From BA.2, further evolutionary branches lead to BA.1.1.1 (XBB), which subsequently branches into subvariants such as XBB.1.5. XBB is further divided into BA.1 ("Gryphon") and BA.1.1 ("Hippogryph"), showcasing complex evolutionary paths.',
      'Combining Subvariants: Some arrows demonstrate the combination of different subvariants to form new ones. For instance, BA.2.75 and BA.2 combine to form XBB.1.5 ("Gryphon"). XBB.1.5 further evolves into subvariants like XBB.1.9 ("Hippogryph") and XBB, showing the dynamic nature of viral evolution.',
      'Special Names: Certain subvariants are given special names or aliases, such as "Centaurus," "Gryphon," "Hippogryph," and "Minotaur." These names serve as convenient labels to refer to specific subvariants, making communication and identification easier.',
    ],
  },
  {
    title: "Evolution of Omicron Subvariants (Part II)",
    imageSrc: "/images/Evolution of Omicron Subvariants (Part II).png",
    imageAlt: "Evolution of Omicron Subvariants Part II",
    description: `The image shows the "Evolution of Omicron Subvariants (Part II)." This is a continuation from the previous diagram, highlighting further developments of the Omicron variant and how they have evolved into various subvariants.`,
    points: [
      'Ancestor: Similar to Part I, this part starts with the "Ancestor," representing the original strain from which subsequent subvariants have evolved.',
      'Direct and Ancestral: The arrows indicate the evolutionary progression from one subvariant to another. For example, BA.2.75 ("Centaurus") evolves into BA.2.10.4 ("Trixie"). This shows the lineage and mutation pathway.',
      'BA.2.75 ("Centaurus"): This subvariant, derived from BA.2, continues to evolve into other subvariants such as XBB ("Gryphon") and XBB ("Typhon"), indicating its significant evolutionary role.',
      'Combining Subvariants: Similar to Part I, this part shows the combination of different subvariants forming new ones. For instance, BA.2.75 and BA.2 combine to form XBB.1.5 ("Gryphon"), which further evolves into subvariants like XBB.1.9 ("Hippogryph") and XBB.',
      'Special Names: Certain subvariants are given special names or aliases such as "Centaurus," "Gryphon," "Typhon," and "Minotaur." These names help in easily referring to specific subvariants for better understanding and communication.',
      "Implications of Evolution: The evolution and combination of subvariants highlight the virus’s ability to adapt and survive. These changes can impact transmissibility, immune escape, and vaccine efficacy, underlining the importance of continuous monitoring and research.",
      "Global Impact: The rapid evolution and emergence of new subvariants have global health implications, affecting public health policies, vaccination strategies, and therapeutic approaches. Understanding these evolutionary pathways helps in devising effective countermeasures.",
    ],
  },
];

export default function Home() {
  return (
    <div className="p-6">
      <Head>
        <title>General Info</title>
      </Head>
      <div className="bg-white">
        <h1 className="text-3xl font-light mb-2">General Info.</h1>
        {sectionsData.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            imageSrc={section.imageSrc}
            imageAlt={section.imageAlt}
            description={section.description}
            points={section.points}
          />
        ))}
        <NavigationButtons hrefs={hrefs} />
      </div>
    </div>
  );
}

const hrefs = [
  { url: { pathname: "/content" }, text: "Back" },
  { url: { pathname: "/content/kp2" }, text: "Next" },
] as const;
