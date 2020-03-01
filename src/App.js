import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';
import Particles from 'react-particles-js';





const particleOptions ={
  particles: {
    number:{
      value: 150,
      density:{
        enable:true,
        value_area:800
      }
    }
  }
}

const initalState = {
  input: '',
  imageURL: '',
  boxes: [],
  route: 'signin',
  isSignedIn:false,
  user: {
    id:'',
    name:'',
    email:'',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state = initalState;
  }

  loadUser = (data) => {
    console.log('data',data);
    this.setState({user: {
      id:data.id,
      name:data.name,
      email:data.email,
      entries: data.entries,
      joined: data.joined
    }})  
  }

  calculateFaceLocations = (data) =>{
    console.log(data);
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      console.log(width,height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });

  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes:boxes});
  }

  onInputChange = (event) => {
    //tako dobimo value iz nasega eventas
    console.log(event.target.value);
    this.setState({input:event.target.value});
  }
  

  onButtonSubmit = () => {
    console.log('input', this.state.input);
    this.setState({imageURL: this.state.input});
      fetch('http://localhost:3001/imageurl', { // https://arcane-stream-58672.herokuapp.com
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response =>{
        console.log('response: ',response);
        if(response && response!== 'Unable to call API'){
          fetch('http://localhost:3001/image', { // https://arcane-stream-58672.herokuapp.com
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                id:this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(err =>console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response))
      })
      .catch(err =>console.log(err));
  }


  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState(initalState)
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  render (){
    //ce bi to uporabu mi nebi bilo treba pisat this. pred parametri
    //const {isSignedIn, imageUrsl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions} 
        />
        
        <Navigation isSignedIn={this.state.isSignedIn}  onRouteChange={this.onRouteChange} />
        { this.state.route === 'home' 
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit} />
              <FaceRecognition imageUrl={this.state.imageURL} boxes={this.state.boxes} />
            </div> 
          : (
            this.state.route === 'signin' ||  this.state.route === 'signout'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          
          
        }

      </div>
    );
  }

}

export default App;
