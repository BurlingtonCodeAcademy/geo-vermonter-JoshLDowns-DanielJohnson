import React from 'react'

// ---- Simple header component ---- //
export default function Header (props) {
    return (
        <div id='header'>
            <div>
            <   p id='title'>geo-vermonter</p>
            </div>
            <div id='hamburger' onClick={props.hamburgerHandler}>
                <div className='hamBar'></div>
                <div className='hamBar'></div>
                <div className='hamBar'></div>
            </div>
        </div>
    )
}