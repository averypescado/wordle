import { useState, useEffect } from 'react'
import {
  WORDS
} from './words'



const CreateNew = (props) => {
  const [guess, setGuess] = useState('')


  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew(guess)

    setGuess('')
  }
  let button
  if (guess.length > 5) {
    button = <h1>Pick a shorter word</h1>
  }

  else {
    button= <button className="button">Guess</button>
  }

  return (
    <div>
      <h2>Guess a word</h2>
      <form onSubmit={handleSubmit}>
        <div >
          <input name='guess' className="input_field" value={guess} onChange={(e) => setGuess(e.target.value)} />
        </div>
        {button}
      </form>
    </div>
  )
}


const Letter = ({input, solution, location}) => {
  const [letter, setLetter] = useState({input})

  if (solution.charAt(location)==input) {
     return (<div className='correct letter'>{input}</div>)
  }

  if (solution.includes(input)) {
    return (<div className='close letter'>{input}</div>)
  }

  else {
    return(<div className=' wrong letter'>{input}</div>)
  }

}

const Guess = ({input, solution}) => {
  return (
    <div className="row">
      <Letter input = {input.charAt(0)} solution = {solution} location = {0} />
      <Letter input = {input.charAt(1)} solution = {solution} location = {1} />
      <Letter input = {input.charAt(2)} solution = {solution} location = {2}/>
      <Letter input = {input.charAt(3)} solution = {solution} location = {3}/>
      <Letter input = {input.charAt(4)} solution = {solution} location = {4}/>
    </div>)
}

const Notification = ({guesses, success, solution}) => {
  if (success) {
    return (
      <div className="notification">
        You are correct!.<span><a href="https://www.youtube.com/watch?v=gKQOXYB2cd8" target="_blank"> Time to celebrate</a></span>
      </div>
    )
  }
  if (guesses.length > 5) {
    return (
      <div className="notification">
        You are out of guesses. the correct answer was <a href={"https://www.dictionary.com/browse/" + solution} target="_blank">{solution}</a>
      </div>
    )
  }


  else {
    return (null)
  }

}

const Board = ({current_guesses, solution}) => {
    return (
      <div className="board">
        {current_guesses.map(guess=>(<Guess input={guess} solution={solution}/>))}
      </div>
    )
  }

const Key = ({val,correct,almost,wrong}) => {
  let style
  if (correct.includes(val) ) {
    style='correct'
  }
  else if (almost.includes(val)) {
    style='close'
  }

  else if (wrong.includes(val)) {
     style='wrong'
   }

   else {
     style='normal'
   }

  return (
    <div className= {`key ${style}`}>{val}</div>

  )
}
const Keyboard = ({current_guesses,correct,almost,wrong, alphabet}) => {
  return (
    <div className="keyboard">
      {alphabet.map(letter=>(<Key val={letter} correct={correct} almost={almost} wrong={wrong} />))}
    </div>
  )
}


const App = () => {
  const [guesses, setGuesses] = useState([])
  const [solution,setSolution]=useState('')
  const [notification,setNotification]=useState('')
  const [success, setSuccess]=useState(false)
  const [correct, setCorrect] = useState('')
  const [almost, setAlmost] = useState('')
  const [wrong, setWrong] = useState('')


  useEffect(() => {
    if (guesses.length >=1) {
      create(guesses[guesses.length-1]);
    }
     // This is be executed when the state changes
}, [guesses]);

  useEffect(() => {
    const random = Math.floor(Math.random() * WORDS.length);
    setSolution(WORDS[random])
  }, []);


  const create_guess = (guess) => {
    setGuesses(guesses.concat(guess))
    if (guess===solution){
      setSuccess(true)
    }
  }

  const alphabet = ['q','w','e','r','t','y','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m']

  const create = (guess) => {
    let right=''
    let close=''
    let incorrect=''
    for (var i = 0; i < guess.length; i++) {
      if (guess.charAt(i)==solution.charAt(i)) {
        right+=guess.charAt(i)
      }
      if (guess.charAt(i)!=solution.charAt(i) && solution.includes(guess.charAt(i))) {
        close+=guess.charAt(i)
      }
      else  {
        incorrect+=guess.charAt(i)
      }
    }
    setCorrect(correct+right)
    setAlmost(almost+close)
    setWrong(wrong+incorrect)
  }

  const reset = () => {
    const random = Math.floor(Math.random() * WORDS.length);
    setGuesses([])
    setSolution(WORDS[random])
    setNotification('')
    setSuccess(false)
    setCorrect('')
    setAlmost('')
    setWrong('')
  }

  if (success) {
    return (
    <div className="container">
      <h1 className="centered">Wordle</h1>
      <img src={require("./giphy.gif")}/>
      <Notification guesses={guesses} success={success} solution={solution}/>
      <Board current_guesses={guesses} solution={solution} />
      <Keyboard current_guesses={guesses} alphabet={alphabet} correct={correct} almost={almost} wrong={wrong} />
    </div>

    )
  }


  if (!success && guesses.length >5) {
    return (
    <div className="container">
      <h1 className="centered">Wordle</h1>
      <img src={require("./lose.gif")}/>
      <Notification guesses={guesses} success={success} solution={solution}/>
      <button onClick={reset} className="reset">Start Over</button>
      <Board current_guesses={guesses} solution={solution} />
      <Keyboard current_guesses={guesses} alphabet={alphabet} correct={correct} almost={almost} wrong={wrong} />
    </div>

    )

  }
  else {
    return (
      <div className="container">
        <img src={require("./confused.jpg")}/>
        <h1 className="centered">Avery's Wordle</h1>
        <CreateNew addNew={create_guess} currentGuess={guesses} />
        <Board current_guesses={guesses} solution={solution} />
        <Keyboard current_guesses={guesses} alphabet={alphabet} correct={correct} almost={almost} wrong={wrong} />
      </div>

    )
  }

}

export default App

