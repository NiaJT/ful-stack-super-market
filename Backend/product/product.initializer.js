import productTable from "./product.model.js";
const textInitializer = async () => {
  // Ensure the text index is created for the 'name' field
  try {
    await productTable.collection.createIndex({ name: "text" });
  } catch (error) {
    console.error("Error initializing text index:", error);
  }
};
export default textInitializer;
