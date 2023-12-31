import styled from "styled-components";

const COLORS = {
  primary: {
    "--main": "rgba(255, 255, 255, 0.65)",
    "--accent": "black",
  },
  secondary: {
    "--main": "rgba(255, 255, 255, 0.65)",
    "--accent": "black",
  },
  third: {
    "--main": "#f8f0e3",
    "--accent": "black",
  },
};


function Button({ variant = "fill", color = "primary", ...props }) {
  let Component;
  if (variant === "fill") {
    Component = FillButton;
  } else if (variant === "outline") {
    Component = OutlineButton;
  }

  return <Component style={COLORS[color]} {...props} />;
}

const ButtonBase = styled.button`
  font-family: cascadia;
  cursor: pointer;
  font-size: 1.25rem;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 8px 16px;
  text-decoration: none;
`;

const FillButton = styled(ButtonBase)`
  background-color: var(--main);
  font-weight: bold;
  color: var(--accent);

  &:hover {
    opacity: 0.8;
  }
`;

const OutlineButton = styled(ButtonBase)`
  background-color: white;
  color: 
  border: 2px solid var(--main);

  &:hover {
    background: hsl(235deg 85% 97%);
  }
`;

export default Button;