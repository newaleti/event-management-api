import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to request object
            req.user = { id: decoded.id, role: decoded.role };

            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
}