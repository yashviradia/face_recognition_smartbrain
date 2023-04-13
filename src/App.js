import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkFrom from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkFrom />
      {/* <FaceRecognition /> */}
    </div>
  );
}

export default App;
