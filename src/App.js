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
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '98fdb1a211054a4383f51622c6da990a'
 });


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


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageURL: '',
      box:{},
      route: 'signin',
      isSignedIn:false
    }
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
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
  }

  displatFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }

  onInputChange = (event) => {
    //tako dobimo value iz nasega eventas
    console.log(event.target.value);
    this.setState({input:event.target.value});
  }
  
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL , this.state.input)
      .then(response => this.displatFaceBox(this.calculateFaceLocation(response)))
      .catch(err =>console.log(err));
  }

  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState({isSignedIn:false})
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
              <Rank/>
              <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit} />
              <FaceRecognition imageUrl={this.state.imageURL} box={this.state.box} />
            </div> 
          : (
            this.state.route === 'signin' 
            ? <SignIn onRouteChange={this.onRouteChange}/>
            :<Register onRouteChange={this.onRouteChange}/>
            )
          
          
        }

      </div>
    );
  }

}

export default App;
