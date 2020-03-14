// ---- Imports for map functions ---- //
import React from 'react'
import { Map, TileLayer, Polygon, Polyline } from 'react-leaflet'
import borderData from './border'
import './map.css'

// ---- flips coordinate data from geoJSON object for use in react-leaflet ---- //
const latLongData = borderData.geometry.coordinates[0].map((coord) => {
    let lat = coord[1];
    let long = coord[0];
    return [lat, long]
})

// ---- Map class to render map based on location props ---- //
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
    //Sets the mapCoors in state on update (for building the Polyline)
    componentDidUpdate() {
        if (this.state.mapCoords.length !== this.props.mapCoords.length){
            this.setState({
                mapCoords: this.props.mapCoords
            })
        }
    }
    // ---- Renders map, and map components based on state and props ---- //
    render() {
        return (
            <Map center={[this.props.lat, this.props.lon]} zoom={this.props.zoom} zoomControl={false} scrollWheelZoom={false} touchZoom={false} doubleClickZoom={false} dragging={false}>
                <TileLayer
                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                {/*Polyline shows player the path they have taken to try and make a guess*/}
                <Polyline color="red" dashArray="15 10" weight="8" positions={this.state.mapCoords} />
                {/*Builds a shape that represents VT using flipped data from geoJSON object*/}
                <Polygon color="purple" positions={latLongData} />
            </Map>
        )
    }

}

export default VTMap;