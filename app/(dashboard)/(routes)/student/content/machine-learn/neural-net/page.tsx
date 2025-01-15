export default function NeuralPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Section */}
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Simple Definition Of A Neural Network
        </h1>

        {/* Content Section */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            Modeled in accordance with the human brain, a Neural Network was
            built to mimic the functionality of a human brain. The human brain
            is a neural network made up of multiple neurons, similarly, an
            Artificial Neural Network (ANN) is made up of multiple perceptrons
            (explained later).
          </p>
          <div className="my-4">
            <img
              src="/images/neural-net/1.png"
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-lg">
            A neural network consists of three important layers:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <b>Input Layer</b> As the name suggests, this layer accepts all
              the inputs provided by the programmer.
            </li>
            <li>
              <b>Hidden Layer</b> Between the input and the output layer is a
              set of layers known as Hidden layers. In this layer, computations
              are performed which result in the output.
            </li>
            <li>
              <b>Output Layer</b> The inputs go through a series of
              transformations via the hidden layer which finally results in the
              output that is delivered via this layer.
            </li>
          </ul>
          <p className="text-lg">
            Before we get into the depths of how a Neural Network functions,
            let’s understand what Deep Learning is.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            What Is Deep Learning?
          </h2>
          <p className="text-lg">
            Deep Learning is an advanced field of Machine Learning that uses the
            concepts of Neural Networks to solve highly-computational use cases
            that involve the analysis of multi-dimensional data. It automates
            the process of feature extraction, making sure that very minimal
            human intervention is needed.
          </p>
          <p className="text-lg">So what exactly is Deep Learning?</p>
          <p className="text-lg">
            Deep Learning is an advanced sub-field of Machine Learning that uses
            algorithms inspired by the structure and function of the brain
            called Artificial Neural Networks.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            Difference Between AI, ML, and DL (Artificial Intelligence vs
            Machine Learning vs Deep Learning)
          </h2>
          <p className="text-lg">
            People often tend to think that Artificial Intelligence, Machine
            Learning, and Deep Learning are the same since they have common
            applications. For example, Siri is an application of AI, Machine
            learning and Deep learning.
          </p>
          <div className="my-4">
            <img
              src="/images/neural-net/2.png"
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-lg">So how are these technologies related?</p>
          <ul className="list-disc pl-6">
            <li>
              Artificial Intelligence is the science of getting machines to
              mimic the behavior of humans.
            </li>
            <li>
              Machine learning is a subset of Artificial Intelligence (AI) that
              focuses on getting machines to make decisions by feeding them
              data.
            </li>
            <li>
              Deep learning is a subset of Machine Learning that uses the
              concept of neural networks to solve complex problems.
            </li>
          </ul>
          <p className="text-lg">
            To sum it up AI, Machine Learning and Deep Learning are
            interconnected fields. Machine Learning and Deep learning aids
            Artificial Intelligence by providing a set of algorithms and neural
            networks to solve data-driven problems.
          </p>
          <p className="text-lg">
            Now that you’re familiar with the basics, let’s understand what led
            to the need for Deep Learning.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            Need For Deep Learning: Limitations Of Traditional Machine Learning
            Algorithms and Techniques
          </h2>
          <p className="text-lg">
            Machine Learning was a major breakthrough in the technical world, it
            led to the automation of monotonous and time-consuming tasks, it
            helped in solving complex problems and making smarter decisions.
            However, there were a few drawbacks in Machine learning that led to
            the emergence of Deep Learning.
          </p>
          <div className="my-4">
            <img
              src="/images/neural-net/3.png"
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-lg">
            Here are some limitations of Machine Learning:
          </p>
          <ul className="list-disc pl-6">
            <li>
              Unable to process high dimensional data: Machine Learning can
              process only small dimensions of data that contain a small set of
              variables. If you want to analyze data containing 100s of
              variables, then Machine Learning cannot be used.
            </li>
            <li>
              Feature engineering is manual: Consider a use case where you have
              100 predictor variables and you need to narrow down only the
              significant ones. To do this you have to manually study the
              relationship between each of the variables and figure out which
              ones are important in predicting the output. This task is
              extremely tedious and time-consuming for a developer.
            </li>
            <li>
              Not ideal for performing object detection and image processing:
              Since object detection requires high-dimensional data, Machine
              Learning cannot be used to process image data sets, it is only
              ideal for data sets with a restricted number of features.
            </li>
          </ul>
          <p className="text-lg">
            Before we get into the depths of Neural Networks, let’s consider a
            real-world use case where Deep Learning is implemented.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            Deep Learning Use Case/ Applications
          </h2>
          <p className="text-lg">
            Did you know that PayPal processes over $235 billion in payments
            from four billion transactions by its more than 170 million
            customers? It uses this vast amount of data to identify possible
            fraudulent activities among other reasons.
          </p>
          <p className="text-lg">
            With the help of Deep Learning algorithms, PayPal mined data from
            their customer’s purchasing history in addition to reviewing
            patterns of likely fraud stored in its databases to predict whether
            a particular transaction is fraudulent or not.
          </p>
          <div className="my-4">
            <img
              src="/images/neural-net/4.png"
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-lg">
            The company has been relying on Deep Learning & Machine Learning
            technology for around 10 years. Initially, the fraud monitoring team
            used simple, linear models. But over the years the company switched
            to a more advanced Machine Learning technology called, Deep
            Learning.
          </p>
          <p className="text-lg">
            Fraud risk manager and Data Scientist at PayPal, Ke Wang, quoted:
          </p>
          <p className="text-lg">
            “What we enjoy from more modern, advanced machine learning is its
            ability to consume a lot more data, handle layers and layers of
            abstraction and be able to ‘see’ things that a simpler technology
            would not be able to see, even human beings might not be able to
            see.”
          </p>
          <p className="text-lg">
            A simple linear model is capable of consuming around 20 variables.
            However, with Deep Learning technology one can run thousands of data
            points. Therefore, by implementing Deep Learning technology, PayPal
            can finally analyze millions of transactions to identify any
            fraudulent activity.
          </p>
          <p className="text-lg">
            Now let’s go into the depths of a Neural Network and understand how
            they work.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            How Does A Neural Network Work?
          </h2>
          <p className="text-lg">
            To understand neural networks, we need to break it down and
            understand the most basic unit of a Neural Network, i.e. a
            Perceptron.
          </p>
          <h2 className="text-xl font-bold text-gray-800">
            What Is A Perceptron?
          </h2>
          <p className="text-lg">
            A Perceptron is a single layer neural network that is used to
            classify linear data. It has 4 important components:
          </p>
          1. Inputs 2. Weights and Bias 3. Summation Function 4. Activation or
          transformation Function
          <div className="my-4">
            <img
              src="/images/neural-net/5.png"
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-lg">
            The basic logic behind a Perceptron is as follows:
          </p>
          <p className="text-lg">
            The inputs (x) received from the input layer are multiplied with
            their assigned weights w. The multiplied values are then added to
            form the Weighted Sum. The weighted sum of the inputs and their
            respective weights are then applied to a relevant Activation
            Function. The activation function maps the input to the respective
            output.
          </p>
          <h2 className="text-xl font-bold text-gray-800">
            Weights and Bias In Deep Learning
          </h2>
          <p className="text-lg">
            Why do we have to assign weights to each input?
          </p>
          <p className="text-lg">
            Once an input variable is fed to the network, a randomly chosen
            value is assigned as the weight of that input. The weight of each
            input data point indicates how important that input is in predicting
            the outcome.
          </p>
          <p className="text-lg">
            The bias parameter, on the other hand, allows you to adjust the
            activation function curve in such a way that a precise output is
            achieved.
          </p>
          <h2 className="text-xl font-bold text-gray-800">
            Summation Function
          </h2>
          <p className="text-lg">
            Once the inputs are assigned some weight, the product of the
            respective input and weight is taken. Adding all these products
            gives us the Weighted Sum. This is done by the summation function.
          </p>
          <h2 className="text-xl font-bold text-gray-800">
            Activation Function
          </h2>
          <p className="text-lg">
            The main aim of the activation functions is to map the weighted sum
            to the output. Activation functions such as tanh, ReLU, sigmoid and
            so on are examples of transformation functions.
          </p>
          <p className="text-lg">
            To learn more about the functions of Perceptrons, you can go through
            this Deep Learning: Perceptron Learning Algorithm blog.
          </p>
          <p className="text-lg">
            Before we wrap up this blog, let’s take a simple example to
            understand how a Neural Network operates.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            Neural Networks Explained With An Example
          </h2>
          <p className="text-lg">
            Consider a scenario where you are to build an Artificial Neural
            Network (ANN) that classifies images into two classes:
          </p>
          <ul className="list-disc pl-6">
            <li>Class A: Containing images of non-diseased leaves</li>
            <li>Class B: Containing images of diseased leaves</li>
          </ul>
          <p className="text-lg">
            So how do you create a Neural network that classifies the leaves
            into diseased and non-diseased crops?
          </p>
          <p className="text-lg">
            The process always begins with processing and transforming the input
            in such a way that it can be easily processed. In our case, each
            leaf image will be broken down into pixels depending on the
            dimension of the image.
          </p>
          <p className="text-lg">
            For example, if the image is composed of 30 by 30 pixels, then the
            total number of pixels will be 900. These pixels are represented as
            matrices, which are then fed into the input layer of the Neural
            Network.
          </p>
          <div className="my-4">
            <img
              src="/images/neural-net/6.png"
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-lg">
            Just like how our brains have neurons that help in building and
            connecting thoughts, an ANN has perceptrons that accept inputs and
            process them by passing them on from the input layer to the hidden
            and finally the output layer.
          </p>
          <p className="text-lg">
            As the input is passed from the input layer to the hidden layer, an
            initial random weight is assigned to each input. The inputs are then
            multiplied with their corresponding weights and their sum is sent as
            input to the next hidden layer.
          </p>
          <p className="text-lg">
            Here, a numerical value called bias is assigned to each perceptron,
            which is associated with the weightage of each input. Further, each
            perceptron is passed through activation or a transformation function
            that determines whether a particular perceptron gets activated or
            not.
          </p>
          <p className="text-lg">
            An activated perceptron is used to transmit data to the next layer.
            In this manner, the data is propagated (Forward propagation) through
            the neural network until the perceptrons reach the output layer.
          </p>
          <p className="text-lg">
            At the output layer, a probability is derived which decides whether
            the data belongs to class A or class B.
          </p>
          <p className="text-lg">
            Sounds simple, doesn’t it? Well, the concept behind Neural Networks
            is purely based on the functioning of the human brain. You require
            in-depth knowledge of various mathematical concepts and algorithms.
          </p>
        </div>
      </div>
    </div>
  );
}
