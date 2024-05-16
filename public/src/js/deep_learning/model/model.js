// model.js

const model = tf.sequential();

// Convolutional layer 1
model.add(
  tf.layers.conv2d({
    inputShape: [224, 224, 3], // Input shape: 224x224 pixel with RGB color
    filters: 32,
    kernelSize: 3,
    strides: 1,
    activation: "relu",
    padding: "same",
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

// Convolutional layer 2
model.add(
  tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    strides: 1,
    activation: "relu",
    padding: "same",
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

// Convolutional layer 3
model.add(
  tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    strides: 1,
    activation: "relu",
    padding: "same",
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

// Flatten and Dense layers
model.add(tf.layers.flatten());
model.add(tf.layers.dense({ units: 256, activation: "relu" }));
model.add(tf.layers.dropout({ rate: 0.5 }));

// Output layer
const numOfClasses = 3; // Adjust this according to the number of classes you have (license plate text, vehicle type, and color)
model.add(tf.layers.dense({ units: numOfClasses, activation: "softmax" }));

// Compile the model
model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

let trainingData = [];

function trainModel(imageData, licensePlate, vehicleType, color) {
  // Process the image and user input values for training
  trainingData.push({
    image: imageData,
    label: {
      licensePlate,
      vehicleType,
      color,
    },
  });

  // Train the model using the training data
  trainAndSaveModels(trainingData);
}
