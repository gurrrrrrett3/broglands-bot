 import express from "express"
 import http from "http"
 import https from "https"
 import authRouter from "./auth/auth"
 import ews from "express-ws"
 import fs from "fs"
 import path from "path" 

const key = fs.readFileSync(path.resolve("./selfsigned.key"))
const cert = fs.readFileSync(path.resolve("./selfsigned.crt"))

const creds = {key, cert}

 export default class Web {

    public app = express()
    public httpServer: http.Server
    public httpsServer: https.Server

    constructor() {
        ews(this.app)
        //Register routers
        this.app.use("/auth", authRouter)

        //Static
        this.app.use("/assets", express.static(path.resolve("./modules/web/public/")))

        this.httpServer = http.createServer(this.app)
        this.httpsServer = https.createServer(creds, this.app)

        this.httpServer.listen(80)
        this.httpsServer.listen(443)
    }
 }