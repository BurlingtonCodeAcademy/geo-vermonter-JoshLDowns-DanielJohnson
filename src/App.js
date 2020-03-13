import React from 'react';
import VTMap from './VTMap';
import Header from './Header';
import MapScore from './MapScore';
import L from 'leaflet';
import leafletPip from 'leaflet-pip';
import borderData from './border';
import './map.css';

function ranLonLat() {
  let lonLatAr = [];
  let ranLon = -73.42613 + Math.random() * (-71.51023 - -73.42613);
  let ranLat = 42.73032 + Math.random() * (45.00756 - 42.73032);
  lonLatAr.push(ranLon);
  lonLatAr.push(ranLat);
  return lonLatAr;
}

let VT = L.geoJSON(borderData);
let initialPoint = ranLonLat();
let newPoint = leafletPip.pointInLayer(initialPoint, VT);
while (newPoint.length === 0) {
  initialPoint = ranLonLat();
  newPoint = leafletPip.pointInLayer(initialPoint, VT);
}

function GuessCounty(props) {
  let countyList = ['Grand Isle', 'Franklin', 'Orleans', 'Essex', 'Chittenden', 'Lamoille', 'Caledonia', 'Washington', 'Addison', 'Orange', 'Rutland', 'Windsor', 'Bennington', 'Windham', 'Cancel'];

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

function EndGameStatus(props) {
    return (
        <div id='end-game-status'>
            <div id='address'>
                <p className='end-game-text'>Town: {props.town}</p>
                <p className='end-game-text'>County: {props.county}</p>
                <p className='end-game-text'>Coordinates: {props.lat}/{props.lon}</p>
            </div>
            <div id='end-message'>
                {props.win === true ? <h3 id='final-text'>You Win!!!!</h3> : <h3>Coward!!! Try Harder!!!</h3>}
            </div>
            <div id='end-score'>
                <p className='end-game-text'>Final Score: {props.score}</p>
            </div>
        </div>
    )
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainMap: {
        lat: 43.9,
        lon: -72.5,
        zoom: 7,
      },
      mapCoords: [[initialPoint[1], initialPoint[0]]],
      county: '',
      town: '',
      score: 100,
      status: '',
      count: 0,
      gameStarted: false,
      guess: false,
      win: false
    };
  }

  start = () => {
    this.setState({
      mainMap: {
        lat: this.state.mapCoords[0][0],
        lon: this.state.mapCoords[0][1],
        zoom: 18,
      },
      gameStarted: true,
    });
  };

  guess = () => {
    this.setState({
      guess: true,
    });
  };

  quit = () => {
    this.setState({
        score: 'Quit!',
        win: 'quit'
    })
  };

  guessHandler = event => {
    console.log(this.state.county);
    console.log(event.target.textContent);
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
      this.setState({
        mainMap: {
          lat: 43.9,
          lon: -72.5,
          zoom: 7,
        },
        status: 'Right!',
        gameStarted: false,
        guess: false,
        win: true
      });
    }
    this.setState({
      countyGuess: event.target.textContent,
    });
  };

  goNorth = () => {
    let newLat = this.state.mapCoords[this.state.count][0] + 0.002;
    let currentCoords = this.state.mapCoords;
    currentCoords.push([newLat, this.state.mapCoords[this.state.count][1]]);
    this.setState({
      mainMap: {
        lat: newLat,
        lon: this.state.mapCoords[this.state.count][1],
        zoom: 18,
      },
      mapCoords: currentCoords,
      score: this.state.score - 1,
      count: this.state.count + 1,
    });
  };

  goSouth = () => {
    let newLat = this.state.mapCoords[this.state.count][0] - 0.002;
    let currentCoords = this.state.mapCoords;
    currentCoords.push([newLat, this.state.mapCoords[this.state.count][1]]);
    this.setState({
      mainMap: {
        lat: newLat,
        lon: this.state.mapCoords[this.state.count][1],
        zoom: 18,
      },
      mapCoords: currentCoords,
      score: this.state.score - 1,
      count: this.state.count + 1,
    });
  };

  goEast = () => {
    let newLon = this.state.mapCoords[this.state.count][1] + 0.002;
    let currentCoords = this.state.mapCoords;
    currentCoords.push([this.state.mapCoords[this.state.count][0], newLon]);
    this.setState({
      mainMap: {
        lat: this.state.mapCoords[this.state.count][0],
        lon: newLon,
        zoom: 18,
      },
      mapCoords: currentCoords,
      score: this.state.score - 1,
      count: this.state.count + 1,
    });
  };

  goWest = () => {
    let newLon = this.state.mapCoords[this.state.count][1] - 0.002;
    let currentCoords = this.state.mapCoords;
    currentCoords.push([this.state.mapCoords[this.state.count][0], newLon]);
    this.setState({
      mainMap: {
        lat: this.state.mapCoords[this.state.count][0],
        lon: newLon,
        zoom: 18,
      },
      mapCoords: currentCoords,
      score: this.state.score - 1,
      count: this.state.count + 1,
    });
  };

  componentDidMount() {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${initialPoint[1]}&lon=${initialPoint[0]}&format=json`)
      .then(data => data.json())
      .then(jsonObj => {
        let town;
        if (jsonObj.address.city) {
          town = jsonObj.address.city;
        } else if (jsonObj.address.town) {
          town = jsonObj.address.town;
        } else if (jsonObj.address.village) {
          town = jsonObj.address.village;
        } else if (jsonObj.address.hamlet) {
          town = jsonObj.address.village;
        }
        console.log(town);
        this.setState({
          county: jsonObj.address.county,
          town: town,
        });
      });
  }

  componentDidUpdate() {
    console.log(this.state.countyGuess);
  }

  render() {
    return (
      <div id='body'>
        <Header />
        <div id='main-container'>
          <div id='map-score-control'>
            <MapScore score={this.state.score}/>
            <div id='directionBtns'>
              <div id='north-wrapper'>
                <button className='direction-button' disabled={!this.state.gameStarted} onClick={this.goNorth}>North</button>
              </div>

              <div id='east-west-wrapper'>
                <button className='direction-button' disabled={!this.state.gameStarted} onClick={this.goWest}>West</button>
                <button className='direction-button' disabled={!this.state.gameStarted} onClick={this.goEast}>East</button>
              </div>

              <div id='south-wrapper'>
                <button className='direction-button' disabled={!this.state.gameStarted} onClick={this.goSouth}>South</button>
              </div>
            </div>
            <div id='status-bar'>
              <p id='status'>Status: {this.state.status}</p>
            </div>
          </div>

          <div id='main-map-container'>
            <VTMap lat={this.state.mainMap.lat} lon={this.state.mainMap.lon} zoom={this.state.mainMap.zoom} mapCoords={this.state.mapCoords} count={this.state.count} />
            {this.state.guess === true ? <GuessCounty guessHandler={this.guessHandler} /> : null}
            {this.state.win === true || this.state.win ==='quit' ? <EndGameStatus town={this.state.town} county={this.state.county} lat={this.state.mapCoords[0][0].toPrecision(4)} lon={this.state.mapCoords[0][1].toPrecision(4)} win={this.state.win} score={this.state.score} /> : null}
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
      </div>
    );
  }
}

export default App;
