import React, { useState, useEffect } from "react";
//components
import Map from "./Map";
//other
import {cutWord} from "../../trainLookup/plannerFunctions";

const Locations = ({locations, singleLocation, rerender}) => {
    const [meetupLocation, setMeetupLocation] = useState(undefined)
    const [activeMap, setActiveMap] = useState(undefined)
    
    useEffect(() => {
        if (meetupLocation){
            singleLocation[0] = meetupLocation
            rerender()
        } else {
            setMeetupLocation(locations[0])
        }
    }, [locations, meetupLocation, singleLocation])
    
    return (
        <div id="locations">
            <h3>Meetup at</h3>
            <div id="locations-list">
                {locations.map(location => {
                    const locationInfo = {
                        address: location.name,
                        lat: location.lat,
                        lng: location.lng,
                    };
                    
                    return (
                        <div key={location.name}>
                            <div className="location" id={location === meetupLocation ? "location" : ""} key={location.name}>
                                <div id="name-checkbox" onClick={()=>{setMeetupLocation(location)}}>
                                    <div className={"box-check " + (location === meetupLocation ? "checked-box" : "")}></div>
                                    <h3>{location.name.length > 16 ? cutWord(location.name, 16) : location.name}</h3>
                                </div>
                                {activeMap === location.name ?
                                <h3 id="map-flip" onClick={()=>{setActiveMap(undefined)}}>×</h3>
                                : <h3 id="map-flip" onClick={()=>{setActiveMap(location.name)}}>+</h3>
                            }
                            </div>
                            {activeMap === location.name ? 
                                <Map 
                                    location={locationInfo}
                                    defaultZoom={17}
                                />
                                : <></>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


export default Locations;

