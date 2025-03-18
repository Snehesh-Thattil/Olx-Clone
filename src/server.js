const express = require("express")
const admin = require("firebase-admin")
const cors = require("cors")
const fs = require("fs")
require("dotenv").config()

// Read service account JSON securely
const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8")
)

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const app = express()
app.use(cors())
app.use(express.json())

// Logout from all devices
app.post("/logout-all", async (req, res) => {
    const { uid } = req.body
    if (!uid) return res.status(400).json({ error: "User ID is required" })

    try {
        await admin.auth().revokeRefreshTokens(uid)
        res.json({ message: "User logged out from all devices" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))