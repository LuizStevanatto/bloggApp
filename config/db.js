if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://neto:tico2212123@cluster0.zdpxs.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}