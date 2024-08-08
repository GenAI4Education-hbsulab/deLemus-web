"use client";
import React from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import NavigationButtons from "./button";

const MolstarViewer = dynamic(() => import('./MolstarViewer'), {
  loading: () => <p>Loading 3D viewer...</p>,
  ssr: false
});

const JN1Overview: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-light mb-4">JN.1</h1>
      <p className="mb-4 text-sm">
        The JN.1 (BA.2.86.1.1) is the most recently dominating variant of
        SARS-CoV-2 that descended from the BA.2.86 lineage.
      </p>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Background
        </h2>
        <p className="mb-4">
          In comparison to the BA.2.86 strain, JN.1 exhibits a notable L455S
          spike protein mutation, accompanied by three other mutations located
          in the non-spike proteins. The SARS-CoV-2 BA.2.86 lineage, identified
          initially in August 2023, differs genetically from the extant Omicron
          XBB variants such as EG.5.1 and HK.3. Possessing more than 30 spike
          protein mutations, the BA.2.86 lineage demonstrates a strong potential
          to circumvent pre-existing immunity to SARS-CoV-2. The JN.1 variant
          has exhibited a swift increase in its proportion of the global viral
          variants since November, leading to the World Health
          Organization@apos;s elevation of BA.2.86 from the status of a Variant
          Under Monitoring (VUM) to that of a Variant of Interest (VOI) as of
          November 21.
        </p>
        <p className="mb-4">
          The JN.1 variant@apos;s rapid spread and dominance highlight the
          significance of its mutations and their potential impact on global
          health. Understanding these changes is crucial for developing
          effective strategies to combat the virus.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          JN.1 Mutations
        </h2>
        <p className="mb-4">
          In <strong>2023.11</strong>, the mutations outlined and confirmed by
          JN.1 are listed:
        </p>
        <div className="flex flex-wrap">
          <Image
            src="/images/jn1_mutations.png"
            alt="JN.1 Mutations"
            width={700}
            height={526}
          />
          <MolstarViewer />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Featured Mutations: L455S
        </h2>
        <p className="mb-4">
          deLemus captured the L455F mutation in September 2023, which was
          confirmed by the subsequent EG.5.1.1. In the following November we
          also captured the L455S. This record can be found on our Update page.
        </p>
        <div className="flex flex-wrap">
          <Image
            src="/images/jn1_feat_mutations.png"
            alt="Mutation L455S"
            width={1000}
            height={300}
          />
        </div>
        <p className="mb-4">
          The L455S mutation occurs within the receptor-binding domain (RBD) of
          the spike protein, a region that is crucial for the interaction with
          the human ACE2 receptor. Recent reports and studies, such as the one
          found at bioRxiv, suggest that the RBD harboring this mutation
          displays a reduced affinity for binding with human ACE2. This could
          paradoxically enhance the transmissibility of the JN.1 variant, as the
          mutation may confer an increased ability to evade immune responses
          elicited by previous exposures to variants such as XBB.1.5 and EG.5.1.
        </p>
        <div className="flex flex-wrap">
          <Image
            src="/images/jn1_feat_mutations_2.png"
            alt="Mutation L455S"
            width={800}
            height={350}
          />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Main Mutations
        </h2>
        <p className="mb-4">
          JN.1@apos;s main mutations in other prevalent variants:
        </p>
        <Image
          src="/images/jn1_main_mutations.png"
          alt="Main Mutations"
          width={1000}
          height={740}
        />
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Clinical Significance
        </h2>
        <p className="mb-4">
          The clinical significance of JN.1 lies in its potential impact on
          public health. The presence of the L455S mutation within the
          receptor-binding domain (RBD) of the spike protein may enhance the
          virus@apos;s ability to evade immune responses. This could lead to
          increased transmissibility and potentially more severe disease
          outcomes, especially in populations with waning immunity or
          compromised health.
        </p>
        <p className="mb-4">
          Research is ongoing to determine the exact effects of JN.1 on vaccine
          efficacy and the overall effectiveness of current therapeutic
          measures. Continued surveillance and rapid response strategies are
          essential to mitigate the potential impact of this variant on global
          health.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Comparison with Other Variants
        </h2>
        <p className="mb-4">
          When compared to other variants, JN.1 exhibits unique characteristics
          that distinguish it from its predecessors. The presence of the L455S
          mutation in the RBD region, along with other mutations in the
          non-spike proteins, provides JN.1 with a distinct advantage in terms
          of immune evasion and transmissibility.
        </p>
        <p className="mb-4">
          Additionally, the genetic differences between JN.1 and other Omicron
          variants such as XBB and EG.5 highlight the need for ongoing
          surveillance and research to understand the full implications of these
          mutations on public health. Comparing and analyzing these
          characteristics will help inform future vaccine and therapeutic
          development.
        </p>
      </section>
      <NavigationButtons hrefs={hrefs} />
    </div>
  );
};

export default JN1Overview;

const hrefs = [
  { url: { pathname: "/student/content/kp2" }, text: "Back" },
  { url: { pathname: "/student/content/quiz" }, text: "Next" },
] as const;