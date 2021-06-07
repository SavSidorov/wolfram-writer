import "./Form.css"
import React, { useState } from 'react';
import axios from 'axios';

function Form(){
  const [wolframInput, setWolframInput] = useState({})
  const [wolframOutput, setWolframOutput] = useState({})

  const submit = (e) => {
    e.preventDefault()
    console.log("Clicked submit!")
    console.log("Input is: " + wolframInput.input)
    axios
      .get(`http://localhost:9000/wolfram/${wolframInput.input}`) //TODO: maybe to string parsing on the front end and send out seperate API calls
      .then(response => {
        console.log("Output is: " + response.data)
        setWolframOutput(response.data);
      })
      .catch(err => {console.error(err)})
  }

  if(wolframInput){
    console.log(wolframInput.input)
  }

  return(
    <div>
      <form onSubmit={submit} className="form">
        <textarea   type="text" 
                    name="input" 
                    onChange={e => setWolframInput({ ...wolframInput, input: e.target.value })} 
                    rows="4" cols="50"
        />
        <input type="submit" className="click"/>
      </form>
      {typeof wolframOutput === "string" ? <p className="output">{wolframOutput}</p> : null}
    </div>
  )
}

export default Form;