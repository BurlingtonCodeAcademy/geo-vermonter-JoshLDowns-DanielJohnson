import React from 'react'
import vermontCounties from './vermontCounties.gif'

class MapScore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            score: 100
        }
    }

    render () {
        return (
            <div>
                <div id='score'>
                    <p>Current Score: </p>
                </div>
                <div id='mapWrapper'>
                    <img id='county-map' src={vermontCounties} />
                </div>
            </div>
        )
    }
}

export default MapScore