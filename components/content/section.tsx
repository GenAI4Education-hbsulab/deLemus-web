import Image from "next/image";
import PropTypes from "prop-types";

type TSection = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  points: string[];
};

const Section = ({
  title,
  imageSrc,
  imageAlt,
  description,
  points,
}: TSection) => (
  <div className="bg-white rounded-lg mb-6 ">
    <h2 className="text-2xl mb-4 text-blue-700 font-seminbold">{title}</h2>
    <div className="relative w-full h-64 mb-4">
      <Image
        src={imageSrc}
        alt={imageAlt}
        layout="fill"
        objectFit="contain"
        className="rounded"
      />
    </div>
    <p className="mb-4 text-gray-700">{description}</p>
    <h3 className="text-lg mb-2 text-blue-600 font-semibold">Key Points:</h3>
    <ul className="list-disc list-inside mb-4 text-gray-600">
      {points.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Section;
