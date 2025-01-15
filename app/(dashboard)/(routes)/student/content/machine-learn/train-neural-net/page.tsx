export default function TrainNeuralNetPage() {
  return (
    <div
      className="relative"
      style={{ paddingBottom: "56.25%", height: 0, overflow: "hidden" }}
    >
      <iframe
        src="https://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.45796&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false"
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
      ></iframe>
    </div>
  );
}
