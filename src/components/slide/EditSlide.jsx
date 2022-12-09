import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { getSlideTypes } from "../../fetch/slideFetch"

import "./Slide.css";

export default function EditSlide({selectedIndex, listOfSlides})
{
    //console.log({selectedIndex, listOfSlides})
    const [listOfSlideTypes, setListofSlideTypes] = useState([]);
    const [typeName, setTypeName] = useState();

    const len = listOfSlides.length;

    useEffect(() => {
        getSlideTypes()
        .then((data) => {
            setListofSlideTypes(data);
        })
        .catch((err) => {
            console.log(err);
        })

    },[])

    const handleChange = (e) => {
        setTypeName(listOfSlides[selectedIndex]["type.types_name"]);
        
    }

    return (
        <div className="boxSlide3">
            {len > 0 &&
                <div>
                    <Button style={{marginTop: "5px"}}>Save changes</Button>
                    <Form.Select value={listOfSlides[selectedIndex]["type.types_name"]} onChange={e => handleChange(e)} style={{marginTop: "5px"}}>
                        {listOfSlideTypes.map((type) => {
                            const isSelected = type.types_name === listOfSlides[selectedIndex]["type.types_name"];
                            return (
                                    <option
                                    key={type.types_id}
                                    value={type.types_name}
                                    selected={isSelected}
                                    >
                                    {type.types_name}
                                    </option>
                            );
                        })}
                    </Form.Select>
                </div>
            }
        </div>
    )
}