import React, {Component} from 'react';
import ReactDOM from 'react-dom'


export default class MapContainer extends Component {

  state = {
    locations: [
      { name: "Ensimag", location: {lat: 45.1931492, lng: 5.7674826999999596} },
      { name: "Atos", location: {lat: 45.1539228, lng: 5.7207387999999355} },
      { name: "Museum", location: {lat: 45.1949173, lng: 5.732278299999962} },
      { name: "Stadium", location: {lat: 45.1874353, lng: 5.740127799999982} },
      { name: "Mall", location: {lat: 45.158158, lng: 5.731906999999978} }
    ],
    query: '',
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow()
  }

  componentDidMount() {
    this.loadMap()

  }

  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {lat: 45.188529, lng: 5.724523999999974},
        zoom: 12,
        mapTypeId: 'roadmap'
      })

      this.map = new maps.Map(node, mapConfig)
      this.addMarkers()
    }

  }

  addMarkers = () => {
    const {google} = this.props
    let {infowindow} = this.state
    const bounds = new google.maps.LatLngBounds();

    this.state.locations.forEach( (location, ind) => {
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.name
      });

      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

  populateInfoWindow = (marker, infowindow) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent(`<h3>title</h3><h4>user likes it</h4>`);
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  render() {
    const {markers} = this.state
    return (
      <div>
        <div className="container">
          <div className="text-input">
            <ul className="location">{
              markers.map((m, i) =>
                (<li key={i}>{m.title}</li>))
            }</ul>
          </div>
          <div role="application" className="map" ref="map">
            loading map...
          </div>
        </div>
      </div>
    )
  }
}