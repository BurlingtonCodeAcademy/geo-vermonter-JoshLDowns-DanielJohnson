import React from 'react'
import counties from './counties.png'

class MapScore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 100
        }
    }

    render () {
        return (
            <div id="score-wrapper">
                <div id='score'>
                    <p>Current Score:</p>
                </div>
            
                
                <div id='mapWrapper'>
                    <img id='county-map' src={counties} />
                </div>
            </div>
        )
    }
}

export default MapScore