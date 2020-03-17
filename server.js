const express = require('express');
const path = require('path');
//node does not support fetch by default
const fetch = require("node-fetch");
const app = express();

//load cors - for requests from FE to get search token for example
const cors = require('cors');

//serve static files from build
app.use(express.static(path.join(__dirname, 'build')));

//load env variables from .env file if not production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const whitelist = ['http://localhost:3000']

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin)  !== -1 || !origin || origin !== 'http://localhost:3000' ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

// Get token from Coveo
// View Search Token Authentication
// https://docs.coveo.com/en/56/cloud-v2-developers/search-token-authentication
async function getCoveoToken() {
    const postData = {
        userIds:  [{
           name: 'student@coveo.com', provider: "Email Security Provider" 
        }],
        searchHub: "studyHub",
        filter: "@uri"
      };
    const apiKey = process.env.COVEOAPIKEY;
	const getToken = await fetch("https://platform.cloud.coveo.com/rest/search/v2/token",
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(postData),
    });
    const coveoResponse = await getToken.json();
    coveoResponse.orgId = process.env.COVEOORGID;
    return coveoResponse;
	
}


app.get('/getToken', async function (req, res) {
    const token = await getCoveoToken()
    return res.status(200).json(token);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);