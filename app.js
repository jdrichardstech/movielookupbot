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

let sendMessage = (recipientId, message)=>{
	request({
		url:"https://graph.facebook.com/v2.6/messages",
		qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
		method:'POST',
		json: {
			recipient: {id: recipientId},
			message: message
		}
	}, function(error, response, body){
		if(error){
			console.log("Error sending message " + response.error)
		}
	})
}

let processPostback = (event)=>{
	let senderId = event.sender.id
	let payload = event.postback.payload

	if(payload==='Greeting'){
		request({
			url:"https://graph.facebook.com/v2.6/" + senderId,
			qs: {
				access_token: process.env.PAGE_ACCESS_TOKEN,
				fields: 'first_name'
			},
			method: "GET"
		},function(error, response, body){
			let greeting = ""
			if(error){
				console.log("Error getting user\'s name"+ error)
			}else{
				let bodyObj = JSON.parse(body)
				name = bodyObj.first_name
				gretting = "Hi " + name + ". "
			}
			let message = greeting + "My name is Movie Lookup Bot. I can tell you various things about films. Which film would you like to know about?"
			sendMessage(senderId, {text: message})
		})
	}
}

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

app.post('/webhook',(req, res) => {
	if(req.body.object=='page'){
		req.body.entry.forEach((entry)=>{
			entry.messaging.forEach((event)=>{
				if(event.postback){
					processPostback(event)
				}
		})
	})
}
	res.status(200)
})
