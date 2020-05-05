const express = require('express')
const cors = require("cors")
const flickrApi = require('./flickrApi')

const app = express()

const PORT = 3300

let clients = []


function newConnectionHandler(req, res) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers)

    const clientId = Date.now()
    const newClient = {
        id: clientId,
        res
    }
    clients.push(newClient)

    req.on('close', () => {
        console.log(`${clientId} Connection closed in ${Date.now() - clientId} milisec`)
        clients = clients.filter(c => c.id !== clientId)
    })
}


function updateRecentPhotos() {
    flickrApi.get().then(data => {
        clients.forEach(c => c.res.write(`data: ${JSON.stringify(data)}\n\n`))
    })
}

const intervalID = setInterval(updateRecentPhotos, 10 * 1000)

function nextPageHandler(req, res) {
    flickrApi.get(req.query).then(result => res.send(result))
}

app.use(cors())

// endpoints
app.get('/stream', newConnectionHandler)
app.get('/nextPage', nextPageHandler)

// Start server
app.listen(PORT, () => console.log(`Flickr Zervice listening on port ${PORT}`))