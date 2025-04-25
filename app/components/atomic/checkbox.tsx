import { styled as styledComponents } from "styled-components";

export const CheckBox = (
    {onClick = () => {}, className = "", disabled=false, isChecked=false} :
    {onClick?: () => void,  className?: string, disabled?: boolean, isChecked?: boolean}) => {
  return (
    <StyledWrapper className='' >
    <label className={`container-checkbox ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} htmlFor="checkboxInput">
    <input className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} checked={isChecked} type="checkbox" onClick={onClick} disabled={disabled} id="checkboxInput"/>
    <div className="checkmark"></div>
    </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styledComponents.div`
  /* Hide the default checkbox */
.container-checkbox input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.container-checkbox {
  display: flex;
  gap: 10px;
}


/* Create a custom checkbox */
.checkmark {
  position: relative;
  box-shadow: rgb(255, 84, 0) 0px 0px 0px 2px;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  flex-shrink: 0;
  margin-top: -1px;
  transition: all 0.2s ease 0s;
  transform-origin: 0px 10px;
  border-radius: 4px;
  margin: -1px 10px 0px 0px;
  padding: 0px;
  box-sizing: border-box;
}

.dark .checkmark {
  background-color: rgba(16, 16, 16, 0.5);
}

.container-checkbox input:checked ~ .checkmark {
  box-shadow: rgb(255, 84, 0) 0px 0px 0px 2px;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  flex-shrink: 0;
  margin-top: -1px;
  transition: all 0.2s ease 0s;
  transform-origin: 0px 10px;
  border-radius: 4px;
  margin: -1px 10px 0px 0px;
  padding: 0px;
  box-sizing: border-box;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container-checkbox input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container-checkbox .checkmark:after {
  left: 0.45em;
  top: 0.25em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 0.15em 0.15em 0;
  transform: rotate(45deg);
  transition: all 500ms ease-in-out;
}
`;
