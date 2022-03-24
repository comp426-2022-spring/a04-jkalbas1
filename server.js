const express = require('express')
const args = require('minimist')(process.argv.slice(2))
const app = express()
const database = require('better-sqlite3')
const logdb = new database('log.db')

var port = args.port || 5000
var debug = args.debug || false
var log = args.log || true
var help = args.help

if(help != null) {
  console.log('--port     Set the port number for the server to listen on. Must be an integer between 1 and 65535.\n')
  console.log('--debug    If set to `true`, creates endlpoints /app/log/access/ which returns a JSON access log from the database and /app/error which throws an error with the message "Error test successful." Defaults to `false`.\n')
  console.log('--log      If set to false, no log files are written. Defaults to true. Logs are always written to database.\n')
  console.log('--help     Return this message and exit.')
  process.exit(0)
}

if(port < 1 || port > 65535) { port = 5000 }

const stmt = logdb.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='access';`)
let row = stmt.get();
if(row == undefined) {
  console.log('Log database is empty. Creating log database...')
  const sqlInit = `CREATE TABLE accesslog (
    id INTEGER PRIMARY KEY,
    remote_addr VARCHAR,
    remote_user VARCHAR,
    date VARCHAR,
    method VARCHAR,
    url VARCHAR,
    http_version NUMERIC,
    status INTEGER,
    content_length NUMERIC,
    referrer_url VARCHAR,
    user_agent VARCHAR
  );`
  logdb.exec(sqlInit)
} else {
  console.log('Log database exists.')
}

module.exports = logdb

function coinFlip() {
    let flip_value = 2;
    flip_value = Math.floor(Math.random(2) * 2)
    if(flip_value == 0) 
    {
      return 'heads'
    } else {
      return 'tails'
    }
  }
  
  /** Multiple coin flips
   * @param {number} flips 
   * @returns {string[]} results
   */
  
function coinFlips(flips) {
    const flip_arr = []
    let flip_value = 2;
    for(let i=0; i < flips; i++) {
      flip_value = Math.floor(Math.random(2) * 2)
      if(flip_value == 0) 
      {
        flip_arr[i] = 'heads'
      } else {
        flip_arr[i] = 'tails'
      }
    }
    return flip_arr
  }
  
  /** Count multiple flips
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
function countFlips(array) {
    let tails = 0
    let heads = 0
    for(let i=0; i<array.length; i ++) {
      if (array[i] == 'heads') {
        heads += 1
      } else {
        tails += 1
      }
    }
    if ( tails == 0) {
      return {'heads': heads}
    } else if (heads == 0) {
      return {'tails': tails}
    }
    return {'tails': tails, 'heads': heads}
  }
  
  /** Flip a coin!
   * @param {string} call 
   * @returns {object} 
   */
  
function flipACoin(call) {
    let flip_value = Math.floor(Math.random(2) * 2)
    let flip = ''
    if(flip_value == 0) 
    {
      flip = 'heads'
    } else {
      flip = 'tails'
    }
    let result = ''
    if(flip == call) {
      result = 'win'
    } else {
      result = 'lose'
    }
    return {'call': call, 'flip': flip, 'result': result}
  }
  
function guessFlip(call) {
    
    if (call != 'heads' && call != 'tails') {
        return 'Error: incorrect input. \nUsage: node guess-flip --call=[heads|tails]'
    }
  
    return flipACoin(call)
  }
  
function flips(number) {
  
    if (number == null) {
        number = 1
    }
    let flips = coinFlips(number)
    let flip_data = countFlips(flips)
    return [flips, '\n', flip_data]
  }
  
function flip() {
    return coinFlip()
  }


const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

app.get('/app', (req, res)  => {
    res.statusCode = 200
    res.statusMessage = 'OK'
    res.writeHead( res.statusCode, {'Content-Type' : 'text/plain'})
    res.end(res.statusCode + ' ' + res.statusMessage)
})

app.get('/app/flips/:number', (req, res) => {
    let flips_raw = coinFlips(req.params.number)
    let flips_data = countFlips(flips_raw)
    res.type('text/json')
    res.status(200).json({"raw": flips_raw, "summary": flips_data})
})

app.get('/app/flip', (req, res) => {
    res.type('text/json')
    res.status(200).json({"flip": flip()})
})

app.get('/app/flip/call/:guess', (req, res) => {
    const guessedFlip = guessFlip(req.params.guess)
    res.type('text/json')
    res.status(200).send(guessedFlip)
})

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
})