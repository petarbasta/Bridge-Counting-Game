import React from 'react';
import { GameConfig } from './GameConfig';
import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from "firebase/analytics";
import firebaseConfig from './firebaseConfig.json'
import './Game.css'

type GameState = {
  num1: number | null
  num2: number | null
  num3: number | null
  answer: number | null | string
  answersLocked: boolean
  isInGame: boolean,
  isGameComplete: boolean
  problemsRemaining: number,
  correctAnswers: number,
  incorrectAnswers: number,
  score: number,
  totalPointsScored: number
  pointsForProblem: number | null,
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

class Game extends React.Component<{}, GameState> {

    startTime: number | null
    problem: number[] | null

    constructor(props: any) {
        super(props)
        
         // Bind functions
        this.getProblem = this.getProblem.bind(this)
        this.onStart = this.onStart.bind(this)
        this.delay = this.delay.bind(this)
        this.submit = this.submit.bind(this)
        this.keydown = this.keydown.bind(this)
        this.generateProblems = this.generateProblems.bind(this)
        this.getScore = this.getScore.bind(this)

        this.startTime = null
        this.problem = null

        this.state = {
          num1: null,
          num2: null,
          num3: null,
          answer: null,
          answersLocked: true,
          isInGame: false,
          isGameComplete: false,
          problemsRemaining: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          score: 0,
          totalPointsScored: 0,
          pointsForProblem: null,
        }
    }

    // Starts new problem
  async onStart() {
    // Add keyboard listener
    document.addEventListener("keydown", this.keydown, false);

    this.setState({
      num1: null,
      num2: null,
      num3: null,
      answer: null,
      pointsForProblem: null
    })

    this.problem = this.getProblem();

    // Display problem with delay
    this.setState({ num1: this.problem[0] })
    await this.delay(GameConfig.numberDelay)
    this.setState({ num2: this.problem[1] })
    await this.delay(GameConfig.numberDelay)
    this.setState({ num3: this.problem[2] })
    await this.delay(GameConfig.numberDelay)
    this.setState({ answer: "?", answersLocked: false }, () => { this.startTime = new Date().getTime(); })
  }

  // Returns new problem
  getProblem() {
    let numbers = [0, 0, 0, 0]

    // Randomly deal 13 cards to 4 players
    for (let i = 0; i < 13; i++) {
      var nextPerson: number = Math.floor(Math.random() * 4)
      numbers[nextPerson] = numbers[nextPerson] + 1
    }

    return numbers
  }

  // Process user answer
  async submit(answer: number) {
    // Remove keyboard listener
    document.removeEventListener("keydown", this.keydown, false);

    let elapsedTime = new Date().getTime() - this.startTime!
    this.setState({ answer: answer, answersLocked: true })

    // If answer is correct
    if (answer === this.problem![3]) {
      // Award points
      let pointsForProblem = this.getScore(elapsedTime)
      this.setState({
        score: this.state.score + pointsForProblem,
        totalPointsScored: this.state.totalPointsScored + pointsForProblem,
        pointsForProblem: pointsForProblem,
        correctAnswers: this.state.correctAnswers + 1,
      })
    }
    // If answer is incorrect
    else {
      // No points update
      this.setState({
        pointsForProblem: 0,
        incorrectAnswers: this.state.incorrectAnswers + 1,
      })
    }

    // If there are still problems to display
    if (this.state.problemsRemaining > 0) {
      await this.delay(GameConfig.problemDelay)
      // Decrement counter and start next problem
      this.setState({ problemsRemaining: this.state.problemsRemaining - 1 }, () => { this.onStart() })
    }
    else {
      await this.delay(GameConfig.problemDelay)
      this.setState({ isInGame: false, isGameComplete: true})
    }
  }

  // Get score for problem based on time to answer
  getScore(elapsedTime: number) {
    if (elapsedTime < GameConfig.gracePeriod) {
      return GameConfig.maxScore
    }
    else if (elapsedTime > GameConfig.decayPeriod) {
      return GameConfig.minScore
    }
    else {
      // linearly decay
      return Math.round((GameConfig.decayPeriod + GameConfig.gracePeriod - elapsedTime)/(GameConfig.decayPeriod) * (GameConfig.maxScore - GameConfig.minScore) / 100) * 100 + GameConfig.minScore
    }
  }

  // Generates new problems
  async generateProblems() {
    logEvent(analytics, 'new_game_initiated')
    this.setState({ problemsRemaining: GameConfig.roundsPerGame - 1, isInGame: true, isGameComplete: false, score: 0 }, () => { this.onStart() })
  }

  // Set program to sleep
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // When key is pressed
  keydown(event: any) {
    let keyPressed = event.keyCode
    // Only allow 0-9 and q,w,e,r
    if (!this.state.answersLocked && keyPressed >= 48 && keyPressed <= 57) {
      this.submit(keyPressed - 48)
    }
    if (!this.state.answersLocked && keyPressed === 81) {
      this.submit(10)
    }
    if (!this.state.answersLocked && keyPressed === 87) {
      this.submit(11)
    }
    if (!this.state.answersLocked && keyPressed === 69) {
      this.submit(12)
    }
    if (!this.state.answersLocked && keyPressed === 82) {
      this.submit(13)
    }
  }

    render() {
        let messageColor = "#a18fa1"
        if (this.state.pointsForProblem !== null) {
          messageColor = this.state.pointsForProblem === 0 ? "#990000" : "green"
        }

        let message = this.state.pointsForProblem === null ? null : <h3 style={{ color: messageColor, fontFamily: "didot", fontSize: "xx-large" }}>+ {this.state.pointsForProblem.toLocaleString()} points</h3>

        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        const answerButtons = numbers.map((key) => {
            return (
                <button disabled={this.state.answersLocked} style={{ margin: "0.5%", height: "90%", width: "9%", border: "1px solid black", borderRadius: "5px" }} className="answer_button" key={key} onClick={() => this.submit(key)}>
                    {key}
                </button>
            )
        })

        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", backgroundColor: "black" }}>
              
              <div style= {{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "25%", width: "100%" }}>
                {/* Total score */}
                <div style= {{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "75%", width: "100%" }}>
                    <h3 style= {{ color: 'pink', margin: '0%', fontSize: "xx-large" }}>SCORE</h3>
                    <h1 style= {{ color: 'pink', margin: '0%', fontSize: "xxx-large" }}> {this.state.score.toLocaleString()} </h1>
                </div>

                {/* Message on answer */}
                <div style= {{ display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", height: "25%", width: "100%" }}>
                    {!this.state.isGameComplete && message}
                </div>
            
              </div>

              {!this.state.isGameComplete && 
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", height: "50%", width: "100%", margin: "0%" }} >
                  {/* Problem display */}
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", height: "40%", width: "55%", margin: "0%" }} >
                      <div className="number-box" style={{ border: "4px solid " + messageColor }}>
                          <p style={{ fontSize: "xxx-large", color: messageColor }}>{this.state.num1}</p>
                      </div>
                      <div className="number-box" style={{ border: "4px solid " + messageColor }}>
                          <p style={{ fontSize: "xxx-large", color: messageColor }}>{this.state.num2}</p>
                      </div>
                      <div className="number-box" style={{ border: "4px solid " + messageColor }}>
                          <p style={{ fontSize: "xxx-large", color: messageColor }}>{this.state.num3}</p>
                      </div>
                      <div className="number-box" style={{ border: "4px solid " + messageColor }}>
                          <p style={{ fontSize: "xxx-large", color: messageColor }}>{this.state.answer}</p>
                      </div>
                  </div>

                  {/* Answer buttons  */}
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "30%", width: "80%" }}>
                      {answerButtons}
                  </div>
                </div>  
              }
              

              {/* Play button */}
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "15%", width: "100%" }}>
                <button style={{width:"12%"}}disabled={this.state.isInGame} className="bn30" onClick={() => this.generateProblems()}>
                  Play
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "15%", width: "100%"}} >
                <p className="stats-text">Correct answers: {this.state.correctAnswers}</p>
                <p className="stats-text">Incorrect answers: {this.state.incorrectAnswers}</p>
                <p className="stats-text">Correct percentage: {this.state.correctAnswers + this.state.incorrectAnswers === 0 ? "N/A" : (100 * this.state.correctAnswers / (this.state.correctAnswers + this.state.incorrectAnswers)).toFixed(2) + "%"}</p>
                <p className="stats-text"> Average points: {this.state.correctAnswers + this.state.incorrectAnswers === 0 ? "N/A" : Math.round(this.state.totalPointsScored / (this.state.correctAnswers + this.state.incorrectAnswers)).toLocaleString()}</p>
              </div>          
            </div>
        )
    }
}

export default Game;