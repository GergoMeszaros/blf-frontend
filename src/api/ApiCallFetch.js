import {useEffect, useState} from "react";
import axios from "axios";

const useFetchData = (url) => {

    const [elements, setElements] = useState([]);

    useEffect(() => {

        axios
            .get(url)
            .then((response) => setElements(response.data))
            .catch((error) => console.log(error))
    }, [url])

    return elements;
}

export default useFetchData;