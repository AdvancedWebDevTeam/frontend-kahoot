import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";

import "./Slide.css";

export default function EditSlide({ selectedIndex, listOfSlides, listOfSlideTypes }) {
    const [typeName, setTypeName] = useState();
    const [typeId, setTypeId] = useState(0);
    const [content, setContent] = useState({});
    
    const {
        handleSubmit,
    } = useForm();

    const len = listOfSlides.length;

    useEffect(() => {

        if (len > 0) {
            setTypeName(listOfSlides[selectedIndex]["type.types_name"])
            setTypeId(listOfSlides[selectedIndex].types_id)
            if (listOfSlides[selectedIndex].content !== null) {
                setContent(JSON.parse(listOfSlides[selectedIndex].content));
            }
            else {
                setContent({});
            }
        }

    }, [len, selectedIndex])

    const handleChange = (e) => {
        setTypeName(e.target.value);
        setTypeId(e.target.options.selectedIndex);
        listOfSlides[selectedIndex]["type.types_name"] = e.target.value;
        listOfSlides[selectedIndex].types_id = e.target.options.selectedIndex;
    }

    const onHandleSubmit = (data) => {

    }

    const AddOption_click = () => {
        const newContent = {...content};
        let newKey = `option${Object.keys(newContent).length + 1}`;
        if(newContent.hasOwnProperty(newKey)){
            newKey = newKey + " duplicate";
        }
        newContent[newKey] = 0;
        setContent(newContent);  
    }

    const DeleteOption_click = (e) => {
        const newContent = {...content};
        delete newContent[e.target.id];
        setContent(newContent);
    }

    return (
        <div className="boxSlide3">
            {len > 0 &&
                <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
                    <Button type="submit" style={{ marginTop: "5px" }}>Save changes</Button>
                    <Form.Select value={typeName} onChange={e => handleChange(e)} style={{ marginTop: "5px" }}>
                        {listOfSlideTypes.map((type) => {
                            const isSelected = type.types_name === typeName;
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
                    <div>
                        {listOfSlides[selectedIndex].types_id === 1 &&
                            <div>
                                {typeId === 1 &&
                                    <div>
                                        {content !== null &&
                                            <div style={{ marginTop: "10px" }}>
                                                {Object.keys(content).map((keyName, i) => (
                                                    <div key={i}>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text>{content[keyName]}</InputGroup.Text>
                                                            <Form.Control
                                                                placeholder={keyName}
                                                                id={keyName}
                                                            />
                                                            <Button onClick={e => DeleteOption_click(e)} id={keyName} variant="outline-secondary">
                                                                Delete
                                                            </Button>
                                                        </InputGroup>
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                        <Button onClick={AddOption_click} style={{ marginTop: "5px" }}>Add option</Button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </Form>
            }
        </div>
    )
}