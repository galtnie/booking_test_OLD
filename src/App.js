import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Booking from './Booking';

//import logo from './logo.svg';
import './css/App.css';


function App() {
  return (
    <div>
      <BrowserRouter >
        <div>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path='/booking' component={Booking} />
        </div>
      </BrowserRouter>
    </div>  
  );
}

export default App;







// import React from 'react';
// import ReactDOM from 'react-dom';
// import Button from '@material-ui/core/Button';

// function App() {
//   return (
//     <Button variant="contained" color="primary">
//       Hello World
//     </Button>
//   );
// }

// export default App;