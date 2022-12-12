import React, {useState, useEffect} from "react";
import axios from "axios";
//components
import SingleTrip from "../singleTrip/SingleTrip";
//other
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";
import { minToHrString, dateToTime, listLocations, nsApi } from "./plannerFunctions";


const TripsList = ({prop}) => {
    
    const [trips, setTrips] = useState(undefined);
    const [currentTrip, setCurrentTrip] = useState(undefined);
    const [stationLocations, setStationLocations] = useState(undefined);
    const [errorMsg, setErrorMsg] = useState(false);

    function show (idx) {
        trips[idx].arrivalStationCode = prop.arrivalStation;
        setCurrentTrip(trips[idx]);
        setTimeout(()=>{
            document.getElementById('single-trip').classList.toggle('active');
            setTimeout(()=>{
                document.getElementById('background-fade').classList.toggle('active')
            }, 300
            )
        }, 1);
    }

    useEffect(() => {
        //GET trips
            axios.get(`https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?fromStation=${prop.departureStation}&toStation=${prop.arrivalStation}&dateTime=${prop.rfcTime}&searchForArrival=${prop.arrivalBool}`, nsApi
            ).then(response => {
                setTrips(response.data.trips)
            }).catch(error => {
                console.log("Error code:",error.response.data.code, " Message:", error.response.data.message)
                setErrorMsg(true)
            })
        //GET station locations (displayed in single trips)
            axios.get(`https://gateway.apiportal.ns.nl/places-api/v2/places?limit=150&radius=1000&lang=nl&details=false&station_code=${prop.arrivalStation}`, nsApi
            ).then(response => {
                setStationLocations(listLocations(response.data.payload));
            })
    }, [])

        return trips && stationLocations? (
            <div className="trip-list">
                <div>
                    <SingleTrip 
                        trip={currentTrip}
                        locations={stationLocations}
                    />
                </div>
                {trips.map(trip => {
                    const travelTime = minToHrString(trip.actualDurationInMinutes);
                    const departureTime = dateToTime(trip.legs[0].origin.plannedDateTime);
                    const arrivalTime = dateToTime(trip.legs[trip.legs.length - 1].destination.plannedDateTime);
                    return (
                            <div onClick={()=> show(trip.idx)} className="single-trip" key={trip.idx}>
                                <div className="travel-time">
                                    <div>
                                        {departureTime} - {arrivalTime}
                                    </div>
                                    <div>
                                        {travelTime}
                                    </div>
                                </div>
                                <div className="travel-time">
                                    <div>
                                        {trip.transfers} {trip.transfers === 1 ? " transfer" : " transfers"} 
                                    </div>
                                </div>
                            </div>
                    )
                })}
            </div>
        ) : (
                <div id="loading-wheel">
                    <h4>{!errorMsg ? <TailSpin stroke="#062655" strokeWidth="2" /> : "No trips found, please check search values."}</h4>
                </div>
        )
}


export default TripsList;



