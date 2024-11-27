import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; 
import { TextField, Button, CircularProgress, Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

function App() {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(false); 

  const fetchCharacters = async (search = '', page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('https://rickandmortyapi.com/api/character', {
        params: { name: search, page: page },
      });
      setCharacters(response.data.results.slice(0, 10)); 
      setTotalPages(response.data.info.pages);
    } catch (error) {
      console.error('Erreur lors de la récupération des personnages :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  
  const getStatusColor = (status) => {
    if (status === 'Alive') {
      return 'green'; 
    } else if (status === 'Dead') {
      return 'red'; 
    } else if (status === 'unknown') {
      return 'gray'; 
    }
    return 'black'; 
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#eaeaea' }}>
      <Typography variant="h3" gutterBottom style={{ fontFamily: 'Montserrat, sans-serif', color: '#4A90E2' }}>
        Rick & Morty 
      </Typography>
      <Typography variant="h5" gutterBottom style={{ color: '#333' }}>
        Explore the characters of Rick & Morty
      </Typography>

      {/* Champ de recherche */}
      <TextField
        label="Search for a person"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          marginBottom: '20px',
          width: '300px',
          borderRadius: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '10px',
        }}
        InputProps={{
          startAdornment: <span role="img" aria-label="search">🔍</span>,
        }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {characters.map((character) => (
            <Grid item xs={12} sm={6} md={4} key={character.id}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  style={{
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    borderRadius: '15px',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'scale(1.05)' }, 
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={character.name}
                    image={character.image}
                    style={{
                      borderRadius: '15px 15px 0 0',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      {character.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> <span style={{ color: getStatusColor(character.status) }}>
                        {character.status}
                      </span>
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {character.location.name}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '20px' }}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="contained"
          color="primary"
          style={{
            marginRight: '10px',
            borderRadius: '25px',
            padding: '10px 20px',
            backgroundColor: '#4A90E2',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Précédent
        </Button>
        <span style={{ fontWeight: 'bold' }}>
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="contained"
          color="primary"
          style={{
            marginLeft: '10px',
            borderRadius: '25px',
            padding: '10px 20px',
            backgroundColor: '#4A90E2',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

export default App;
