# Horoscope Scanner

## What does this util do?

It's a CLI tool that takes 1 or 2 arguments:

1. Link to a horoscope source
2. File name to save (If it's not provided then output goes to stdout)

## Requirements

Run `npm i` before testing

## Testing

Just try it out with `node src/Main.js "https://www.stardm.com/daily-horoscopes/A1-daily-horoscopes.asp"`

And with `node src/Main.js https://www.stardm.com/daily-horoscopes/AL1-daily-love-horoscopes.asp test.txt` to save an output to test.txt

## Why use RamdaJS?

JavaScript doesn't have chunksOf functin built in (a function that breaks down an array in chunks of n elements)

Also JavaScript's object-oriented methods can't be composed with regular function, for example:

```javascript
const xs                 = [1, 2, 3, 4, 5]
    , removeFirstAndLast = xs.slice (1).slice (0, -1)
    , result             = xs.map (x => x * 2)
                             .filter (x => x > 5)

```

How to embed `removeFirstAndLast` between map and filter? `<object>.g (). f ()` chaining goes left to right, while `f (g (x))` goes right to left.

You have to devide your code in pieces without any reason. Also RamdaJS's naming just makes more sense

Why `slice (1)` means remove the first element and `slice (0, -1)` the last? It's hard to google and find in a documentation while we have `drop ()` and `dropLast ()` in RamdaJS

Consider these as a real world examples based on this util's task:
```javascript
// WITHOUT RAMDA ===================================================================================================
const chunksOf = array => size => {
    if (!array) return []

    const firstChunk = array.slice (0, size)

    return !firstChunk.length
        ? array
        : [firstChunk].concat (chunksOf (array.slice (size, array.length)) (size)) 
}

const rawProphecyArray = Array.from (doc.querySelector (".entry").childNodes)
    , prophecyArray    = rawProphecyArray.filter (el => el.tagName !== undefined)
                                         .map (el => el.innerHTML)
                                         .slice (3)
                                         .slice (0, -1)
    , horoscopeSigns = chunksOf (prophecyArray) (2).map (tuple => new HoroscopeSignProphecy (tuple[0], tuple[1]))
    , today = new Date ().toISOString ()
                         .replace (/T/, ' ')
                         .replace (/\..+/, '')
    , horoscope = new Horoscope (today, prophecises)

// WITH RAMDA ======================================================================================================
const prophecySource = doc.querySelector (".entry").childNodes

const horoscopeSigns = R.compose ( // ATTANTION, compose reads right to left, or down to up
    R.map (pair => new HoroscopeSignProphecy (pair[0], pair[1])),
    R.splitEvery (2),
    R.init,
    R.drop (3),
    R.map (el => el.innerHTML),
    R.filter (el => el.tagName !== undefined),
    Array.from
) (prophecySource)

   , today     = new Date ().toISOString ()
                            .replace (/T/, ' ')
                            .replace (/\..+/, '')
   , horoscope = new Horoscope (today, horoscopeSigns)
```
Not only JS doesn't have built in realisation of `chunksOf`, it requires as to devide our code on pieces without any reason, of course you can write it without deviding but in that case you will need to switch from left to right and vice versa chaining of functions in a one expression

Also you can rewrite it in imperative way using loop statements and etc, that probably would perform better but would become absolutely unreadable
