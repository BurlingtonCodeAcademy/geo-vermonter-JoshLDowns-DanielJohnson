// -------- Imports for various components and map functions---------//
import React from 'react';
import VTMap from './VTMap';
import Header from './Header';
import MapScore from './MapScore';
import ScoreForm from './ScoreForm'
import L from 'leaflet';
import leafletPip from 'leaflet-pip';
import borderData from './border';
import '../styles/main.css';

// ---- functional components that are rendered conditionally in App class ---- //
// ---- renders when player hits the guess prompt ---- //
function GuessCounty(props) {
  //array of counties to build the county list
  let countyList = ['Grand Isle', 'Franklin', 'Orleans', 'Essex', 'Chittenden', 'Lamoille', 'Caledonia', 'Washington', 'Addison', 'Orange', 'Rutland', 'Windsor', 'Bennington', 'Windham', 'Cancel'];
  //returns an ordered list, all elements are created by mapping the county list into li elements
  return (
    <div id='guess-list'>
      <ol>
        {countyList.map(county => (
          <li className='county-guess' key={county} onClick={props.guessHandler}>
            {county}
          </li>
        ))}
      </ol>
    </div>
  );
}

//  ---- renders at end of game to display stats ---- //
function EndGameStatus(props) {
  //returns a bar that covers top portion of of map, with the correct address, player score, and end game status
  return (
    <div id='end-game-status'>
      <div id='address'>
        <p className='end-game-text'>Town: {props.town} | County: {props.county} | Coordinates: {props.lat}/{props.lon}</p>
      </div>
      <div id='end-message'>
        {props.win === true ? <h3 id='final-text'>You Win!!!!</h3> : <h3>Coward!!! Try Harder!!!</h3>}
      </div>
      <div id='end-score'>
        <p className='end-game-text'>Final Score: {props.score}</p>
      </div>
      <ScoreForm score={props.score} />
    </div>
  )
}

// ---- renders when hamburger menu is clicked ---- //
function GameMenu(props) {
  return (
    <div id='game-menu'>
      <div id='leaders' className='menu-item' onClick={props.menuClickHandler}>
        <p className='menu-text'>Leaderboard</p>
      </div>
      <div id='how-to-play' className='menu-item' onClick={props.menuClickHandler}>
        <p className='menu-text'>How to Play</p>
      </div>
    </div>
  )
}

