import { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BiSave } from "react-icons/bi";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { updateSlide } from "../../fetch/slideFetch";
import "./Slide.css";
import TooltipTrigger from "../general/TooltipTrigger";

export default function EditSlide({
  selectedIndex,
  listOfSlides,
  listOfSlideTypes,
  onChangeType,
  FetchListOfSlide
}) {
  const [typeName, setTypeName] = useState();
  const [typeId, setTypeId] = useState(0);
  const [options, setOptions] = useState({});
  const [question, setQuestion] = useState("");
  const [headingOfHeading, setHeadingOfHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [headingOfParagragph, setHeadingOfParagraph] = useState("");
  const [paragraph, setParagraph] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm();

  const len = listOfSlides.length;

  useEffect(() => {
    if (len > 0) {
      setTypeName(listOfSlides[selectedIndex]["type.types_name"]);
      setTypeId(listOfSlides[selectedIndex].types_id);
      setOptions(listOfSlides[selectedIndex].options);
      setQuestion(listOfSlides[selectedIndex].question);
      setHeadingOfHeading(listOfSlides[selectedIndex].headingOfHeading);
      setSubheading(listOfSlides[selectedIndex].subheading);
      setHeadingOfParagraph(listOfSlides[selectedIndex].headingOfParagraph);
      setParagraph(listOfSlides[selectedIndex].paragraph);
    }
  }, [len, selectedIndex, listOfSlides]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const handleChange = (e) => {
    setTypeName(e.target.value);
    setTypeId(e.target.options.selectedIndex);
    onChangeType(e.target.options.selectedIndex, e.target.value);
  };

  const onHandleSubmit = (data) => {
    const newData = { ...data };

    switch (typeId) {
      case 0: {
        updateSlide(
          listOfSlides[selectedIndex].slides_id,
          listOfSlides[selectedIndex].presents_id,
          typeId,
          ""
        ).catch((err) => {
          console.log(err);
        });

        break;
      }
      case 1: {
        const { question } = newData;
        delete newData.question;
        const content = { question };

        Object.values(newData).map((option) => {
          if (option !== "") {
            content[option] = 0;
          }
        });

        updateSlide(
          listOfSlides[selectedIndex].slides_id,
          listOfSlides[selectedIndex].presents_id,
          typeId,
          JSON.stringify(content)
        ).catch((err) => {
          console.log(err);
        });
        break;
      }
      case 2: {
        const { heading2, Subheading } = newData;
        const content = {};
        content.heading = heading2;
        content.subheading = Subheading;
        updateSlide(
          listOfSlides[selectedIndex].slides_id,
          listOfSlides[selectedIndex].presents_id,
          typeId,
          JSON.stringify(content)
        ).catch((err) => {
          console.log(err);
        });
        break;
      }
      case 3: {
        const { heading3, Paragraph } = newData;
        const content = {};
        content.heading = heading3;
        content.paragraph = Paragraph;
        updateSlide(
          listOfSlides[selectedIndex].slides_id,
          listOfSlides[selectedIndex].presents_id,
          typeId,
          JSON.stringify(content)
        ).catch((err) => {
          console.log(err);
        });
        break;
      }
    }
    FetchListOfSlide();
  };

  const addOptionClick = () => {
    const newOptions = { ...options };

    let newKey = `option${Object.keys(newOptions).length + 1}`;

    if (newOptions.hasOwnProperty(newKey)) {
      newKey += " duplicate";
    }
    newOptions[newKey] = 0;
    setOptions(newOptions);
  };

  const deleteOptionClick = (e) => {
    const newOptions = { ...options };
    delete newOptions[e.target.id];
    setOptions(newOptions);
  };

  return (
    <div className="boxSlide3">
      {len > 0 && (
        <div>
          <Form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
            <div className="edit-toolbar">
              <TooltipTrigger text="Save change">
                <Button variant="outline-primary" type="submit">
                  <BiSave />
                </Button>
              </TooltipTrigger>
            </div>
            <Form.Select
              value={typeName}
              onChange={(e) => handleChange(e)}
              style={{ marginTop: "5px" }}
            >
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
              {listOfSlides[selectedIndex].types_id === 1 && (
                <div>
                  {typeId === 1 && (
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
                          <div>Required</div>
                        </Form.Text>
                      )}
                      <div style={{ marginTop: "10px" }}>
                        {Object.keys(options).map((keyName, i) => (
                          <div key={i}>
                            <InputGroup className="mb-3">
                              <InputGroup.Text>
                                {options[keyName]}
                              </InputGroup.Text>
                              <Form.Control
                                placeholder={keyName}
                                id={keyName}
                                defaultValue=""
                                {...register(`${keyName}`, { required: true })}
                              />
                              <Button
                                onClick={(e) => deleteOptionClick(e)}
                                id={keyName}
                                variant="outline-secondary"
                              >
                                Delete
                              </Button>
                            </InputGroup>
                            {errors[keyName]?.type === "required" && (
                              <Form.Text className="text-danger">
                                <div>Required</div>
                              </Form.Text>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={addOptionClick}
                        style={{ marginTop: "5px" }}
                      >
                        Add option
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {listOfSlides[selectedIndex].types_id === 2 && (
                <div>
                  {typeId === 2 && (
                    <div style={{ marginTop: "10px" }}>
                      <Form.Text
                        style={{ marginTop: "10px", fontSize: "20px" }}
                      >
                        <b>Heading</b>
                      </Form.Text>
                      <InputGroup>
                        <Form.Control
                          placeholder={headingOfHeading}
                          id="heading2"
                          defaultValue=""
                          as="textarea"
                          {...register("heading2", {
                            required: true,
                            maxLength: 30
                          })}
                        />
                      </InputGroup>
                      {errors.heading2?.type === "required" && (
                        <Form.Text className="text-danger">
                          <div>Required</div>
                        </Form.Text>
                      )}
                      {errors.heading2?.type === "maxLength" && (
                        <Form.Text className="text-danger">
                          <div>Should have less than 31 characters</div>
                        </Form.Text>
                      )}
                      <Form.Text
                        style={{ marginTop: "10px", fontSize: "20px" }}
                      >
                        <b>Subheading</b>
                      </Form.Text>
                      <InputGroup style={{ marginTop: "10px" }}>
                        <Form.Control
                          placeholder={subheading}
                          id="Subheading"
                          defaultValue=""
                          as="textarea"
                          {...register("Subheading", { maxLength: 100 })}
                        />
                      </InputGroup>
                      {errors.subheading?.type === "maxLength" && (
                        <Form.Text className="text-danger">
                          <div>Should have less than 101 characters</div>
                        </Form.Text>
                      )}
                    </div>
                  )}
                </div>
              )}
              {listOfSlides[selectedIndex].types_id === 3 && (
                <div>
                  {typeId === 3 && (
                    <div style={{ marginTop: "10px" }}>
                      <Form.Text
                        style={{ marginTop: "10px", fontSize: "20px" }}
                      >
                        <b>Heading</b>
                      </Form.Text>
                      <InputGroup>
                        <Form.Control
                          placeholder={headingOfParagragph}
                          id="heading3"
                          defaultValue=""
                          as="textarea"
                          {...register("heading3", {
                            required: true,
                            maxLength: 30
                          })}
                        />
                      </InputGroup>
                      {errors.heading3?.type === "required" && (
                        <Form.Text className="text-danger">
                          <div>Required</div>
                        </Form.Text>
                      )}
                      {errors.heading3?.type === "maxLength" && (
                        <Form.Text className="text-danger">
                          <div>Should have less than 31 characters</div>
                        </Form.Text>
                      )}
                      <Form.Text
                        style={{ marginTop: "10px", fontSize: "20px" }}
                      >
                        <b>Paragraph</b>
                      </Form.Text>
                      <InputGroup style={{ marginTop: "10px" }}>
                        <Form.Control
                          placeholder={paragraph}
                          id="Paragraph"
                          defaultValue=""
                          as="textarea"
                          {...register("Paragraph", { maxLength: 190 })}
                        />
                      </InputGroup>
                      {errors.paragraph?.type === "maxLength" && (
                        <Form.Text className="text-danger">
                          <div>Should have less than 191 characters</div>
                        </Form.Text>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
