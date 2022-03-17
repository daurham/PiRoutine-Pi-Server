import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid light-grey;
  border-right: 2px solid light-grey;
  border-bottom: 2px solid light-grey;
  border-left: 4px solid black;
  background: transparent;
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

export default Spinner;