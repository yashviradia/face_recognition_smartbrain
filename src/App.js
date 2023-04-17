import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkFrom from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
// Using particles background at the end.
// import { useCallback } from "react";
// import Particles from "react-particles";
// import { loadFull } from "tsparticles";

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'PAT';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'user_id';       
const APP_ID = 'app_id';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'color-recognition';
const MODEL_VERSION_ID = 'dd9458324b4b45c2be1a7ba84d27cd04';    


class App extends Component {

  // const particlesInit = useCallback(async engine => {
  //   console.log(engine);
  //   // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
  //   // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  //   // starting from v2 you can add only the features you need reducing the bundle size
  //   await loadFull(engine);
  // }, []);

  // const particlesLoaded = useCallback(async container => {
  //   await console.log(container);
  // }, []);

  // Adding functionality to our app.
  constructor() {
    super();
    this.state = {
      input: '', 
      imageUrl: '',
      route: 'signin',
      isSignedIn: false,
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    const IMAGE_URL = this.state.input;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
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

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route } = this.state;
    return (
      <div className="App">
        {/* <Particles 
        id="tsparticles" 
        url="http://foo.bar/particles.json" 
        init={particlesInit} 
        loaded={particlesLoaded}   
        /> */}

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkFrom 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition imageUrl={imageUrl} />
            </div>
          : (
            route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
