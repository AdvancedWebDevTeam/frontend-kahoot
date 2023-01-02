import React from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select";

const animatedComponents = makeAnimated();

const formatOptionLabel = ({ label, name }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div style={{ marginRight: "10px" }}>{label}</div>
    <div style={{ color: "gray" }}>{name}</div>
  </div>
);

export default function NewCollaboratorForm({ options, onAdd }) {
  function handleChange(selectedOptions) {
    const newCollabs = selectedOptions.map((option) => {
      return {
        userId: option.id,
        username: option.name,
        email: option.value
      };
    });
    onAdd(newCollabs);
  }

  return (
    <Select
      components={animatedComponents}
      isMulti
      isClearable
      isSearchable
      openMenuOnClick={false}
      options={options}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
    />
  );
}
