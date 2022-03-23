const express = require('express')
const args = require('minimist')(process.argv.slice(2))
const app = express()

var port = args.port || 5000


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