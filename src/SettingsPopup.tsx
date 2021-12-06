import React, { RefObject } from 'react';
import x from './images/x.png'

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

    popupRef: RefObject<any>

    constructor(props: any) {
        super(props)
        this.onNumberDelayChange = this.onNumberDelayChange.bind(this)
        this.onProblemDelayChange = this.onProblemDelayChange.bind(this)
        this.onTimeForPointsChange = this.onTimeForPointsChange.bind(this)
        this.handleClick = this.handleClick.bind(this)

        this.popupRef = React.createRef()

        this.state = {
            numberDelay: this.props.numberDelay,
            problemDelay: this.props.problemDelay,
            timeForPoints: this.props.timeForPoints
        }
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClick, false);
    }

    handleClick(e: any) {
        // If click outside popup
        if (!this.popupRef.current.contains(e.target)) {
            // Close popup
            this.props.closeSettings()
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
                    <h5 style={{ margin: "5%", fontFamily: "didot", color: "#ead8f3" }}>{10 - index}</h5>
                    <input style={{ width: "60%" }} value={score} onChange={(e) => this.onTimeForPointsChange(e, index)} />
                </div>
            )
        })
        return (
            // Translucent background
            <div style={{ position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0, 0.5)" }}>
                {/* // Popup box */}
                <div ref={this.popupRef} style={{ position: "fixed", display: "flex", flexDirection: "column", width: "30%", height: "35%", backgroundColor: "black", border: "4px solid #954eff", borderRadius: "10px" }}>
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "20%" }}>
                        <h1 style={{ fontFamily: "didot", color: "#ead8f3" }}>Settings</h1>
                        {/* X button */}
                        <img style={{ position: "absolute", top: "30%", right: "3%", height: "40%" }} alt="x button" src={x} onClick={() => this.props.closeSettings()} />
                    </div>

                    {/* Number and problem delay */}
                    <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "40%" }}>
                        {/* Left side */}
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", height: "100%", width: "50%" }} >
                            <p style={{ margin: "4%", fontFamily: "didot", color: "#ead8f3" }}>Delay between numbers:</p>
                            <p style={{ margin: "4%", fontFamily: "didot", color: "#ead8f3" }}>Delay between problems:</p>
                        </div>

                        {/* Right side */}
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: "100%", width: "50%" }} >
                            <input style={{ margin: "4%" }} value={this.state.numberDelay} onChange={(e) => (this.onNumberDelayChange(e))} />
                            <input style={ {margin: "4%" }} value={this.state.problemDelay} onChange={(e) => (this.onProblemDelayChange(e))} />
                        </div>
                    </div>

                    {/* Time for points */}
                    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", height: "40%" }}>
                        <p style={{ fontFamily: "didot", color: "#ead8f3" }}> Time for points (ms)</p>

                        <div style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center" }}>
                            {timeForPointsInputs}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsPopup;