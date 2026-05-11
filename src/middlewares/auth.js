const isAdminAuthenticated = (req, res, next) => {
    console.log("Admin data is being checked")
    const token = "ajitesh"
    const isAuthenticated = token === "ajitesh"; // Replace with actual authentication logic
    if(!isAuthenticated) {
        return res.status(401).send("Unauthorized");
    }
    else{
        next();
    }
};
const isUserAuthenticated = (req, res, next) => {
    console.log("User data is being checked")
    const token = "Trishila"
    const isAuthenticated = token === "Trishila"; // Replace with actual authentication logic
    if(!isAuthenticated) {
        return res.status(401).send("Unauthorized");
    }
    else{
        next();
    }
};

module.exports = {
    adminAuth: isAdminAuthenticated,
    userAuth: isUserAuthenticated
}