// trainings.js

import { saveModelData } from "./api.js";
import { loadModelData } from "./api.js";

function prepareTrainingData(trainingData) {
  const images = [];
  const licensePlateLabels = [];
  const vehicleTypeLabels = [];
  const colorLabels = [];

  for (const data of trainingData) {
    images.push(data.image);
    licensePlateLabels.push(data.label.licensePlate);
    vehicleTypeLabels.push(data.label.vehicleType);
    colorLabels.push(data.label.color);
  }

  return {
    images,
    licensePlateLabels,
    vehicleTypeLabels,
    colorLabels,
  };
}

async function trainAndSaveModels(trainingData) {
  const { images, licensePlateLabels, vehicleTypeLabels, colorLabels } =
    prepareTrainingData(trainingData);

  const licensePlateModel = model();
  const vehicleTypeModel = model();
  const colorModel = model();

  await model.trainModel(licensePlateModel, images, licensePlateLabels);
  await model.trainModel(vehicleTypeModel, images, vehicleTypeLabels);
  await model.trainModel(colorModel, images, colorLabels);

  const licensePlateModelData = await model.modelToJson(licensePlateModel);
  const vehicleTypeModelData = await model.modelToJson(vehicleTypeModel);
  const colorModelData = await model.modelToJson(colorModel);

  await saveModelData("license_plate", licensePlateModelData);
  await saveModelData("vehicle_type", vehicleTypeModelData);
  await saveModelData("color", colorModelData);
}

async function initializeModels() {
  const licensePlateModelData = await loadModelData("license_plate");
  const vehicleTypeModelData = await loadModelData("vehicle_type");
  const colorModelData = await loadModelData("color");

  const licensePlateModel = model();
  const vehicleTypeModel = model();
  const colorModel = model();

  licensePlateModel.fromJSON(licensePlateModelData.modelJson);
  vehicleTypeModel.fromJSON(vehicleTypeModelData.modelJson);
  colorModel.fromJSON(colorModelData.modelJson);

  // Setzen Sie die Gewichte für jedes Modell
  for (let i = 0; i < licensePlateModelData.modelWeights.length; i++) {
    licensePlateModel.weights[i].val.assign(
      tf.tensor(licensePlateModelData.modelWeights[i])
    );
  }
  for (let i = 0; i < vehicleTypeModelData.modelWeights.length; i++) {
    vehicleTypeModel.weights[i].val.assign(
      tf.tensor(vehicleTypeModelData.modelWeights[i])
    );
  }
  for (let i = 0; i < colorModelData.modelWeights.length; i++) {
    colorModel.weights[i].val.assign(tf.tensor(colorModelData.modelWeights[i]));
  }

  return {
    licensePlateModel,
    vehicleTypeModel,
    colorModel,
  };
}

export { trainAndSaveModels, initializeModels };
