import React, {useState, useEffect} from "react";
import axios from "axios";
//components
import TripsList from "./TripsList";
//other
import DatePicker from 'react-datepicker'
import {nsApi, timesArray, timeSorter} from "./plannerFunctions"
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

const HomePage = () => {
    //time grab
    const date = new Date();
    const time = (date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours()) 
    + ":" 
    + (date.getMinutes().toString().length === 1 ? "0"+date.getMinutes() : date.getMinutes());
    //form setters
    const [allStations, setAllStations] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(date);
    const [selectedTime, setSelectedTime] = useState(time);
    const [arrivalBool, setArrivalBool] = useState(false);
    const [arrivalStation, setArrivalStation] = useState(undefined);
    const [departureStation, setDepartureStation] = useState(undefined);
    const [submitBool, setSubmitBool] = useState(false);

    const [errorMsg, setErrorMsg] = useState(false);
    
    //object to be populated alongside station options in form with station codes 
    //and their full length name. Example: {"Amsterdam Centraal" : "ASD"}
    let stationCodes = {}
    
    if (allStations){
        for (let i = 0; i < allStations.length; i++){
            const station = allStations[i]
            if (station.namen && station.land==="NL"){
                stationCodes[station.namen.lang.toLowerCase()] = station.code
            }
        }
    }

    //items to be passed into tripsList
    const lookupItems = {
        "rfcTime": timeSorter(selectedDate, selectedTime),
        "arrivalBool": arrivalBool,
        "stations": allStations,
        "departureStation": departureStation ? stationCodes[departureStation.toLowerCase()] : "",
        "arrivalStation": arrivalStation ?stationCodes[arrivalStation.toLowerCase()] : "",
    }

    //on click to renew tripsList
    function setSearchBool () {
        setSubmitBool(false);
        setTimeout(()=>{
            setSubmitBool(true)
        }, 1)
    }


    function swapStations(){
        const station1 = arrivalStation;
        setArrivalStation(departureStation);
        setDepartureStation(station1);
    }


    useEffect(() => {
        axios.get('https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations', nsApi
        ).then(response => {
            setAllStations(response.data.payload)
        }).catch(error => {
            console.log("Error code:",error.response.data.code, " Message:", error.response.data.message)
            setErrorMsg(true)
        })
    }, [])

    if (allStations){
        return (
            <div id="train-planner">
                <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css" />
                <div>
                    <div id="form">
                        <div id="stations-and-swap">
                            <div id="stations">
                                <input list="station1" className="station-input" id="departureStation" placeholder="from" onChange={(event)=>{setDepartureStation(event.target.value ? event.target.value : "")}} value={departureStation ? departureStation : ""}></input>
                                    <datalist id="station1">
                                        {allStations.map(station => {
                                            if (station.namen && station.land==="NL"){
                                                stationCodes[station.namen.lang] = station.code
                                                return (
                                                    <option key={station.code}>{station.namen.lang}</option>
                                                    )
                                                }
                                            })}
                                    </datalist>
                                <input list="station2" className="station-input" id="arrivalStation" placeholder="to" onChange={(event)=>{setArrivalStation(event.target.value ? event.target.value : null)}} value={arrivalStation ? arrivalStation : ""}></input>
                                <datalist id="station2">
                                    {allStations.map(station => {
                                        if (station.namen && station.land==="NL"){
                                            return (
                                                <option key={station.EVACode}>{station.namen.lang}</option>
                                                )
                                            }
                                        })}
                                </datalist>
                            </div>
                            <h1 onClick={swapStations}>⇅</h1>
                        </div>

                        <div className="date-and-time">
                            <select id="time-selector" className="selector" onChange={(event)=>{setSelectedTime(event.target.value)}}>
                                <option>{selectedTime}</option>
                                    {timesArray.map(time => {
                                        return (
                                            <option key={time}>{time}</option>
                                            )
                                        })}
                            </select> 
                            <DatePicker className="selector2" selected={selectedDate} onChange={(event)=>{setSelectedDate(event)}}/>
                        </div>
                        <div className="arrival-departure-submit-btn">
                            <div className="dep-arr">
                                <h3 className={arrivalBool ? "selected-arrival-inactive arrivalBoolbtn" : "selected-arrival-active arrivalBoolbtn"} onClick={()=>setArrivalBool(false)}>departure</h3>
                                <h3 className={arrivalBool ? "selected-arrival-active arrivalBoolbtn" : "selected-arrival-inactive arrivalBoolbtn"} onClick={()=>setArrivalBool(true)}>arrival</h3>
                            </div>
                            <div className="submit-btn" onClick={setSearchBool}>
                                <h3>search</h3>
                            </div>
                        </div>
                        
                    </div>
                    {submitBool ? 
                        <TripsList 
                            prop = {lookupItems}
                        /> :
                        <></>
                    }
                </div>
            </div>   
        );
    } else {
        return (
            <div id="loading-wheel">
                <h4>{!errorMsg ? <TailSpin stroke="#062655" strokeWidth="2" /> : "No trips found, please check search values."}</h4>
            </div>
        )
    }
};

export default HomePage;



