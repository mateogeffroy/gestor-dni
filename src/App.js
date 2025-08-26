import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import PersonList from './components/PersonList';
import './App.css';

// URL base de tu API local
const API_URL = 'http://127.0.0.1:5000/api';

function App() {
  // Estado para forzar la actualización de la lista después de un registro
  const [refreshList, setRefreshList] = useState(false);

  const handleRegistrationSuccess = () => {
    // Cambiamos el estado para que PersonList se vuelva a renderizar
    setRefreshList(!refreshList);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestión de DNI</h1>
        {/* El componente para buscar y registrar */}
        <SearchBar apiUrl={API_URL} onRegistrationSuccess={handleRegistrationSuccess} />
      </header>
      <main>
        {/* El componente que muestra la lista de personas */}
        <PersonList apiUrl={API_URL} refreshDependency={refreshList} />
      </main>
    </div>
  );
}

export default App;