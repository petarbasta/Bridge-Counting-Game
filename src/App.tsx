import React, { Component } from 'react';
import './App.css';
import { config } from './config';
import { BrowserView, MobileView } from 'react-device-detect';
import SettingsPopup from './SettingsPopup'
import gear from './images/gear.png'

type BridgeState = {
  num1: number | null
  num2: number | null
  num3: number | null
  answer: number | null | string
  message: string
  answersLocked: boolean
  newProblemsLocked: boolean,
  clearScoreLocked: boolean,
  problemsRemaining: number,
  correctAnswers: number,
  incorrectAnswers: number,
  score: number,
  pointsForProblem: number | null,
  showSettings: boolean,
  numberDelay: number,
  problemDelay: number,
  timeForPoints: number[]
}

class App extends Component<{}, BridgeState> {

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
    this.tenProblems = this.tenProblems.bind(this)
    this.getScore = this.getScore.bind(this)
    this.clearScore = this.clearScore.bind(this)
    this.openSettings = this.openSettings.bind(this)

    this.startTime = null
    this.problem = null

    this.state = {
      num1: null,
      num2: null,
      num3: null,
      answer: null,
      message: "",
      answersLocked: true,
      newProblemsLocked: false,
      clearScoreLocked: true,
      problemsRemaining: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      score: 0,
      pointsForProblem: null,
      showSettings: false,
      numberDelay: config.numberDelay,
      problemDelay: config.problemDelay,
      timeForPoints: config.timeForPoints
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
      message: "",
      newProblemsLocked: true,
      pointsForProblem: null
    })

    this.problem = this.getProblem();

    // Display problem with delay
    this.setState({ num1: this.problem[0] })
    await this.delay(this.state.numberDelay)
    this.setState({ num2: this.problem[1] })
    await this.delay(this.state.numberDelay)
    this.setState({ num3: this.problem[2] })
    await this.delay(this.state.numberDelay)
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
    this.setState({ answer: answer, answersLocked: true, newProblemsLocked: false })

    // If answer is correct
    if (answer === this.problem![3]) {
      // Award points
      let pointsForProblem = this.getScore(elapsedTime)
      this.setState({
        message: "Correct!",
        score: this.state.score + pointsForProblem,
        pointsForProblem: pointsForProblem,
        correctAnswers: this.state.correctAnswers + 1,
        clearScoreLocked: false
      })
    }
    // If answer is incorrect
    else {
      // No points update
      this.setState({
        message: "Incorrect. Answer is " + this.problem![3] + ".",
        incorrectAnswers: this.state.incorrectAnswers + 1,
        clearScoreLocked: false
      })
    }

    // If there are still problems to display
    if (this.state.problemsRemaining > 0) {
      await this.delay(this.state.problemDelay)
      // Decrement counter and start next problem
      this.setState({ problemsRemaining: this.state.problemsRemaining - 1 }, () => { this.onStart() })
    }
  }

  // Get score for problem based on time to answer
  getScore(elapsedTime: number) {
    for (let i = 0; i < this.state.timeForPoints.length; i++) {
      // Check if time to answer less than next reward level
      if (elapsedTime < this.state.timeForPoints[i]) {
        // Return between 0 and 10 points
        return 10 - i
      }
    }
    return 1
  }

  // Initiates 10 new problems
  async tenProblems() {
    this.setState({ problemsRemaining: 9 }, () => { this.onStart() })
  }

  // Set program to sleep
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Resets user score
  clearScore() {
    this.setState({
      correctAnswers: 0,
      incorrectAnswers: 0,
      score: 0,
      clearScoreLocked: true,
    })
  }
  
  openSettings() {
    this.setState({ showSettings: true }, () => document.removeEventListener("keydown", this.keydown, false))
  }

  closeSettings() {
    this.setState({ showSettings: false }, () => document.addEventListener("keydown", this.keydown, false))
  }

  updateConfig(numberDelay: number, problemDelay: number) {
    this.setState({
      numberDelay: numberDelay,
      problemDelay: problemDelay,
    })
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
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    const answerButtons = numbers.map((key) => {
      return (
        <button disabled={this.state.answersLocked} style={{ margin: "0.5%", height: "90%", width: "9%" }} key={key} onClick={() => this.submit(key)}>
          {key}
        </button>

      )
    })
    let messageColor = this.state.message === "Correct!" ? "green" : "red"
    let pointsForProblem = this.state.pointsForProblem === null ? "" : this.state.pointsForProblem + " points"
    return (
      <>
        {/* Displays on PC  */}
        <BrowserView>
          <div style={{ position: "absolute", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
            <div style={{ alignContent: "center", width: "60%", height: "40%", display: "flex", flexDirection: "column", backgroundColor: "darkgray", border: "2px solid black" }}>
              {/* Header */}
              <div style={{ justifyContent: "space-between", alignItems: "center", width: "100%", height: "20%", display: "flex", flexDirection: "row", backgroundColor: "gray" }}>
                <p>Basta Bridge | Counting Game :)</p>
                {/* Settings button */}
                <img style={{ padding: "3%", height: "45%" }} alt="settings button" src={gear} onClick={() => this.openSettings()} />
              </div>

              <hr style={{ width: "100%", margin: "0px", border: "1px solid black" }} />

              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "80%", width: "100%" }}>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "60%" }}>

                  {/* Problem display */}
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "40%", width: "100%" }} >
                    <div className="number-box">
                      <h2>{this.state.num1}</h2>
                    </div>
                    <div className="number-box">
                      <h2>{this.state.num2}</h2>
                    </div>
                    <div className="number-box">
                      <h2>{this.state.num3}</h2>
                    </div>
                    <div className="number-box">
                      <h2>{this.state.answer}</h2>
                    </div>
                  </div>

                  {/* Answer buttons  */}
                  <div style={{ margin: "0%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "15%", width: "100%" }}>
                    {answerButtons}
                  </div>

                  {/* Message on answer */}
                  <div style={{ margin: "0%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "25%", width: "100%" }}>
                    <h2 style={{ color: messageColor }}>{this.state.message + " " + pointsForProblem}</h2>
                  </div>

                  {/* Control buttons */}
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "20%", width: "100%" }}>
                    <button disabled={this.state.newProblemsLocked || this.state.problemsRemaining > 0} className="btn button" onClick={() => this.onStart()}>
                      New problem
                    </button>
                    <button disabled={this.state.newProblemsLocked || this.state.problemsRemaining > 0} className="btn button" onClick={() => this.tenProblems()}>
                      10 Problems
                    </button>
                    <button disabled={this.state.clearScoreLocked || this.state.problemsRemaining > 0} className="btn button" onClick={() => this.clearScore()}>
                      Clear Score
                    </button>
                  </div>
                </div>

                {/* Stats display */}
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%", width: "40%" }} >
                  {/* Left side */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", height: "100%", width: "50%" }} >
                    <p style={{ margin: "4%", padding: "0%" }}>Correct answers:</p>
                    <p style={{ margin: "4%", padding: "0%" }}>Incorrect answers:</p>
                    <p style={{ margin: "4%", padding: "0%" }}>Correct percentage:</p>
                    <p style={{ margin: "4%", padding: "0%" }}>Total points:</p>
                    <p style={{ margin: "4%", padding: "0%" }}>Average points:</p>
                  </div>

                  {/* Right side */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: "100%", width: "50%" }} >
                    <p style={{ margin: "4%", padding: "0%" }}>{this.state.correctAnswers}</p>
                    <p style={{ margin: "4%", padding: "0%" }}>{this.state.incorrectAnswers}</p>
                    <p style={{ margin: "4%", padding: "0%" }}>{this.state.correctAnswers + this.state.incorrectAnswers === 0 ? "N/A" : (100 * this.state.correctAnswers / (this.state.correctAnswers + this.state.incorrectAnswers)).toFixed(2) + "%"}</p>
                    <p style={{ margin: "4%", padding: "0%" }}>{this.state.score}</p>
                    <p style={{ margin: "4%", padding: "0%" }}>{this.state.correctAnswers + this.state.incorrectAnswers === 0 ? "N/A" : (this.state.score / (this.state.correctAnswers + this.state.incorrectAnswers)).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Show settings popup */}
            {this.state.showSettings ?
              <SettingsPopup
                closeSettings={this.closeSettings.bind(this)}
                updateConfig={this.updateConfig.bind(this)}
                numberDelay={this.state.numberDelay}
                problemDelay={this.state.problemDelay}
                timeForPoints={this.state.timeForPoints}
              />
              : null}
          </div>
        </BrowserView>
        {/* Displays on mobile */}
        <MobileView>
          <p>This application is not available on mobile yet. Try again soon!</p>
        </MobileView>
      </>
    );
  }
}

export default App;