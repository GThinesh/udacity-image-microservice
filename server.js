import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';


// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get('/filteredimage', async (req, res) => {
    const imageUrl = req.query.image_url;
    if (imageUrl) {
        console.log('Loading image ' + imageUrl);
        try {
            const image = await filterImageFromURL(imageUrl);
            res.sendFile(image, err => {
                if (err) {
                    res.sendStatus(500);
                }
                console.log("Image send successfully");
            });
            res.on('finish',()=>{
              deleteLocalFiles([image]);
              console.log("Deleted image file " + image)
            })
        } catch (err) {
            console.log("Error loading image");
            res.status(422).send("Error occurred while reading image. Make sure the passed image is valid");
        }
    } else {
        console.error("No image url is passed");
        res.status(400).send("image_url should be a valid url");
    }
})


/**************************************************************************** */

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
