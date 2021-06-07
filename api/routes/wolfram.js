var router = require("express").Router();
var request = require('request');
var convert = require('xml-js');

let stitchedString = "jsonData not yet recieved"; 
let appID = 'R664AY-2A795XLQQL';

router.get("/:wolframInput", function(req, res) {
  let wolframInput, wolframOutput;
  wolframInput = req.params.wolframInput;

  let processingArray = wolframInput.split("["), wolframInputsArray = [], wolframOutputsArray = [], stitchingArray = []
  console.log("processingArray: " + processingArray)
  if(processingArray.length <= 1){
    res.send(wolframInput)
  }

  //Parse input into array
  processingArray.forEach(snippet => {
    let rightBracketIndex = snippet.search("]")

    if(rightBracketIndex > 0){
      wolframInputsArray.push(snippet.substring(0,rightBracketIndex))
    }
  })

  //For each array value, call API to get result & store in wolframOutputsArray
  wolframInputsArray.forEach(input => {
    console.log("Input to send: " + input)

    //FIXME: Inputs get processed out of order - in order of processing speed.
    request(`http://api.wolframalpha.com/v2/query?input=${input}&appid=${appID}`, 
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                wolframOutput = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
                wolframOutput = wolframOutput.queryresult.pod[1].subpod.img['_attributes'].title; //FIXME: Make this more general - for now only works on output with the format 'Input, Result, etc...'
                console.log("Wolfram output: " + wolframOutput)
                wolframOutputsArray.push(wolframOutput)
                console.log(wolframOutputsArray)

                if(wolframOutputsArray.length === wolframInputsArray.length){
                  //Insert wolframOutputs back into string, and send
                  processingArray.forEach((snippet, index) => {
                    let rightBracketIndex = snippet.search("]")

                    if(rightBracketIndex <= 0){
                      stitchingArray.push(snippet)
                    }else{
                      stitchingArray.push(wolframOutputsArray[index-1])
                      stitchingArray.push(snippet.slice(rightBracketIndex+1))
                    }
                  })

                  stitchedString = stitchingArray.join('')
                  res.send(stitchedString)
                }
              }
            }
          )

  })
          
});

module.exports = router;