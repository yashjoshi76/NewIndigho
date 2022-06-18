const express = require('express')

const app = express()

app.get('/', (req, res) => {
//req contains info about whats coming with the request
//req.params contains info about params
//req.query for query strings
//query params always come back as strings

    const data = {
        name: "spotify-app",
        isCool: true

    }
    res.json(data)
    //res.json to return a json
    //res.file to return a file
})

// app.get('/cool', (req,res) => {
//     const {name, isCool} = req.query
//     res.send(`${name} is ${JSON.parse(isCool) ? 'really' : 'not'} awesome`)
// })


//app.method(path, handler)
//method is an http method, handler is a callback function
//req and res as arguments

const port = 8888;
app.listen(port, () => {
    console.log('Listening')
})