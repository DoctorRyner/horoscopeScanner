const request = require ("request")
const fs = require ("fs")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

class Horoscope {
    constructor (date, horoscopeSigns) {
        this.date = date
        this.horoscopeSigns = horoscopeSigns
    }

    toString = () => "".concat (
        "DATE: ",
        this.date,
        "\n\n",
        this.horoscopeSigns.map (sign => sign.name + "\n" + sign.prophecyContent + "\n\n").concat ()
    )

    saveTo = fileName => {
        fs.writeFile (fileName, this.toString (), err => {
            if (err) throw err

            console.log (fileName + " saved!")
        })
    }
}

class HoroscopeSignProphecy {
    constructor (name, prophecyContent) {
        this.name = name
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
    
    const todayRaw = new Date()
        , dd       = String(todayRaw.getDate()).padStart(2, '0')
        , mm       = String(todayRaw.getMonth() + 1).padStart(2, '0')
        , yyyy     = todayRaw.getFullYear()
        , today    = yyyy + '-' + mm + '-' + dd
        , horoscope = new Horoscope (today, prophecises.map (tuple => new HoroscopeSignProphecy (tuple[0], tuple[1])))

    horoscope.saveTo ("test.txt")
}

request ("https://www.stardm.com/daily-horoscopes/A1-daily-horoscopes.asp", generateHoroscope)
