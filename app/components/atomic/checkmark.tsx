import { styled as styledComponents } from "styled-components";

const Checkmark = (
    {onClick = () => {}, className = "", disabled=false, isChecked=false, id="checkmark-1" } :
    {onClick?: () => void,  className?: string, disabled?: boolean, isChecked?: boolean, id?: string}) => {
  return (
    <StyledWrapper>
    <label htmlFor={id} className={`${className}`}>
    <input checked={isChecked} type="checkbox" onClick={onClick} disabled={disabled} id={id}/>
    <span className="checkbox"></span>
    </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styledComponents.div`
 label {
  display: block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

input[type='checkbox'] {
  position: absolute;
  transform: scale(0);
}

input[type='checkbox']:checked ~ .checkbox {
  transform: rotate(45deg);
  width: 14px;
  margin-left: 5px;
  border-color: #24c78e;
  border-width: 5px;
  border-top-color: transparent;
  border-left-color: transparent;
  border-radius: 0;
}

.checkbox {
  display: block;
  width: inherit;
  height: inherit;
  border: solid 3px #2a2a2ab7;
  border-radius: 6px;
  transition: all 0.375s;
}
`;

export default Checkmark;
