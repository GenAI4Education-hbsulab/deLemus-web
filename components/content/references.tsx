import React from "react";

const references = [
  {
    id: 1,
    title: "Tracking SARS-CoV-2 variants",
    year: "2024",
    url: "https://www.who.int/activities/tracking-SARS-CoV-2-variants",
  },
  {
    id: 2,
    title: "Statement on the antigen composition of COVID-19 vaccines",
    year: "2024",
    url: "https://www.who.int/news/item/26-04-2024-statement-on-the-antigen-composition-of-covid-19-vaccines",
  },
  {
    id: 3,
    title: "Virological characteristics of the SARS-COV-2 JN.1 variant",
    year: "2024",
    source: "Lancet Infect Dis",
    volume: "24",
    page: "e82",
  },
  {
    id: 4,
    title:
      "Distant residues modulate conformational opening in SARS-COV-2 spike protein",
    year: "2021",
    source: "Proc Natl Acad Sci U S A",
    volume: "118",
    page: "e2100943118",
  },
];

const References: React.FC = () => {
  return (
    <div className="mb-6 bg-white rounded">
      <h2 className="text-2xl font-semibold mb-2">References</h2>
      <ol className="list-decimal pl-5">
        {references.map((ref) => (
          <li key={ref.id} className="mb-1">
            {ref.title} ({ref.year}).{" "}
            {ref?.url ? (
              <a
                href={ref.url}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ref.url}
              </a>
            ) : null}{" "}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default References;
