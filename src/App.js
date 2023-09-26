import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '59db6d800d7b492091d8ffef0abdefe4';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';       
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';


// const initialState = {
//   input: '',
//   imageUrl: '',
//   box: {},
//   route: 'signin',
//   isSignedIn: false,
//   user: {
//     id: '',
//     name: '',
//     email: '',
//     entries: 0,
//     joined: ''
//   }
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  // loadUser = (data) => {
  //   this.setState({user: {
  //     id: data.id,
  //     name: data.name,
  //     email: data.email,
  //     entries: data.entries,
  //     joined: data.joined
  //   }})
  // }

  calculateFaceLocation = (response) => {
    console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    const clarifaiFace = response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
            "data": {
                "image": {
                    "url": this.state.input
                }
            }
          }
      ]
    });
    
    
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };


    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(error => console.log('error', error));

  }

  // onButtonSubmit = () => {
  //   this.setState({imageUrl: this.state.input});
  //     fetch('https://face-recognition-smartbrain-backend.onrender.com/imageurl', {
  //       method: 'post',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         input: this.state.input
  //       })
  //     })
  //     .then(response => response.json())
  //     .then(response => {
  //       if (response) {
  //         fetch('https://face-recognition-smartbrain-backend.onrender.com/image', {
  //           method: 'put',
  //           headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify({
  //             id: this.state.user.id
  //           })
  //         })
  //           .then(response => response.json())
  //           .then(count => {
  //             this.setState(Object.assign(this.state.user, { entries: count}))
  //           })
  //           .catch(console.log)

  //       }
  //       this.displayFaceBox(this.calculateFaceLocation(response.text()))
  //     })
  //     .catch(err => console.log(err));
  // }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() {
    const {isSignedIn, route, box, imageUrl} = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#FFFFFF" num={200} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/> 
        
        { route === 'home'
          ? <div>
              <Logo />
              {/* <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              /> */}
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageUrl={imageUrl} box={box}/>
            </div>
          : (
             route === 'signin'
             ? <Signin onRouteChange={this.onRouteChange}/>
             : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
