const app = require('express')()
const cheerio = require('cheerio')
const axios = require('axios')

const port = process.env.PORT || 5000

const url = "https://en.wikipedia.org/wiki/List_of_brightest_stars"
const base = "https://en.wikipedia.org"

const articles = []

axios(url)
.then(res => {
    const html = res.data
    const $ = cheerio.load(html)
    $('tr','.sortable', html).each(function(){
         const rank = $(this).find('td:first-child').text().trim()
        const name = $(this).find('td:nth-child(3)').find('a').text()
        const visualMagnitude = $(this).find('td:nth-child(2)').clone().children().remove().end().text().trim()
        let distance = $(this).find('td:nth-child(5)').text().trim()
        if(isNaN(parseInt(distance))){
            distance = $(this).find('td:nth-child(6)').clone().children().remove().end().text().trim()
        }
        let spectralClass = $(this).find('td:nth-child(6)').text().trim()
        if(!isNaN(parseInt(spectralClass))){
            spectralClass = $(this).find('td:nth-child(7)').text().trim()
        }
        const link = base + $(this).find('td:nth-child(3)').find('a').attr('href')
        if(rank==='' && name==='') return
        articles.push({rank, name, visualMagnitude, distance, spectralClass, link})
    })
})
.catch(err => console.log(err))

app.get("/brightstars", (req,res) => {
    res.json(articles)
})

app.listen(port, () => console.log(`server listening on port ${port}`))