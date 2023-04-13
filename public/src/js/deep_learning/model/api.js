// api.js

async function saveModelData(collectionName, modelData) {
  try {
    const response = await fetch("/apiv3/save-model-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionName,
        modelData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save model data: ${response.statusText}`);
    }

    console.log(`Model data saved in collection: ${collectionName}`);
  } catch (error) {
    console.error(error);
  }
}

async function loadModelData(collectionName) {
  try {
    const response = await fetch(
      `/apiv3/load-model-data?collectionName=${collectionName}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load model data: ${response.statusText}`);
    }

    const modelData = await response.json();
    return modelData;
  } catch (error) {
    console.error(error);
  }
}

export { saveModelData, loadModelData };
