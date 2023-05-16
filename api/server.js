require('dotenv').config()
const express = require('express');
const app = express()
const port = process.env.PORT

const cors = require('cors')
app.use(cors({ origin: "*", credentials: true }))
app.use(express.json())

// routes
app.use("/api/auth", require('./routes/authRoutes'))
app.use("/api", require('./routes/indexRoute'))

// 404 hundle
app.all('*', (req, res) => {
    return res.status(404).json({ err: "404 not found" })
})
app.listen(port, () => {
    console.log(`server marche http://localhost:${port}`)
})