import React from 'react'
//import L from 'leaflet'
import leaflePip from '@mapbox/leaflet-pip'
import {Map, Marker, Popup, TileLayer, Polygon} from 'react-leaflet'
import {icon} from 'leaflet'
import borderData from './border'
import './map.css'



console.log(borderData.geometry.coordinates)
const latLongData = borderData.geometry.coordinates.map((coord)=>{
    console.log(coord);
    let lat= coord[1];
    let long = coord[0];
    return [lat,long]
})
//console.log(latLongData);

class VTMap extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            lat: 43.7986,
            lon: -72.7117,
            zoom: 7,
            currentMarker: ''
        }
    }
    

    render () {
        

        return (
            <Map center={[this.state.lat, this.state.lon]} zoom={this.state.zoom}>
                <TileLayer
                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                <Polygon color="purple" /*data={borderData}*/ positions={latLongData} />
            </Map>
        )
    }

}

export default VTMap;