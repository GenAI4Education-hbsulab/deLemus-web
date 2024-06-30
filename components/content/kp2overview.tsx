import React from "react";
import Image from "next/image";

import References from "./references";
import NavigationButtons from "./button";

const KP2Overview: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-light">KP.2</h1>
      <p className="mb-4 text-xs">
        The KP.2 (JN.1.11.1.2) variant is the most recently emerged variant of
        SARS-CoV-2 that descended from the JN.1 lineage.
      </p>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Background
        </h2>
        <p className="mb-4">
          The World Health Organization has elevated JN.1 from a variant under
          monitoring (VUM) to a variant of interest (VOI) on 18 December 2023,
          and it has become the dominating strain across the globe. Recently,
          the KP.2 variant, a descendant of JN.1, is designated as a VUM on 3
          May 2024, swiftly after its emergence.[1]
        </p>
        <Image
          src="/images/Evolution of Omicron Subvariants.png"
          alt="Evolution of Omicron Subvariants"
          width={900}
          height={342}
        />
        <p className="mb-4">
          The KP.2 variant exhibits 2 distinct mutations in RBD, R346T and
          F456L, as depicted by its nickname @quot;FLiRT@quot;, accompanied by
          V1104L in S2, in comparison with the JN.1 strain. Amino acid residues
          346 and 456, located within epitopes which are targets of neutralizing
          antibodies, have been observed undergoing substitutions in past
          variants, like R346T in BQ.1 & XBB, and F456L in EG.5 & HK.3.[2]
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          KP2 Mutations
        </h2>
        <p className="mb-4">
          In 2024.03, the mutations outlined and confirmed by KP.2 are listed:
        </p>
        <Image
          src="/images/kp2_mutations.png"
          alt="KP2 Mutations"
          width={700}
          height={530}
        />
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Featured Mutations: L455S, F456L
        </h2>
        <p className="mb-4">
          As a characteristic mutation of the JN.1 variant, L455S was discovered
          at the beginning of the epidemic of JN.1. On the one hand, it reduced
          the binding capacity of RBD-ACE2 during in vitro ACE2 binding tests,
          but on the other hand, it increased viral infection in pseudovirus
          tests (using BA.2.86 strain as a reference).[3] This result may be
          caused by L455S altering the RBD open-close conformation dynamics at
          the partially open stage.[4] The substitution of leucine with serine
          results in a shift from a non-polar to a polar amino acid, causing an
          increased hydrophilicity, which could drive the exposure of the
          receptor binding motif to solvent. Now that the F456L mutation
          continues to occur and the hydrophobicity is further reduced, we can
          speculate that the spike protein is gaining a higher opening tendency.
        </p>
        <div className="flex flex-wrap">
          <Image
            src="/images/kp2_feat_mutations.png"
            alt="Mutation L455S"
            width={900}
            height={500}
          />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold text-2xl text-blue-600 mb-2">
          Main Mutations
        </h2>
        <p className="mb-4">
          KP.2@apos; s main mutations in other prevalent variants:
        </p>
        <div className="flex flex-wrap">
          <Image
            src="/images/kp2_main_mutations_1.png"
            alt="Mutation L455S"
            width={500}
            height={500}
          />
          <Image
            src="/images/kp2_main_mutations_2.png"
            alt="Mutation L455S"
            width={500}
            height={500}
          />
        </div>
      </section>
      <References />
      <NavigationButtons {...{ hrefs }} />
    </div>
  );
};

export default KP2Overview;

const hrefs = [
  { url: { pathname: "/content" }, text: "Back" },
  { url: { pathname: "/content/jn1" }, text: "Next" },
] as const;
