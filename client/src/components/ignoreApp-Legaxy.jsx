// import React, { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
// import styled from 'styled-components';
// import axios from 'axios';

// const App = () => {
//   let head = "Pump Is Armed."
//   const [armed, setArmed] = useState(true);
//   const [loc, setLoc] = useState();
//   const [input, setInput] = useState('');



//   const handleClick = () => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       setLoc(() => latitude + longitude);
//       axios.post(`/pi`, {loc: latitude + longitude, des: input})
//         .then((res) => {
//           if (res.status === 201) {
//             axios.get('/pi')
//               .then((res) => console.log(res.data))
//               .catch((err) => console.log('Err: ', err));
//           }
//         })
//         .catch((err) => console.log('Err: ', err));
//     }, () => {
//       head = "Error Disarming";
//       console.log('failure');
//     });
//   }
//   const handleInput = (e) => {
//     setInput(() => e.target.value);
//   }


// const handleTestClick = () => {
//   axios.post('/piTest')
//     .then(() => console.log('Approved'))
//     .catch((err) => console.log('Fail: ', err));
// }



//   useEffect(() => { }, [loc]);

//   return (
//     <AppnContainer>

//       <Container>
//         <Header>{head}</Header>
//       </Container>
//       <Container>
//         <input onChange={handleInput} type="text"></input>
//       </Container>
//       <Container>
//         <ButtonContainer>
//           <GeoButton onClick={handleTestClick}>{loc ? loc : "Get My Location"}</GeoButton>
//         </ButtonContainer>
//       </Container>
//       <Container>
//         <Location>{loc}{armed}</Location>
//       </Container>
//     </AppnContainer>
//   );
// }

// export default App;
// const Location = styled.h1`
// `;
// const Header = styled.h1`
// `;

// const GeoButton = styled.button`
//   border: solid 5px blue;
//   width: 90%;
//   height: 100%;
//   cursor: pointer;
// `;

// const AppnContainer = styled.div`
//   display: block;
//   justify-content: center;
//   width: 80vw;
//   height: 40hw;
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   width: 80vw;
//   height: 20rem;
// `;
// const Container = styled.div`
//   display: flex;
//   justify-content: center;
// `;