// A library to make HTTP requests with ease
const request = require ("request")

// A library to use host's file system
const fs = require ("fs")

// A library to use JavaScript's DOM to parse document
// , probably it's better to use something more lightweight ?
const jsdom = require("jsdom")
const { JSDOM } = jsdom

// A functional programming library
const R = require ("ramda")

// Horoscope representation
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

// Horoscope sign representation as a handful data structure
class HoroscopeSignProphecy {
    constructor (name, prophecyContent) {
        this.name = name
        this.prophecyContent = prophecyContent
    }
}

// A callback that parses horoscope file downloaded from stardm.com
const horoschopeRequestHandler = (_error, _response, body) => {
    const doc = new JSDOM (body).window.document
    const removeElementsWithUndefinedTag = xs => xs.filter (el => el.tagName !== undefined)

    // An entry class contains all signs and prophecies that we need
    const prophecySourceArray = removeElementsWithUndefinedTag (Array.from (doc.querySelector (".entry").childNodes))

    // Remove everything except for signs and prophecies
    const prophecyArray = R.compose (
        R.splitEvery (2), // Break down the array to chunks of 2
        R.map (el => el.innerHTML), // map html tags to their content text
        R.init, // Remove the first element
        R.drop (3) // Remove last 3 elements
    ) (prophecySourceArray)

    // Get today's date in format YYYY-MM-DD H:M:S
    const today = new Date ().toISOString ()
                             .replace (/T/, ' ')
                             .replace (/\..+/, '')

    // Construct sign prophecies from pairs
    const horoscopeSignProphecies =
        prophecyArray.map (
            pair => new HoroscopeSignProphecy (
                R.head (pair),
                R.last (pair)
            )
        )

    const horoscope = new Horoscope (today, horoscopeSignProphecies)

    horoscope.saveTo ("test.txt")
}

const args       = R.take (2) (process.argv)
    , link       = R.head (args)
    , fileToSave = R.last (args)

// Send HTTP request
request ("https://www.stardm.com/daily-horoscopes/A1-daily-horoscopes.asp", horoschopeRequestHandler)
