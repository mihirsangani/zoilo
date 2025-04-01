const createError = require("http-errors")
const cors = require("cors")
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const database = require("./connection/index")
const indexRouter = require("./routes/index")
const dotenv = require("dotenv").config()
require('./cronjobs/checkPaymentValidity')

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.json({ limit: "300mb" }))
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }))

// Array Of Cors (Domains)
app.use(
    cors({
        origin: process.env.CORS_DOMAIN.split(","),
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
        credentials: true
    })
)

app.use("/static", express.static(path.join(__dirname, "public")))
app.use("/", express.static(path.join(__dirname, "public")))

// Trust Proxy IP Address
app.set("trust proxy", true)

app.use("/", indexRouter)

app.listen(4000, function () {
    console.log("Server running on 4000")
})

module.exports = app
