import { styled as styledComponents } from "styled-components";
import Loader from "./loader";

const Button = ({onClick = () => {}, loading, className = "", containerClassName =''} : {onClick?: () => void, loading?: boolean, className?: string, containerClassName?: string}) => {
  return (
    <StyledWrapper className={containerClassName} >
      <button className={`button x dark:bg-zinc-900 bg-zinc-600 ${className}`}
        onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          viewBox="0 0 48 48"
          height="48"
        >
          <path fill="none" d="M0 0h48v48H0z" />
          <path d="M42 36v2c0 2.21-1.79 4-4 4H10c-2.21 0-4-1.79-4-4V10c0-2.21 1.79-4 4-4h28c2.21 0 4 1.79 4 4v2H24c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h18zm-18-4h20V16H24v16zm8-5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
        {loading ? (<><Loader /><span>Processing...</span></>): <span>Connect Wallet</span>}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styledComponents.div`
  .button.x {
  max-width: 320px;
  display: flex;
  padding: 0.5rem 1.4rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid rgba(24, 23, 23, 0.25);
  gap: 0.75rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.6s ease;
  text-decoration: none;
 
}

.button.x svg {
  height: 24px;
  width: 24px;
  fill: #fff;
  margin-right: 0.5rem;
}

.button.x:hover {
  transform: scale(1.02);
  background-color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button.x:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
}

.button.x:active {
  transform: scale(0.98);
  opacity: 0.8;
}

@media (max-width: 480px) {
  .button.x {
    max-width: 100%;
  }
}

`;

export default Button;
