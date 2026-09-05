const jwt = require("jsonwebtoken")
                    
function getToken(req) {
    const cookieToken = req.cookies?.token;
    if (cookieToken) {
        return cookieToken;
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return null;
}

async function authArtist(req , res , next){

const token = getToken(req);

if(!token){
    return res.status(401).json({
    message: "Unauthorized"
 })
}
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    if(!["artist", "admin"].includes(decoded.role)){
       return res.status(403).json({message: "You don't have access"})

    }
    req.user = decoded;
    next()
}
catch(err) {

    console.log(err);
    return res.status(401).json({
        message : "Unauthorized"
    })
}
}

async function authUser(req , res , next){

const token = getToken(req);

if(!token){
    return res.status(401).json({message: "Unauthorized"})
}

try{ 
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")

if(!decoded.role || !["user", "artist", "admin"].includes(decoded.role)){
    return res.status(403).json({message: "You don't have access"})
}

    req.user = decoded;

    next()

} catch(err)
{
    console.log(err);
    return res.status(401).json({message : "Unauthorized"})
}
    
}


module.exports = {authArtist,authUser};