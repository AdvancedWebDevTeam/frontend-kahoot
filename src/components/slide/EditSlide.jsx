import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { updateSlide } from "../../fetch/slideFetch"
import "./Slide.css";

export default function EditSlide({ selectedIndex, listOfSlides, listOfSlideTypes, onChangeType, FetchListOfSlide }) {
    const [typeName, setTypeName] = useState();
    const [typeId, setTypeId] = useState(0);
    const [options, setOptions] = useState({});
    const [question, setQuestion] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

  const len = listOfSlides.length;

    useEffect(() => {

        if (len > 0) {
            setTypeName(listOfSlides[selectedIndex]["type.types_name"])
            setTypeId(listOfSlides[selectedIndex].types_id)
            if (listOfSlides[selectedIndex].content !== "") {
                setOptions(listOfSlides[selectedIndex].options)
                setQuestion(listOfSlides[selectedIndex].question)
            }
            else {
                setOptions({})
                setQuestion("")
            }
        }
    }, [len, selectedIndex])

    const handleChange = (e) => {
        setTypeName(e.target.value);
        setTypeId(e.target.options.selectedIndex);
        onChangeType(e.target.options.selectedIndex, e.target.value);
    }

    const onHandleSubmit = (data) => {
        const newData = { ...data };

        switch (typeId) {
            case 0:
                {
                    updateSlide(listOfSlides[selectedIndex].slides_id, listOfSlides[selectedIndex].presents_id, typeId, "")
                        .catch((err) => {
                            console.log(err);
                        })

                    break;
                }
            case 1:
                {
                    const question = newData.question;
                    delete newData["question"];
                    const content = { question: question };

                    Object.values(newData).map((option) => {
                        if (option !== "") {
                            content[option] = 0;
                        }
                    });

                    updateSlide(listOfSlides[selectedIndex].slides_id, listOfSlides[selectedIndex].presents_id, typeId, JSON.stringify(content))
                        .catch((err) => {
                            console.log(err);
                        })
                }
        }
        FetchListOfSlide()
    }

    const AddOption_click = () => {
        const newOptions = { ...options };

        let newKey = `option${Object.keys(newOptions).length + 1}`;

        if (newOptions.hasOwnProperty(newKey)) {
            newKey = newKey + " duplicate";
        }
        newOptions[newKey] = 0;
        setOptions(newOptions);
    }

    const DeleteOption_click = (e) => {
        const newOptions = { ...options };
        delete newOptions[e.target.id];
        setOptions(newOptions);
    }

    const ResetButton_click = () => {
        switch (typeId) 
        {
            case 0:
                {
                    break;
                }
            case 1:
                {
                    reset();
                    break;
                }
        }
    }

    return (
        <div className="boxSlide3">
            {len > 0 &&
                <div>
                    <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
                        <Button type="submit" style={{ marginTop: "5px" }}>Save changes</Button>
                        <Button onClick={ResetButton_click} style={{ marginTop: "5px", marginLeft: "5px" }}>Reset form</Button>
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
                                        <div style={{ marginTop: "10px" }}>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>Question</InputGroup.Text>
                                                <Form.Control
                                                    placeholder={question}
                                                    id="question"
                                                    defaultValue=""
                                                    {...register("question", { required: true })}
                                                />
                                            </InputGroup>
                                            {errors.question?.type === "required" && (
                                                <Form.Text className="text-danger">
                                                    <div>required</div>
                                                </Form.Text>
                                            )}
                                            <div style={{ marginTop: "10px" }}>
                                                {Object.keys(options).map((keyName, i) => (
                                                    <div key={i}>
                                                        <InputGroup className="mb-3">
                                                            <InputGroup.Text>{options[keyName]}</InputGroup.Text>
                                                            <Form.Control
                                                                placeholder={keyName}
                                                                id={keyName}
                                                                defaultValue=""
                                                                {...register(`${keyName}`, { required: true })}
                                                            />
                                                            <Button onClick={e => DeleteOption_click(e)} id={keyName} variant="outline-secondary">
                                                                Delete
                                                            </Button>
                                                        </InputGroup>
                                                        {errors[keyName]?.type === "required" && (
                                                            <Form.Text className="text-danger">
                                                                <div>required</div>
                                                            </Form.Text>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button onClick={AddOption_click} style={{ marginTop: "5px" }}>Add option</Button> 
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </Form>
                </div>
            }
        </div>
      )}
    </div>
  );
}
