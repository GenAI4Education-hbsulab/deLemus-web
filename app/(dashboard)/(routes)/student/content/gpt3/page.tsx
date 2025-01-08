export default function GPT3Page() {
  return (
    <div>
      <h1 style={{ fontWeight: 700 }}>
        How GPT3 Works - Visualizations and Animations
      </h1>

      <br />

      <div className="entry prediction">
        <p>
          The tech world is abuzz with GPT3 hype. Massive language models (like
          GPT3) are starting to surprise us with their abilities. While not yet
          completely reliable for most businesses to put in front of their
          customers, these models are showing sparks of cleverness that are sure
          to accelerate the march of automation and the possibilities of
          intelligent computer systems. Let’s remove the aura of mystery around
          GPT3 and learn how it’s trained and how it works.
        </p>

        <br />

        <p>A trained language model generates text.</p>

        <br />

        <p>
          We can optionally pass it some text as input, which influences its
          output.
        </p>

        <br />

        <p>
          The output is generated from what the model “learned” during its
          training period where it scanned vast amounts of text.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/01-gpt3-language-model-overview.gif" />
          <br />
        </div>

        <p>
          Training is the process of exposing the model to lots of text. That
          process has been completed. All the experiments you see now are from
          that one trained model. It was estimated to cost 355 GPU years and
          cost $4.6m.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/02-gpt3-training-language-model.gif" />
          <br />
        </div>

        <p>
          The dataset of 300 billion tokens of text is used to generate training
          examples for the model. For example, these are three training examples
          generated from the one sentence at the top.
        </p>

        <br />

        <p>
          You can see how you can slide a window across all the text and make
          lots of examples.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/gpt3-training-examples-sliding-window.png" />
          <br />
        </div>

        <p>
          The model is presented with an example. We only show it the features
          and ask it to predict the next word.
        </p>

        <br />

        <p>
          The model’s prediction will be wrong. We calculate the error in its
          prediction and update the model so next time it makes a better
          prediction.
        </p>

        <br />

        <p>Repeat millions of times</p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/03-gpt3-training-step-back-prop.gif" />
          <br />
        </div>

        <p>Now let’s look at these same steps with a bit more detail.</p>

        <br />

        <p>
          GPT3 actually generates output one token at a time (let’s assume a
          token is a word for now).
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/04-gpt3-generate-tokens-output.gif" />
          <br />
        </div>

        <p>
          Please note: This is a description of how GPT-3 works and not a
          discussion of what is novel about it (which is mainly the ridiculously
          large scale). The architecture is a transformer decoder model based on
          this paper https://arxiv.org/pdf/1801.10198.pdf
        </p>

        <br />

        <p>
          GPT3 is MASSIVE. It encodes what it learns from training in 175
          billion numbers (called parameters). These numbers are used to
          calculate which token to generate at each run.
        </p>

        <br />

        <p>
          The untrained model starts with random parameters. Training finds
          values that lead to better predictions.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/gpt3-parameters-weights.png" />
          <br />
        </div>

        <p>
          These numbers are part of hundreds of matrices inside the model.
          Prediction is mostly a lot of matrix multiplication.
        </p>

        <br />

        <p>
          In my{" "}
          <a href="https://youtube.com/watch?v=mSTCzNgDJy4">
            Intro to AI on YouTube
          </a>
          , I showed a simple ML model with one parameter. A good start to
          unpack this 175B monstrosity.
        </p>

        <br />

        <p>
          To shed light on how these parameters are distributed and used, we’ll
          need to open the model and look inside.
        </p>

        <br />

        <p>
          GPT3 is 2048 tokens wide. That is its “context window”. That means it
          has 2048 tracks along which tokens are processed.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/05-gpt3-generate-output-context-window.gif" />
          <br />
        </div>

        <p>
          Let’s follow the purple track. How does a system process the word
          “robotics” and produce “A”?
        </p>

        <br />

        <p>High-level steps:</p>

        <br />

        <ol>
          <li>
            Convert the word to{" "}
            <a href="https://jalammar.github.io/illustrated-word2vec/">
              a vector (list of numbers) representing the word
            </a>
          </li>
          <li>Compute prediction</li>
          <li>Convert resulting vector to word</li>
        </ol>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/06-gpt3-embedding.gif" />
          <br />
        </div>

        <p>
          The important calculations of the GPT3 occur inside its stack of 96
          transformer decoder layers.
        </p>

        <br />

        <p>See all these layers? This is the “depth” in “deep learning”.</p>

        <br />

        <p>
          Each of these layers has its own 1.8B parameter to make its
          calculations. That is where the “magic” happens. This is a high-level
          view of that process:
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/07-gpt3-processing-transformer-blocks.gif" />
          <br />
        </div>

        <p>
          You can see a detailed explanation of everything inside the decoder in
          my blog post{" "}
          <a href="https://jalammar.github.io/illustrated-gpt2/">
            The Illustrated GPT2
          </a>
          .
        </p>

        <br />

        <p>
          The difference with GPT3 is the alternating dense and{" "}
          <a href="https://arxiv.org/pdf/1904.10509.pdf">
            sparse self-attention layers
          </a>
          .
        </p>

        <br />

        <p>
          This is an X-ray of an input and response (“Okay human”) within GPT3.
          Notice how every token flows through the entire layer stack. We don’t
          care about the output of the first words. When the input is done, we
          start caring about the output. We feed every word back into the model.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/08-gpt3-tokens-transformer-blocks.gif" />
          <br />
        </div>

        <p>
          In the{" "}
          <a href="https://twitter.com/sharifshameem/status/1284421499915403264">
            React code generation example
          </a>
          , the description would be the input prompt (in green), in addition to
          a couple of examples of description=&gt;code, I believe. And the react
          code would be generated like the pink tokens here token after token.
        </p>

        <br />

        <p>
          My assumption is that the priming examples and the description are
          appended as input, with specific tokens separating examples and the
          results. Then fed into the model.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/09-gpt3-generating-react-code-example.gif" />
          <br />
        </div>

        <p>
          It’s impressive that this works like this. Because you just wait until
          fine-tuning is rolled out for the GPT3. The possibilities will be even
          more amazing.
        </p>

        <br />

        <p>
          Fine-tuning actually updates the model’s weights to make the model
          better at a certain task.
        </p>

        <br />

        <div className="img-div-any-width">
          <img src="/images/gpt3/10-gpt3-fine-tuning.gif" />
          <br />
        </div>
      </div>
    </div>
  );
}
