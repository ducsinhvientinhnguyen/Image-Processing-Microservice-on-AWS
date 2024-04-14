import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {
  const image_url = req.query.image_url;
  // 1. validate the image_url query. My api should only allow image urls start with http or https.
  if (image_url == null) {
    return res.status(400).send("Please input an image_url!!!");
  }
  if (/^(http|https):\/\//i.test(image_url) === false) {
    return res
      .status(400)
      .send("Please input a image_url that starts with http or https!!!");
  }
  //  2. call filterImageFromURL(image_url) to filter the image
  const imageLocal = await filterImageFromURL(image_url.toString());
  //  3. send the resulting file in the response and call a call back function to delete the file on the server.
  return res.status(200).sendFile(imageLocal, () => {
    //  4. deletes files image on this server.
    deleteLocalFiles([imageLocal]);
  });
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
