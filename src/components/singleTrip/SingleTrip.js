import React, { useEffect, useState } from "react";
//components
import TripLegs from "./TripLegs";
import Locations from "./locations/Locations";
import TextCopy from "./TextCopy";
//functions
import { createLink } from "../trainLookup/plannerFunctions";

const SingleTrip = ({trip, locations}) => {

    const [singleLocation] = useState([locations[0]]);
    const [tripLink, setTripLink] = useState(undefined);
    const [update, setUpdate] = useState(false)

    //to close slide out component when clicked outside of component.
    function show() {
        document.getElementById('background-fade').classList.toggle('active')
        setTimeout(()=>{
            document.getElementById('single-trip').classList.toggle('active');
            setTripLink(undefined);
        }, 200
        );
    }

    //function to be called inside of locations so this component & the link it passes as tripLink updates.
    function rerender(){
        setUpdate(!update)
    }

    useEffect(() => {
        if (trip) setTripLink(createLink(trip, singleLocation[0]))
    }, [trip, singleLocation, locations, update])

    return trip ? (
        <div id="single-trip">
            <div onClick={show} id="background-fade"></div>
            <div id="sidebar">
                <TripLegs 
                    tripLegs = {trip.legs}
                    rerender = {rerender}
                />
                <Locations
                    locations = {locations}
                    singleLocation = {singleLocation}
                    rerender = {rerender}
                /> 
                {tripLink ? 
                    <TextCopy
                        link = {tripLink}    
                    /> 
                    : <></>
                }
            </div>
        </div>
    ) : (
        <></>
    )
}


export default SingleTrip;