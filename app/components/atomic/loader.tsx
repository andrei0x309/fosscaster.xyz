import { styled as styledComponents } from "styled-components";

const Loader = ({ inverted = false}: {inverted?: boolean}) => {
  return (
    <StyledWrapper>
<div className="loader">
    <span className={`bar ${ inverted ? 'dark:bg-neutral-800 bg-slate-300' : 'dark:bg-slate-300 bg-neutral-800'}`}></span>
    <span className={`bar ${ inverted ? 'dark:bg-neutral-800 bg-slate-300' : 'dark:bg-slate-300 bg-neutral-800'}`}></span>
    <span className={`bar ${ inverted ? 'dark:bg-neutral-800 bg-slate-300' : 'dark:bg-slate-300 bg-neutral-800'}`}></span>
</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styledComponents.div`
.loader {
  display: flex;
  align-items: center;
}

.bar {
  display: inline-block;
  width: 3px;
  height: 20px;
  border-radius: 10px;
  animation: scale-up4 1s linear infinite;
}

.bar:nth-child(2) {
  height: 35px;
  margin: 0 5px;
  animation-delay: .25s;
}

.bar:nth-child(3) {
  animation-delay: .5s;
}

@keyframes scale-up4 {
  20% {
    background-color: #ffff;
    transform: scaleY(1.5);
  }

  40% {
    transform: scaleY(1);
  }
}
`;

export default Loader;
