// const express=require('express')
import express from "express"
import cors from "cors"
import { MongoClient, ServerApiVersion } from "mongodb"
import "dotenv/config"
import { ObjectId } from "mongodb"
// import("dotenv").config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASSWORD}@cluster0.eluxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

async function run() {
	try {
		await client.connect()
		// insert one and collection one
		const userCollocation = client.db("userCollection").collection("users")
		//insert many and collection 2
		const usersCollocation = client.db("usersCollection").collection("users2")
		const option = { ordered: true }
		//insert many
		const result2 = await usersCollocation.insertMany(users, option)

		// send user data

		app.post("/user", async (req, res) => {
			const newUser = req.body
			const Newresult = await userCollocation.insertOne(newUser)
			res.send(newUser)
		})
		//GET DATA FROM DB
		app.get("/user", async (req, res, next) => {
			const query = {}
			const cursor = userCollocation.find(query)
			const loadData = await cursor.toArray()
			res.send(loadData)
		})

		//DELETE USER
		app.delete("/user/:id", async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const deleteUser = await userCollocation.deleteOne(query)
			res.send(deleteUser)
		})
	} finally {
		// await client.close()
	}
}
run().catch(console.dir)

app.get("/", (req, res) => {
	res.send("<h1>hello world</h1>")
})

app.get("/about", (req, res) => {
	res.send("<h1>This is about page</h1>")
})
app.get("/users", (req, res) => {
	console.log(req.query)
	if (req.query.name) {
		//  find user with query string
		const nameSearch = req.query.name.toLowerCase()

		const matched = users.filter((user) => user.name.includes(nameSearch))
		res.send(matched)
	} else {
		res.send(users)
	}
})
// find user with dynamic url id
app.get("/users/:id", (req, res) => {
	const params_id = Number(req.params.id)
	const user = users.find((user) => user.id === params_id)
	user ? res.send(user) : res.send("user not found!!")
	console.log(user)
	// res.send(user.name)
})

//user= dbuser
// pass=6sIGalVoCq7JlYZg
//send data to database
app.post("/users", (req, res) => {
	const user = req.body

	user.id = users.length + 1
	users.push(user)

	res.send(user)
})
app.post("/userInfo", (req, res) => {
	const userInfo = req.body
	userInfo.id = users.length + 1
	users.push(userInfo)
	res.send(users)
})

app.get("/userInfo", (req, res) => {
	const user2 = req.body
	console.log(user2)
	res.send(user2)
})
app.listen(port, () => {
	console.log("server is running on port", port)
})
