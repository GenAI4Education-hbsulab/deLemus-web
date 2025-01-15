export default function GPT3Page() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-8">
          How GPT3 Works - Visualizations and Animations
        </h1>

        {/* Content Section */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            The tech world is abuzz with GPT3 hype. Massive language models
            (like GPT3) are starting to surprise us with their abilities. While
            not yet completely reliable for most businesses to put in front of
            their customers, these models are showing sparks of cleverness that
            are sure to accelerate the march of automation and the possibilities
            of intelligent computer systems. Let’s remove the aura of mystery
            around GPT3 and learn how it’s trained and how it works.
          </p>

          <p className="text-lg">
            A trained language model generates text. We can optionally pass it
            some text as input, which influences its output.
          </p>

          <p className="text-lg">
            The output is generated from what the model “learned” during its
            training period where it scanned vast amounts of text.
          </p>

          {/* Image Section */}
          <div className="my-6">
            <img
              src="/images/gpt3/01-gpt3-language-model-overview.gif"
              alt="GPT3 Language Model Overview"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            Training is the process of exposing the model to lots of text. That
            process has been completed. All the experiments you see now are from
            that one trained model. It was estimated to cost 355 GPU years and
            cost $4.6m.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/02-gpt3-training-language-model.gif"
              alt="GPT3 Training Language Model"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            The dataset of 300 billion tokens of text is used to generate
            training examples for the model. For example, these are three
            training examples generated from the one sentence at the top.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/gpt3-training-examples-sliding-window.png"
              alt="GPT3 Training Examples Sliding Window"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            The model is presented with an example. We only show it the features
            and ask it to predict the next word.
          </p>

          <p className="text-lg font-semibold text-gray-800">
            Repeat millions of times
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/03-gpt3-training-step-back-prop.gif"
              alt="GPT3 Training Step Backpropagation"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            Now let’s look at these same steps with a bit more detail.
          </p>

          <p className="text-lg">
            GPT3 actually generates output one token at a time (let’s assume a
            token is a word for now).
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/04-gpt3-generate-tokens-output.gif"
              alt="GPT3 Generate Tokens Output"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            Please note: This is a description of how GPT-3 works and not a
            discussion of what is novel about it (which is mainly the
            ridiculously large scale). The architecture is a transformer decoder
            model based on this paper{" "}
            <a
              href="https://arxiv.org/pdf/1801.10198.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://arxiv.org/pdf/1801.10198.pdf
            </a>
            .
          </p>

          <p className="text-lg">
            GPT3 is MASSIVE. It encodes what it learns from training in 175
            billion numbers (called parameters). These numbers are used to
            calculate which token to generate at each run.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/gpt3-parameters-weights.png"
              alt="GPT3 Parameters Weights"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            These numbers are part of hundreds of matrices inside the model.
            Prediction is mostly a lot of matrix multiplication.
          </p>

          <p className="text-lg">
            In my{" "}
            <a
              href="https://youtube.com/watch?v=mSTCzNgDJy4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Intro to AI on YouTube
            </a>
            , I showed a simple ML model with one parameter. A good start to
            unpack this 175B monstrosity.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/05-gpt3-generate-output-context-window.gif"
              alt="GPT3 Generate Output Context Window"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg font-semibold text-gray-800">
            High-level steps:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Convert the word to{" "}
              <a
                href="https://jalammar.github.io/illustrated-word2vec/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                a vector (list of numbers) representing the word
              </a>
            </li>
            <li>Compute prediction</li>
            <li>Convert resulting vector to word</li>
          </ol>

          <div className="my-6">
            <img
              src="/images/gpt3/06-gpt3-embedding.gif"
              alt="GPT3 Embedding"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            The important calculations of the GPT3 occur inside its stack of 96
            transformer decoder layers.
          </p>

          <p className="text-lg">
            See all these layers? This is the “depth” in “deep learning”.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/07-gpt3-processing-transformer-blocks.gif"
              alt="GPT3 Processing Transformer Blocks"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            You can see a detailed explanation of everything inside the decoder
            in my blog post{" "}
            <a
              href="https://jalammar.github.io/illustrated-gpt2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              The Illustrated GPT2
            </a>
            .
          </p>

          <p className="text-lg">
            The difference with GPT3 is the alternating dense and{" "}
            <a
              href="https://arxiv.org/pdf/1904.10509.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              sparse self-attention layers
            </a>
            .
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/08-gpt3-tokens-transformer-blocks.gif"
              alt="GPT3 Tokens Transformer Blocks"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            My assumption is that the priming examples and the description are
            appended as input, with specific tokens separating examples and the
            results. Then fed into the model.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/09-gpt3-generating-react-code-example.gif"
              alt="GPT3 Generating React Code Example"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          <p className="text-lg">
            Fine-tuning actually updates the model’s weights to make the model
            better at a certain task.
          </p>

          <div className="my-6">
            <img
              src="/images/gpt3/10-gpt3-fine-tuning.gif"
              alt="GPT3 Fine Tuning"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
