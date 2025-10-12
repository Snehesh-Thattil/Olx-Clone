const express = require("express")
const admin = require("firebase-admin")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Decode and parse Firebase service account
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8"))

// Initialize Firebase Admin SDK
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const app = express()
app.use(express.json())

// Allow only your frontend origin(s) in production
const allowedOrigins = [
    "https://olx--clone-e389b.web.app",
    "http://localhost:3000"
]
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (e.g. mobile apps or curl)
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`
            return callback(new Error(msg), false)
        }
        return callback(null, true)
    }
}))

// Explicitly allow Authorization header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

// Rate Limiting 
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per minute
    message: { error: "Too many requests, please try again later." },
})
app.use(limiter)

// Middleware to verify Firebase ID Token
async function verifyFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Missing token" })
        }

        const idToken = authHeader.split("Bearer ")[1]

        // Verify and decode the token
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        req.user = decodedToken; // attach user info
        next()
    } catch (error) {
        console.error("Error verifying ID token:", error)
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" })
    }
}

// Health check routes
app.get("/", (req, res) => res.json({ status: "ok" }))
app.get("/health", (req, res) => res.json({ status: "healthy" }))

// Protected route for logout from all devices
app.post("/logout-all", verifyFirebaseToken, async (req, res) => {
    try {
        const uid = req.user.uid // from verified token
        await admin.auth().revokeRefreshTokens(uid)

        const userRecord = await admin.auth().getUser(uid)
        res.json({
            message: "User logged out from all devices",
            tokensValidAfter: userRecord.tokensValidAfterTime,
        })
    } catch (error) {
        console.error("Error revoking tokens:", error)
        res.status(500).json({ error: error.message })
    }
})

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))