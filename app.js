const exp = require('constants')
const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log("Server is started at port " + port);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {

    let id = req.body.pokemon;

    let url = `https://pokeapi.co/api/v2/pokemon/${id}`

    //To get the image with right id
    if (id < 10 && id > 0)
        id = `00${id}`
    else if (id > 10 && id < 100)
        id = `0${id}`

    let pokeImg = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;

    console.log(url)

    https.get(url, (response) => {

        let responseData = "";

        response.on('data', (dataChunk) => {
            responseData += dataChunk;
        })

        response.on('end', () => {
            let pokeInfo = JSON.parse(responseData);
            let pokemonName = pokeInfo.name;
            let pokeType = pokeInfo.types[0].type.name
            let baseExp = pokeInfo.base_experience;

            res.write('<h1>Name of the pokemon you searched is ' + pokemonName + "</h1>");
            res.write(`<img src = "${pokeImg}"`);
            res.write(`<h3>The main type of the pokemon: ${pokeType} </h3>`)
            res.write(`<h3>Base Exp: ${baseExp} </h3>`)


            res.send();
        })
    })


})