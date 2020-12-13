import React from 'react';
import x from './x.png'

type SettingsProps = {
    closeSettings: Function
    updateConfig: Function
    numberDelay: number
    problemDelay: number
    timeForPoints: number[]
}

type SettingsState = {
    numberDelay: number
    problemDelay: number
    timeForPoints: number[]
}

class SettingsPopup extends React.Component<SettingsProps, SettingsState> {

    constructor(props: any) {
        super(props)
        this.onNumberDelayChange = this.onNumberDelayChange.bind(this)
        this.onProblemDelayChange = this.onProblemDelayChange.bind(this)
        this.onTimeForPointsChange = this.onTimeForPointsChange.bind(this)

        this.state = {
            numberDelay: this.props.numberDelay,
            problemDelay: this.props.problemDelay,
            timeForPoints: this.props.timeForPoints
        }
    }

    // Update numberDelay
    onNumberDelayChange(event: any) {
        // If valid number
        if (!isNaN(Number(event.target.value))) {
            this.setState({
                numberDelay: event.target.value
            }, () => this.props.updateConfig(this.state.numberDelay, this.state.problemDelay))
        }
    }

    // Update problemDelay
    onProblemDelayChange(event: any) {
        // If valid number
        if (!isNaN(Number(event.target.value))) {
            this.setState({
                problemDelay: event.target.value
            }, () => this.props.updateConfig(this.state.numberDelay, this.state.problemDelay))
        }
    }

    // Update timeForPoints
    onTimeForPointsChange(event: any, index: number) {
        // If valid number
        if (!isNaN(Number(event.target.value))) {
            let timeForPoints: number[] = this.state.timeForPoints
            timeForPoints[index] = Number(event.target.value)
            this.setState({
                timeForPoints: timeForPoints,
            })
            // Don't need to call updateConfig since timeForPoints is passed by reference
        }
    }

    render() {
        const timeForPointsInputs = this.state.timeForPoints.map((score, index) => {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h5 style={{ margin: "5%" }}>{10 - index}</h5>
                    <input style={{ width: "60%" }} value={score} onChange={(e) => this.onTimeForPointsChange(e, index)} />
                </div>
            )
        })
        return (
            // Translucent background
            <div style={{ position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0, 0.5)" }}>
                {/* // Popup box */}
                <div style={{ position: "fixed", display: "flex", flexDirection: "column", width: "30%", height: "35%", backgroundColor: "beige", border: "2px solid black" }}>
                    {/* Header */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "20%" }}>
                        <h1>Settings</h1>
                        {/* X button */}
                        <img style={{ position: "absolute", top: "30%", right: "3%", height: "40%" }} alt="x button" src={x} onClick={() => this.props.closeSettings()} />
                    </div>

                    <hr style={{ width: "100%", margin: "0px", border: "1px solid black" }} />

                    {/* Body */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80%", width: "100%" }}>
                        {/* Number and problem delay */}
                        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                            {/* Left side */}
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", height: "100%", width: "50%" }} >
                                <p style={{ margin: "4%", padding: "0%" }}>Delay between numbers:</p>
                                <p style={{ margin: "4%", padding: "0%" }}>Delay between problems:</p>
                            </div>

                            {/* Right side */}
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: "100%", width: "50%" }} >
                                <input style={{ margin: "4%", padding: "0%" }} value={this.state.numberDelay} onChange={(e) => (this.onNumberDelayChange(e))} />
                                <input style={{ margin: "4%", padding: "0%" }} value={this.state.problemDelay} onChange={(e) => (this.onProblemDelayChange(e))} />
                            </div>
                        </div>

                        {/* Time for points */}
                        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
                            <p style={{ marginTop: "5%", marginBottom: "2%" }}> Time for points:</p>

                            <div style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center" }}>
                                {timeForPointsInputs}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsPopup;