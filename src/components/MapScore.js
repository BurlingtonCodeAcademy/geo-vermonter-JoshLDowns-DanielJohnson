// ---- Imports  ---- //
import React from 'react'
import counties from '../images/counties.png'

// ---- MapScore (main sidebar content) ----//
class MapScore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 100
        }
    }
    //renders all information in side bar including current score, status, directional inputs, and example county map
    render() {
        return (
            <div id="score-wrapper">
                {/*Displays current score*/}
                <div id='score'>
                    <p>Current Score: {this.props.score}</p>
                </div>
                {/*Displays county map*/}
                <div id='mapWrapper'>
                    <img id='county-map' src={counties} alt='County Map of VT' />
                </div>
                {/*Layout for directional inputs*/}
                <div id='directionBtns'>
                    <div id='north-wrapper'>
                        <button className='direction-button' id='north' disabled={!this.props.gameStarted} onClick={this.props.directionHandler}>North</button>
                    </div>

                    <div id='east-west-wrapper'>
                        <button className='direction-button' id='west' disabled={!this.props.gameStarted} onClick={this.props.directionHandler}>West</button>
                        <button className='direction-button' id='east' disabled={!this.props.gameStarted} onClick={this.props.directionHandler}>East</button>
                    </div>

                    <div id='south-wrapper'>
                        <button className='direction-button' id='south' disabled={!this.props.gameStarted} onClick={this.props.directionHandler}>South</button>
                    </div>
                </div>
                {/*Displays current status*/}
                <div id='status-bar'>
                    <p id='status'>Status: {this.props.status}</p>
                </div>
            </div>
        )
    }
}

export default MapScore