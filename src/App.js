import React from 'react';
import VTMap from './VTMap';
import Header from './Header';
import MapScore from './MapScore';
import L from 'leaflet';
import leafletPip from 'leaflet-pip';
import borderData from './border';
//import counties from './counties.json';

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

function guessCounty() {
  let countyList = ['Grand Isle', 'Franklin', 'Orleans', 'Essex', 'Chittenden', 'Lamoille', 'Caledonia', 'Washington', 'Addison', 'Orange', 'Rutland', 'Windsor', 'Bennington', 'Windham'];

  return (
    <ol>
      {countyList.map(county => (<li>{county}</li>))}
    </ol>
  );
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
      score: 100,
      count: 0,
      gameStarted: false,
      guess: false,
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
    console.log('Quit');
  };

  goNorth = () => {
    let newLat = this.state.mapCoords[this.state.count][0] + 0.002;
    let currentCoords = this.state.mapCoords;
    currentCoords.push([newLat, this.state.mapCoords[this.state.count][1]]);
    this.setState(prevState => ({
      mainMap: {
        lat: newLat,
        lon: prevState.mapCoords[prevState.count][1],
        zoom: 18,
      },
      mapCoords: currentCoords,
      score: prevState.score - 1,
      count: prevState.count + 1,
    }));
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
        this.setState({
          county: jsonObj.address.county,
        });
      });
  }

  render() {
    console.log(this.state.county);
    console.log(this.state.countyList);
    return (
      <div id='body'>
        <Header />
        <div id='main-container'>
          <div id='map-score-control'>
            <MapScore />
            <div id='directionBtns'>
              <button disabled={!this.state.gameStarted} onClick={this.goNorth}>
                North
              </button>
              <button disabled={!this.state.gameStarted} onClick={this.goSouth}>
                South
              </button>
              <button disabled={!this.state.gameStarted} onClick={this.goEast}>
                East
              </button>
              <button disabled={!this.state.gameStarted} onClick={this.goWest}>
                West
              </button>
            </div>
          </div>

          <div>
            <VTMap lat={this.state.mainMap.lat} lon={this.state.mainMap.lon} zoom={this.state.mainMap.zoom} mapCoords={this.state.mapCoords} count={this.state.count} />
            <div id='countyListWrapper'>
              <ol id='countyList'></ol>
            </div>
            <div id='menuBar'>
              <button className='game-button' onClick={this.start}>
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
