import React, {useContext, useEffect, useState} from "react";
import AdminNavbar from "../../component/AdminNavbar";
import TableCreator from "../../component/TableCreator";
import {useParams} from "react-router";
import {UtilContext} from "../../context/UtilContext";
import {SeasonContext} from "../../context/SeasonContext";
import SeasonAdmin from "./SeasonAdmin";
import ActualLeaguesContext, {ActualLeagueContext} from "../../context/ActualLeaguesContext";
import {func} from "prop-types";

function ElementsAdmin() {

    const {
        requestGet, requestPost, requestPostSearch, elements,
        fieldNamesToIgnore, dropdownFields
    } = useContext(UtilContext);
    const {seasons} = useContext(SeasonContext);
    const {actualLeagues} = useContext(ActualLeagueContext);
    const {service} = useParams();
    const [inputs, setInputs] = useState({});
    const [seasonId, setSeasonId] = useState(null);
    const urlForElements = `http://localhost:8091/${service}`;
    const urlForSearchBySeasonAndInput = urlForElements + `/search/`;


    useEffect(() => {
        requestGet(urlForElements)
    }, [])

    const handleInputFieldChange = (event) => {
        const value = event.target.value;
        setInputs({...inputs, [event.target.name]: value});
    }

    function inputFieldCreator() {

        if (elements.length > 0) {

            return Object.keys(elements[0]).map((fieldName, index) => (

                !fieldNamesToIgnore.includes(fieldName) ?

                    <div className="inputFieldPairsDiv" key={index}>
                        <label className="inputFieldTitle">{fieldName}</label>
                        <input className="inputField" type="text" name={fieldName}
                               placeholder={fieldName}
                               onChange={handleInputFieldChange}
                        />
                    </div> : null

            ))
        }
    }

    const dropDownHandler = (event) => {
        event.preventDefault()

        let getId = Number(event.target.children[event.target.selectedIndex].dataset.id);
        setSeasonId(getId);

        requestPostSearch(urlForSearchBySeasonAndInput + getId);
    }

    const handleSearchFieldChange = (event) => {
        event.preventDefault();
        let searchFieldValue = {"input": event.target.value};

        if (seasonId !== null) {
            requestPostSearch(urlForSearchBySeasonAndInput + seasonId, searchFieldValue)
        } else {
            requestPostSearch(urlForSearchBySeasonAndInput, searchFieldValue)
        }
    }

    function dropdownCreator(requiredElements) {
        return requiredElements.map((element, index) => (
            <option key={index} data-id={element.id}>{element.name}</option>
        ))
    }

    function createOptionals() {

        if (elements.length > 0) {

            return Object.keys(elements[0]).map((fieldName, index) => (
                dropdownFields.includes(fieldName) ?
                    <div className="inputFieldPairsDiv" key={index}>
                        <label className="text">{fieldName} :</label>
                        <select onChange={handleInputFieldChange} name={fieldName}>
                            <option selected disabled hidden>Válassz</option>
                            {dropdownCreator(actualLeagues)}
                        </select>
                    </div> : null
            ))
        }
    }

    console.log(inputs)
    if (service === "season") {
        return (
            <SeasonAdmin/>
        )

    } else {

        return (
            <React.Fragment>
                <AdminNavbar/>
                <div className="inputContainer">
                    <form className="inputFieldsDiv">{createOptionals()}{inputFieldCreator()}</form>
                    <button className={"inputSubmitButton"}
                            onClick={() => requestPost(urlForElements, inputs)}>Hozzáadás
                    </button>
                </div>
                <div>
                    <label className="text">Válassz egy szezont: </label>
                    <select onChange={dropDownHandler}>
                        <option selected disabled hidden>Válassz</option>
                        {dropdownCreator(seasons)}</select>
                </div>
                <div>
                    <input type="text" onChange={handleSearchFieldChange} placeholder="Keresés"/>
                </div>
                <TableCreator inputObjects={elements} prefix="currentElement"/>
            </React.Fragment>
        )
    }
}

export default ElementsAdmin;
