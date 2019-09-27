import React, {Component} from 'react';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {/* check for loading state - render out spinner or "hint text" */}
    {loading ? <img src={loader} className="block mx-auto" /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    };
  }

  // function that searchs giphy api using fetch
  // places search term in query url

  searchGiphy = async searchTerm => {
    this.setState({
      // shows spinner
      loading: true
    });
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=slbFxyIcr4Ot9xQePC0DNFAIm3ddIIE1&q=${searchTerm}&limit=25&offset=0&rating=G&lang=en`
      );
      //convert response into json data
      const {data} = await response.json();

      //check if array of results is empty
      //in order to throw error and stop code
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      //grab random result from images
      const randomGif = randomChoice(data);
      console.log({randomGif});
      console.log(data);

      this.setState((prevState, props) => ({
        ...prevState,
        //spread operator to take previous gifs
        //and add new random gif onto end
        gifs: [...prevState.gifs, randomGif],
        //turn off loading icon
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
      console.log(error);
    }
  };

  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      //take old props and spread them out
      ...prevState,
      //overwrite ones we want afterwards
      searchTerm: value,
      // set hint text only when more than 2 characters in input
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  // when we have 2 or more characters in search box
  // and press enter we want to run a search

  handleKeyPress = event => {
    const {value} = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  };

  // reset state by clearing everything to default
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    //refocus curson on input
    this.textInput.focus();
  };

  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">
          {/* loop over array of gif images to
          create multiple video instance  */}
          {this.state.gifs.map(gif => (
            <Gif {...gif} />
          ))}

          <input
            className="input grid-item"
            placeholder="Type Something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        {/* pass userhint all data in state using spread operator */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
