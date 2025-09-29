// const Clariafai = require("clarifai");
//
//
// const app = new Clariafai.App({
//     apiKey: 'ec975b6eb117472d9f3ff17e3303329f'
// });
require('dotenv').config();
const PAT = process.env.API_PAT;
const USER_ID = process.env.API_USER_ID;
const APP_ID = process.env.API_APP_ID;

const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const handleApiCall = async (req, res) => {
    console.log("Calling Clarifai API");
    // const response = app.models
    //     .predict(Clarifai.FACE_DETECT_MODEL,
    //         req.body.input)
    const response = await callClarifaiApi(req.body.input);
    console.log("clarifai response: " + JSON.stringify(response, null, 2));
    res.json(response);
}

const handleImage = (req, res, db) => {
    const id = req.body.input;
    console.log("Id: " +  id);
    if (!id) {
        console.log("No id provided in request body");
        return res.status(400).json('No id provided');
    }
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .from('users')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(
            err => {
                console.log("Error updating entries", err);
                res.status(400).json('unable to get entries')
            });
}

const callClarifaiApi = async (imageUrl) => {
    const clarifyAPI = `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`
    console.log(clarifyAPI);
    const response = await fetch(
        clarifyAPI,
        returnClarifaiRequestOptions(imageUrl)
    );
    return response.json();
}
const returnClarifaiRequestOptions = (imageUrl) => {
    console.log(PAT);
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl
                    }
                }
            }
        ]
    });

    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
}
module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}