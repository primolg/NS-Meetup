import React, { useState } from "react";
//other
import { dateToTime, stationSorter, cutWord } from "./../trainLookup/plannerFunctions";

const TripLegs = ({tripLegs}) => {

    //splits trip legs into main and side stops.
    let legs;
    if (tripLegs) legs = stationSorter(tripLegs)
    const [legScroll, setLegScroll] = useState(true)
    
    return legs ? (
        <div id="trip-legs">
                    {legs.mainStops.map(station => {
                        const inBetweenStations = legs.sideStops.splice(0, 1);
                        const mainStation = station.name.length > 16 ? cutWord(station.name, 14) : station.name;
                        return (
                            <div key={mainStation}>
                                <div className="main-station">
                                    <h3>{mainStation}</h3>
                                    <h3 id="main-station-time">{station?.plannedDepartureDateTime ? dateToTime(station.plannedDepartureDateTime) : dateToTime(station.plannedArrivalDateTime)}</h3>
                                </div>
                                {inBetweenStations.length ? 
                                    <div className="inbetween-stations" onClick={() => {if (inBetweenStations[0].length > 3) setLegScroll(!legScroll)}}>
                                        {inBetweenStations[0].length ?
                                            <div className={(inBetweenStations[0].length > 3) && legScroll ? "inbetween-stations-inner" : ""}>
                                                {inBetweenStations[0].map(tinyStation => {
                                                    //add "no in between alternative"
                                                    const name = tinyStation.name.length > 23 ? cutWord(tinyStation.name, 23) : tinyStation.name
                                                    return (
                                                        <div id="inbetween-station" key={tinyStation.name}>
                                                            <h5>{name}</h5>
                                                            <h5>{dateToTime(tinyStation?.plannedDepartureDateTime ? tinyStation?.plannedDepartureDateTime : tinyStation.plannedArrivalDateTime)}</h5>
                                                        </div>
                                                        )
                                                    })}
                                            </div> :
                                            <div id="inbetween-station">
                                                <h5>no stops</h5>
                                            </div>
                                        }
                                    </div> :
                                    <></>}
                            </div>
                        )
                    })}
                </div>
    ) : (
        <></>
    )
}


export default TripLegs;

