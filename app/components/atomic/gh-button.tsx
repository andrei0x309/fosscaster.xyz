import { styled } from "styled-components";
import { GithubIcon } from "~/components/icons/github";

export const GhButton = ({onClick}: { onClick: () => void} ) => {
  return (
    <StyledWrapper>
      <button className="btn-github" onClick={onClick}>
        <GithubIcon />
        <span >View on Github</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn-github {
    cursor: pointer;
    display: inline-flex;
    gap: 0.5rem;
    border: none;
    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    border-radius: 100px;
    font-weight: 800;
    place-content: center;
    /* padding: 0.75rem 1rem; */
    font-size: 0.825rem;
    line-height: 1rem;
    background-color: rgba(0, 0, 0, 0.9);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.02);
    color: #fff;
    width: max-content;
    padding: 0.3rem;
    margin-top: -0.3rem;
    position: relative;
    top: 0.24rem;
    border: 1px solid #49474e;
}

.btn-github:hover {
  color: #f76b15;
}

`;

