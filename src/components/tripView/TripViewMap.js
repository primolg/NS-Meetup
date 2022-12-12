import React from "react";
import GoogleMapReact from 'google-map-react'
//components
import LocationPin from "./TripViewPin";

const Map = ({location, defaultZoom}) => {
    return (
        <div className="map" id={location.address}>
            <div className="google-map">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_G_KEY }}
                    defaultCenter={location}
                    defaultZoom={defaultZoom}
                >
                    <LocationPin
                        lat={location.lat}
                        lng={location.lng}
                        text={location.address}
                    />
                </GoogleMapReact>
            </div>
        </div>
    )
}


export default Map;

