import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Spinner, ListGroup, Tab, Tabs, Alert, CloseButton } from 'react-bootstrap';
import { BsSearch, BsPlayFill, BsPauseFill, BsStopFill } from 'react-icons/bs';
import './App.css';
import appleLogo from './images/apple-logo.png';
import Favourites from './components/Favourites.js';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('music');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [favorites, setFavorites] = useState([]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPreview, setCurrentPreview] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const handleSearch = () => {
    setLoading(true);

    const callbackName = `itunesSearchCallback_${Date.now()}`;
    const itunesApiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=${encodeURIComponent(mediaType)}&callback=${callbackName}`;

    const script = document.createElement('script');
    script.src = itunesApiUrl;

    window[callbackName] = (data) => {
      if (data && data.results) {
        setSearchResults(data.results.map(result => {
          if (result.kind === 'tv-episode' || result.kind === 'feature-movie') {
            result.previewUrl = result.previewUrl || result.artworkUrl100;
          } else if (result.kind === 'song' || result.kind === 'music-video') {
            const highResImageUrl = result.artworkUrl100.replace('100x100bb', '600x600bb');
            result.previewUrl = highResImageUrl || result.previewUrl;
          }
          return result;
        }));
      } else {
        console.error('Invalid JSONP response:', data);
      }

      setLoading(false);
      document.body.removeChild(script);
      delete window[callbackName];
    };

    script.onerror = (error) => {
      console.error('Error loading JSONP script:', error);
      setLoading(false);
    };

    document.body.appendChild(script);
  };

  const handlePlayMedia = (track) => {
    stopCurrentMedia(); // Stop any currently playing media

    if (track.kind === 'song' || track.kind === 'music-video') {
        setCurrentTrack(track);
        if (audioRef.current) {
            audioRef.current.src = track.previewUrl;

            audioRef.current.onloadeddata = () => {
                // Check if the audio can be played
                if (audioRef.current.readyState >= 2) {
                    audioRef.current.play().catch(error => {
                        console.error("Error playing the audio track:", error);
                    });
                } else {
                    console.error("Audio cannot be played; unsupported format or failed loading.");
                }
            };
        }
    }

    setShowAlert(true);
    setAlertMessage('Playing: ' + track.trackName);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
};

  const handlePauseMedia = () => {
    if (currentPreview && videoRef.current) {
      videoRef.current.pause();
    } else if (currentTrack && audioRef.current) {
      audioRef.current.pause();
    }

    setShowAlert(true);
    setAlertMessage('Paused');
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const handleStopMedia = () => {
    stopCurrentMedia(); // Use the function to stop any current media

    setShowAlert(true);
    setAlertMessage('Stopped');
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const stopCurrentMedia = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentPreview(null);
    setCurrentTrack(null);
  };

  const addToFavorites = async (item) => {
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      setFavorites([...favorites, data]);

      setShowAddAlert(true);
      setTimeout(() => {
        setShowAddAlert(false);
      }, 4000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToFavorites = (item) => {
    addToFavorites(item);
    setFavorites([...favorites, item]);

    setShowAddAlert(true);
    setTimeout(() => {
      setShowAddAlert(false);
    }, 4000);
  };

  const handleRemoveFromFavorites = async (itemToRemove) => {
    try {
      await fetch(`/api/favourites/${itemToRemove.trackId}`, {
        method: 'DELETE',
      });

      const updatedFavorites = favorites.filter((item) => item.trackId !== itemToRemove.trackId);
      setFavorites(updatedFavorites);

      setShowAlert(true);
      setAlertMessage('Item removed from favorites!');
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch('/api/favourites')
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const background = document.querySelector('.background');
    const colors = [
      ['#ff7e5f', '#feb47b'],
      ['#6a11cb', '#2575fc'],
      ['#fc5c7d', '#6a82fb'],
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const [color1, color2] = colors[randomIndex];
    background.style.background = `linear-gradient(to bottom right, ${color1}, ${color2})`;
  }, []);

  return (
    <div className="background">
      <Container>
        {showAddAlert && (
          <Alert variant="success" onClose={() => setShowAddAlert(false)} dismissible className="alert-fixed">
            Item added to favorites!
          </Alert>
        )}
        {showAlert && (
          <Alert variant="info" onClose={() => setShowAlert(false)} dismissible className="alert-fixed">
            {alertMessage}
            <CloseButton onClick={() => setShowAlert(false)} aria-label="Close" />
          </Alert>
        )}
        {currentTrack && (
          <div className="current-track-info">
            Now Playing: {currentTrack.trackName} by {currentTrack.artistName}
          </div>
        )}
        <div className="search-container">
          <div className="header-content">
            <img src={appleLogo} alt="Apple Logo" className="apple-logo img-fluid" />
            <h1 className="search-header">iTunes Search</h1>
          </div>
          <div className="search-content">
            <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} className="rounded-tabs">
              <Tab eventKey="search" title="Search">
                <Form className="search-form">
                  <Form.Group className="search-input-group">
                    <Form.Control
                      type="text"
                      placeholder="Search music, etc..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <BsSearch className="search-icon" />
                  </Form.Group>
                  <Form.Group className="category-group">
                    <Form.Control as="select" value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                      <option value="all">All</option>
                      <option value="movie">Movie</option>
                      <option value="podcast">Podcast</option>
                      <option value="music">Music</option>
                      <option value="audiobook">Audiobook</option>
                      <option value="shortFilm">Short Film</option>
                      <option value="tvShow">TV Show</option>
                      <option value="software">Software</option>
                      <option value="ebook">Ebook</option>
                    </Form.Control>
                  </Form.Group>
                  <Button data-testid="search-button" variant="primary" onClick={handleSearch} className="search-button">
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        {' Searching...'}
                      </>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </Form>
                <div className="mt-4">
                  {searchResults.length > 0 ? (
                    <ListGroup>
                      {searchResults.map((result) => (
                        <ListGroup.Item key={result.trackId} className="searched-item">
                          <div className="media-preview">
                            {result.kind === 'tv-episode' || result.kind === 'feature-movie' ? (
                              <video
                                ref={videoRef}
                                width="300"
                                height="200"
                                controls
                              >
                                <source src={result.previewUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : result.kind === 'song' || result.kind === 'music-video' ? (
                              <img
                                src={result.artworkUrl100.replace('100x100bb', '600x600bb') || result.previewUrl || 'default_image_url_here'}
                                alt={`${result.trackName} artwork`}
                                width="300"
                                height="300"
                              />
                            ) : null}
                          </div>
                          <div className="track-details">
                            <span className="track-name">{result.trackName}</span>
                            <span className="track-artist">{result.artistName}</span>
                          </div>
                          {result.kind === 'song' || result.kind === 'music-video' ? (
                            <div className="track-actions">
                              <Button
                                className="neomorphic-button"
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleAddToFavorites(result)}
                              >
                                Add to Favorites
                              </Button>
                              <Button
                                className="neomorphic-button"
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handlePlayMedia(result)}
                              >
                                <BsPlayFill />
                              </Button>
                              <Button
                                className="neomorphic-button"
                                variant="outline-warning"
                                size="sm"
                                onClick={handlePauseMedia}
                              >
                                <BsPauseFill />
                              </Button>
                              <Button
                                className="neomorphic-button"
                                variant="outline-danger"
                                size="sm"
                                onClick={handleStopMedia}
                              >
                                <BsStopFill />
                              </Button>
                            </div>
                          ) : null}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>No Results Found</p>
                  )}
                </div>
              </Tab>
              <Tab eventKey="favourite" title="Favorites">
                <Favourites
                  addToFavorites={handleAddToFavorites}
                  removeFromFavorites={handleRemoveFromFavorites}
                  favorites={favorites}
                  handleRemoveFromFavorites={handleRemoveFromFavorites}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
        <audio ref={audioRef} />
      </Container>
    </div>
  );
}

export default Search;