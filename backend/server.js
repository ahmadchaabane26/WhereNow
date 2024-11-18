const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies


app.listen(5000, () => {
    console.log("Server running on 5000");
});