// ---- renders when leaderboard is clicked ----//
function LeaderBoard(props) {
  let scores = false;
  let scoreList = [];
  let newScoreList = [];
  //builds leaderboard from local storage
  if (window.localStorage.getItem('scores') === null) {
    scores = 'There are no scores yet!'
  } else {
    scores = JSON.parse(window.localStorage.getItem('scores'));
    //determines each players best score
    scores.forEach((playerScore) => {
      scoreList.push({ name: playerScore.name, score: Math.max(...playerScore.score) })
    })
    //if more than one score in storage, sorts the players best scores for display
    if (scoreList.length > 1) {
      let scoresArray = [];
      for (let player of scoreList) {
        scoresArray.push(player.score);
      }
      scoresArray.sort().reverse();
      scoresArray.forEach((score) => {
        for (let player of scoreList) {
          if (player.score === score) {
            newScoreList.push(player)
            scoreList.splice(scoreList.indexOf(player), 1)
            break;
          }
        }
      })
    }
  }

  //renders the list from the array of best scores
  return (
    <div id='leader-board'>
      <div id='leader-list-wrapper'>
        <div id='scrollable-leaders'>
          <ol>
            {scores === 'There are no scores yet!' ? <li>{scores}</li> : newScoreList.map((player) => {
              return (
                <li className='leader-board-player' key={player.name} >
                  Name: {player.name} ---- Score: {player.score}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      <button className='game-button' onClick={props.closeHandler}>Close</button>
    </div>
  )
}

// ---- renders the game instructions ---- //
function Instructions (props) {
  return (
    <div id='instructions'>
      <ul>
        <li>Press Start to play!</li>
        <li>The game will drop you in random location</li>
        <li>You can move around, to find hints, but you will lose points!</li>
        <li>To guess a county you are in, select Guess</li>
        <li>If you are wrong, you will lose 10 points, but can keep guessing</li>
        <li>Hit Give Up if you want to quit</li>
      </ul>
      <button className='game-button' onClick={props.closeHandler}>Close</button>
    </div>
  )
}
// ---- End of conditionally rendered functional components ---- //

// ---- React Class that handles all game logic, and renders all components ---- //
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainMap: {
        lat: 43.9,
        lon: -72.5,
        zoom: 7,
      },
      mapCoords: [],
      county: '',
      town: '',
      score: 100,
      status: '',
      count: 0,
      gameStarted: false,
      guess: false,
      win: false,
      menu: false,
      leaderBoardOption: false,
      instructions: false
    };
  }

  // ---- Function that produces a random point within a rectangle that surrounds VT ---- //
  ranLonLat = () => {
    let lonLatAr = [];
    let ranLon = -73.42613 + Math.random() * (-71.51023 - -73.42613);
    let ranLat = 42.73032 + Math.random() * (45.00756 - 42.73032);
    lonLatAr.push(ranLon);
    lonLatAr.push(ranLat);
    return lonLatAr;
  }

  // ---- Start button event handler ---- //
  start = () => {
    //builds a representation of VT as a variable for use with Leaflet-Pip
    let VT = L.geoJSON(borderData);

    //sets random point to start game, and makes sure it is within the bounds of VT with Pip
    let initialPoint = this.ranLonLat();
    let newPoint = leafletPip.pointInLayer(initialPoint, VT);
    while (newPoint.length === 0) {
      initialPoint = this.ranLonLat();
      newPoint = leafletPip.pointInLayer(initialPoint, VT);
    }
    //flips the array so it is in lat, lon format
    let flippedPoint = [initialPoint[1], initialPoint[0]]

    //gets county and town of random point, and builds initial state for gameplay
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${initialPoint[1]}&lon=${initialPoint[0]}&format=json`)
      .then(data => data.json())
      .then(jsonObj => {
        let town;
        //determines type of town that the point is in, and sets it to town variable
        if (jsonObj.address.city) {
          town = jsonObj.address.city;
        } else if (jsonObj.address.town) {
          town = jsonObj.address.town;
        } else if (jsonObj.address.village) {
          town = jsonObj.address.village;
        } else if (jsonObj.address.hamlet) {
          town = jsonObj.address.village;
        }

        this.setState({
          mainMap: {
            lat: flippedPoint[0],
            lon: flippedPoint[1],
            zoom: 18,
          },
          mapCoords: [flippedPoint],
          county: jsonObj.address.county,
          town: town,
          score: 100,
          status: 'Thinking',
          count: 0,
          gameStarted: true,
          leaderBoardOption: false,
          instructions: false,
          win: false
        });
      });
  };

  // ---- Guess Button event handler ---- //
  guess = () => {
    //sets guess state to true, which triggers render of county list
    this.setState({
      guess: true,
      leaderBoardOption: false,
      instructions: false
    });
  };

  // ---- Quit Button event handler ---- //
  quit = () => {
    //sets various game states that control how the end game bar is rendered, and zooms map
    //out slightly so that players can see the path they made
    this.setState({
      mainMap: {
        lat: this.state.mapCoords[0][0],
        lon: this.state.mapCoords[0][1],
        zoom: 15,
      },
      status: 'Quitter!',
      gameStarted: false,
      guess: false,
      score: -100,
      win: 'quit', 
      leaderBoardOption: false,
      instructions: false
    })
  };

  // ---- Guess Button event handler ---- //
  guessHandler = event => {
    //conditional statement for game logic
    if (event.target.textContent === 'Cancel') {
      this.setState({
        guess: false,
      });
    } else if (event.target.textContent + ' County' !== this.state.county) {
      this.setState({
        score: this.state.score - 10,
        status: 'Wrong!',
      });
    } else {
      //on win, sets various game states that control how the end game bar is rendered, and zooms map
      //out slightly so that players can see the path they made
      this.setState({
        mainMap: {
          lat: this.state.mapCoords[0][0],
          lon: this.state.mapCoords[0][1],
          zoom: 15,
        },
        status: 'Right!',
        gameStarted: false,
        guess: false,
        win: true,
        leaderBoardOption: false,
        instructions: false
      });
    }
  };

  // ---- Handles hamburger menu click event for modal window render ---- //
  hamburgerHandler = () => {
    let menuChoice;
    this.state.menu === false ? menuChoice = true : menuChoice = false;
    this.setState({
      menu: menuChoice,
      guess: false,
      leaderBoardOption: false,
      instructions: false
    })
  }

  // ---- Handles click event for leaderboard and instructions to render modal windows ---- //
  menuClickHandler = (event) => {
    if (event.target.id === 'leaders') {
      this.setState({
        leaderBoardOption: true,
        instructions: false,
        menu: false,
        win: false,
        guess: false
      })
    } else if (event.target.id === 'how-to-play') {
      this.setState({
        leaderBoardOption: false,
        instructions: true,
        menu: false,
        win: false,
        guess: false
      })
    }
  }

  // ---- Handles close button for leaderboard and instructions ---- //
  closeHandler = () => {
    this.setState({
      leaderBoardOption: false,
      instructions: false
    })
  }

  /* ---- This button is for testing only!
  clearButtonHandler = () => {
    window.localStorage.clear();
  }
  */

  // ---- Directional input event handler ---- //
  directionHandler = (event) => {
    if (event.target.id === 'north') {
      //adjusts lat or long based on direction
      let newLat = this.state.mapCoords[this.state.count][0] + 0.002;
      //sets variable to the current coordinate array
      let currentCoords = this.state.mapCoords;
      //creates new array, with the new coordinates added to original
      let newCoords = currentCoords.concat([[newLat, this.state.mapCoords[this.state.count][1]]]);
      this.setState({
        mainMap: {
          lat: newLat,
          lon: this.state.mapCoords[this.state.count][1],
          zoom: 18,
        },
        mapCoords: newCoords,
        score: this.state.score - 1,
        count: this.state.count + 1,
      });
      //same logic for each direction
    } else if (event.target.id === 'south') {
      let newLat = this.state.mapCoords[this.state.count][0] - 0.002;
      let currentCoords = this.state.mapCoords;
      let newCoords = currentCoords.concat([[newLat, this.state.mapCoords[this.state.count][1]]])
      this.setState({
        mainMap: {
          lat: newLat,
          lon: this.state.mapCoords[this.state.count][1],
          zoom: 18,
        },
        mapCoords: newCoords,
        score: this.state.score - 1,
        count: this.state.count + 1,
      });
    } else if (event.target.id === 'east') {
      let newLon = this.state.mapCoords[this.state.count][1] + 0.002;
      let currentCoords = this.state.mapCoords;
      let newCoords = currentCoords.concat([[this.state.mapCoords[this.state.count][0], newLon]])
      this.setState({
        mainMap: {
          lat: this.state.mapCoords[this.state.count][0],
          lon: newLon,
          zoom: 18,
        },
        mapCoords: newCoords,
        score: this.state.score - 1,
        count: this.state.count + 1,
      });
    } else if (event.target.id === 'west') {
      let newLon = this.state.mapCoords[this.state.count][1] - 0.002;
      let currentCoords = this.state.mapCoords;
      let newCoords = currentCoords.concat([[this.state.mapCoords[this.state.count][0], newLon]])
      this.setState({
        mainMap: {
          lat: this.state.mapCoords[this.state.count][0],
          lon: newLon,
          zoom: 18,
        },
        mapCoords: newCoords,
        score: this.state.score - 1,
        count: this.state.count + 1,
      });
    }
  }

  // ---- Render method to build page ---- //
  render() {
    return (
      <div id='body'>
        <Header hamburgerHandler={this.hamburgerHandler} />
        <div id='main-container'>
          <div id='map-score-control'>
            <MapScore score={this.state.score} gameStarted={this.state.gameStarted} directionHandler={this.directionHandler} status={this.state.status} />
          </div>
          <div id='main-map-container'>
            <VTMap lat={this.state.mainMap.lat} lon={this.state.mainMap.lon} zoom={this.state.mainMap.zoom} mapCoords={this.state.mapCoords} count={this.state.count} />
            {this.state.instructions === true ? <Instructions closeHandler={this.closeHandler} /> : null}
            {this.state.leaderBoardOption === true ? <LeaderBoard closeHandler={this.closeHandler} /> : null}
            {this.state.menu === true ? <GameMenu menuClickHandler={this.menuClickHandler} hamburgerMouseHandler={this.hamburgerMouseHandler} /> : null}
            {/*conditionally renders county list when guess state changes*/}
            {this.state.guess === true ? <GuessCounty guessHandler={this.guessHandler} /> : null}
            {/*conditionally renders end game display when win state changes*/}
            {this.state.win === true || this.state.win === 'quit' ? <EndGameStatus town={this.state.town} county={this.state.county.slice(0, this.state.county.lastIndexOf(' '))} lat={this.state.mapCoords[0][0].toPrecision(4)} lon={this.state.mapCoords[0][1].toPrecision(4)} win={this.state.win} score={this.state.score} /> : null}
            {/*game menu buttons*/}
            <div id='menuBar'>
              <button className='game-button' disabled={this.state.gameStarted} onClick={this.start}>
                Start!
              </button>
              <button className='game-button' disabled={!this.state.gameStarted} onClick={this.guess}>
                Guess
              </button>
              <button className='game-button' disabled={!this.state.gameStarted} onClick={this.quit}>
                Give Up
              </button>
            </div>
          </div>
        </div>
        {/*Clear Storage Testing Button ---- <button onClick={this.clearButtonHandler}>Clear Storage</button>*/}
      </div>
    );
  }
}

export default App;
