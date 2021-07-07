import React from 'react';

// ---- Form to handle score submission at end of game ---- //
class ScoreForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            id: 'scores',
            scores: [],
            submitted: false
        }
    }
    //Builds name while typing
    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }
    //attachs name to score, and adds to local storage
    handleScoreSubmit = (event) => {
        event.preventDefault();
        //makes sure you entered a name
        if (this.state.value === '') {
            alert('You must submit a name!')
        } else {
            //if no local storage yet, creates an empty array under the key of scores
            if (window.localStorage.getItem(`${this.state.id}`) === null) {
                window.localStorage.setItem(`${this.state.id}`, JSON.stringify(this.state.scores));
            }
            //value to check if player already submitted a score
            let nameExists = false;
            //creates an array of all the score records from local storage
            let scoreArray = JSON.parse(window.localStorage.getItem(this.state.id));
            //checks to see if the current player already exists in storage
            scoreArray.forEach((playerScore) => {
                if (playerScore.name === this.state.value) {
                    nameExists = true;
                }
            })
            //if they don't exist, it creats a new object for them, and adds it to the scores array
            if (nameExists === false) {
                let newScores = scoreArray.concat({ name: `${this.state.value}`, score: [this.props.score] });
                window.localStorage.setItem(this.state.id, JSON.stringify(newScores));
            //otherwise, it pushes their new score to their current array of scores
            } else {
                scoreArray.forEach((playerScore) => {
                    if (playerScore.name === this.state.value) {
                        playerScore.score.push(this.props.score);
                    }
                })
                window.localStorage.setItem(this.state.id, JSON.stringify(scoreArray));
            }
            this.setState({
                submitted: true
            })
        }
    }

    //Renders the form
    render() {
        return (
            <div id='score-form'>
                <p className='end-game-text'>Record Your Score!</p>
                <form id='name-form' onSubmit={this.handleScoreSubmit}>
                    <label htmlFor='name'>Name:</label>
                    <input type='text' name='name' id='input-name' value={this.state.value} onChange={this.handleChange} />
                    <input type='submit' value='Submit' id='submit-button' className='game-button' disabled={this.state.submitted} />
                </form>
            </div>
        )
    }

}

export default ScoreForm;