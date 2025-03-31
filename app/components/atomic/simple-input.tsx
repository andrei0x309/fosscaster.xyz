import {styled} from "styled-components";

export const SimpleInput = (
  {inputData, setInputData, placeholder = '', className = '', containerClass = '', inputClass = ''}: 
  {inputData: string, setInputData: (value: string) => void, placeholder?: string, className?: string, containerClass?: string, inputClass?: string}
) => {
  return (
    <StyledWrapper className={containerClass}>
      <div className={`input-group ${className}`}>
        <input
          required
          type="text"
          name="text"
          autoComplete="off"
          className={`input ${inputClass}`}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <label className="dark:bg-neutral-900 bg-white user-label text-[#2b4eb1]">{placeholder}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-group {
 position: relative;
}

.input {
 border: solid 1.5px #9e9e9e;
 border-radius: 1rem;
 background: none;
 padding: 1rem;
 font-size: 1rem;
 transition: border 150ms cubic-bezier(0.4,0,0.2,1);
}

.user-label {
 position: absolute;
 left: 15px;
 pointer-events: none;
 transform: translateY(1rem);
 transition: 150ms cubic-bezier(0.4,0,0.2,1);
}

.input:focus, input:valid {
 outline: none;
 border: 1.5px solid #2b4eb1;
}

.input:focus ~ label, input:valid ~ label {
 transform: translateY(-50%) scale(0.8);
 padding: 0 .2em;
 color: #2b4eb1;
}


`;
