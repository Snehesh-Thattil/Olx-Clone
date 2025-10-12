const { onCall } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const admin = require("firebase-admin")

// Limit container instances (good for cost control)
setGlobalOptions({ maxInstances: 10 })

// Initialize Firebase Admin SDK
admin.initializeApp()

// Callable Function: Called from React app using Firebase SDK
exports.logoutAllDevices = onCall(async (request) => {
    const { uid } = request.data

    // Security check: Ensure caller is authenticated and matches UID
    if (!request.auth || request.auth.uid !== uid) {
        throw new Error("Unauthorized request.")
    }

    try {
        await admin.auth().revokeRefreshTokens(uid)
        return { message: "User logged out from all devices" }
    }
    catch (error) {
        console.error("Error revoking tokens:", error)
        throw new Error(error.message)
    }
})