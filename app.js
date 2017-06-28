const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.listen((process.env.PORT || 3000))

app.get('/', (req, res)=>{
	res.send("Deployed")
})

app.get('/webhook', (req, res)=>{
	if(req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token']===process.env.VERIFICATION_TOKEN){
		console.log('Verified Webhook')
		res.status(200).send(req.query['hub.challenge'])
	}else{
		console.log("Verification failed. Tokens do not match")
		res.sendStatus(403)
	}
})
