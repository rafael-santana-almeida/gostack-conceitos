import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);
  
  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `New repository ${Date.now()}`,
      url: 'https://github.com/rocketseat-education/bootcamp-gostack-desafios/tree/master/desafio-conceitos-reactjs',
      techs: ["NodeJs", "ReactJs"]
    });
    
    setRepositories([...repositories, response.data]);
  }

  async function handleAddLike(id) {
    const response = await api.post(`repositories/${id}/like`);
    const likedRepository = response.data;

    setRepositories(repositories.map(repository => {
      if (repository.id === id) {
        repository = likedRepository
      }

      return repository;
    }));
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    setRepositories(repositories.filter(repository => repository.id !== id));
  }

  return (
    <div className="container">
      <h1>Repositórios</h1>
      <button className="addButton" onClick={handleAddRepository}>Adicionar</button>

      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}

            <div className="buttons">
              <button className="like" onClick={() => handleAddLike(repository.id)}>
                Likes: {repository.likes}
              </button>

              <button className="delete" onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
