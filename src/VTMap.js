import React from 'react'
import { Map, Marker, Popup, TileLayer, Polygon, Polyline } from 'react-leaflet'
import borderData from './border'
import './map.css'

const latLongData = borderData.geometry.coordinates[0].map((coord) => {
    let lat = coord[1];
    let long = coord[0];
    return [lat, long]
})

class VTMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 43.7986,
            lon: -72.7117,
            zoom: 7,
            mapCoords: []
        }
    }

    componentWillUpdate() {
        console.log(this.state.mapCoords)
        console.log(this.props.mapCoords)
    }

    componentDidUpdate() {
        //console.log(this.state.mapCoords)
        //console.log(this.props.mapCoords)
    }

    componentDidMount() {
        console.log(this.props.mapCoords)
        this.setState({
            mapCoords: this.props.mapCoords
        })
    }

    render() {
        let myLine = this.state.mapCoords.length > 1 ?<Polyline color="blue" positions={this.state.mapCoords} /> : null
        return (
            <Map center={[this.props.lat, this.props.lon]} zoom={this.props.zoom} zoomControl={false} scrollWheelZoom={false} touchZoom={false} doubleClickZoom={false} dragging={false}>
                <TileLayer
                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                <Marker position={this.props.mapCoords[this.props.count]} />
                <Polygon color="purple" positions={latLongData} />
                {myLine}
            </Map>
        )
    }

}

export default VTMap;