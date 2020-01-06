const request = require ("request")
const fs = require ("fs")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const ramda = require ("ramda")
const R = ramda

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

const generateHoroscope = (_error, _response, body) => {
    const doc = new JSDOM (body).window.document
        , removeElementsWithUndefinedTag = xs => xs.filter (el => el.tagName !== undefined)
        , rawProphecyArray = Array.from (doc.querySelector (".entry").childNodes)
        , xs = removeElementsWithUndefinedTag (rawProphecyArray).slice (3). slice (0, -1).map (el => el.innerHTML)
        , prophecises = R.splitEvery (2) (xs)
    
    const todayRaw = new Date()
        , dd       = String(todayRaw.getDate()).padStart(2, '0')
        , mm       = String(todayRaw.getMonth() + 1).padStart(2, '0')
        , yyyy     = todayRaw.getFullYear()
        , today    = yyyy + '-' + mm + '-' + dd
        , horoscope = new Horoscope (today, prophecises.map (tuple => new HoroscopeSignProphecy (tuple[0], tuple[1])))

    horoscope.saveTo ("test.txt")
}

request ("https://www.stardm.com/daily-horoscopes/A1-daily-horoscopes.asp", generateHoroscope)
