const request = require ("request")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

class Horoscope {
    constructor (date, horoscopeSigns) {
        this.date = date
        this.horoscopeSigns = horoscopeSigns
    }
}

class HoroscopeSignProphecy {
    constructor (signName, prophecyContent) {
        this.signName = signName
        this.prophecyContent = prophecyContent
    }
}

const chunksOf = array => size => {
    if (!array) return []

    const firstChunk = array.slice(0, size)

    return !firstChunk.length
        ? array
        : [firstChunk].concat (chunksOf (array.slice(size, array.length)) (size)) 
}

const generateHoroscope = (_error, _response, body) => {
    const doc = new JSDOM (body).window.document
        , removeElementsWithUndefinedTag = xs => xs.filter (el => el.tagName !== undefined)
        , rawProphecyArray = Array.from (doc.querySelector (".entry").childNodes)
        , xs = removeElementsWithUndefinedTag (rawProphecyArray).slice (3). slice (0, -1).map (el => el.innerHTML)
        , prophecises = chunksOf (xs) (2)
    
    console.log ("START++++++++++++++++++++++++++++++++")

    const todayRaw = new Date()
        , dd       = String(todayRaw.getDate()).padStart(2, '0')
        , mm       = String(todayRaw.getMonth() + 1).padStart(2, '0')
        , yyyy     = todayRaw.getFullYear()
        , today    = yyyy + '-' + mm + '-' + dd

    const horoscope = new Horoscope (today, prophecises.map (tuple => new HoroscopeSignProphecy (tuple[0], tuple[1])))

    console.log (horoscope)
}

request ("https://www.stardm.com/daily-horoscopes/A1-daily-horoscopes.asp", generateHoroscope)
