// Ruta: frontend/src/components/PersonList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendOfflineModal = () => (
    <div className="modal-backdrop">
        <div className="modal-content">
            <h2>🔴 Servidor Local Apagado</h2>
            <p>
                La aplicación no puede conectarse con la base de datos local.
            </p>
            <p>
                Por favor, asegúrate de haber ejecutado el programa desde el 
                acceso directo en tu escritorio llamado <strong>"ArchivoEjecutadorDelBackend"</strong>.
            </p>
        </div>
    </div>
);

const PersonList = ({ apiUrl, refreshDependency }) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [trabajoFilter, setTrabajoFilter] = useState('todos');

  useEffect(() => {
        // 1. Primero, verificar si el backend está en línea
        const checkBackendStatus = async () => {
            try {
                await axios.get(`${apiUrl}/status`);
                setIsBackendOnline(true); // Si la respuesta es exitosa, está en línea
            } catch (error) {
                console.error("Backend offline o inalcanzable.", error);
                setIsBackendOnline(false);
                setLoading(false); // Dejamos de cargar porque no hay conexión
            }
        };

        checkBackendStatus();
    }, [apiUrl, refreshDependency]);

  useEffect(() => {
        // 2. Si el backend está en línea, cargar los datos de las personas
        if (!isBackendOnline) return;

        const fetchPersonas = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/personas`, {
                    params: {
                        q: searchTerm.length >= 3 ? searchTerm : '',
                        trabajo: trabajoFilter,
                    },
                });
                setPersonas(response.data);
            } catch (err) {
                console.error("Error al obtener personas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonas();
    }, [isBackendOnline, searchTerm, trabajoFilter, apiUrl, refreshDependency]);

  const handleDelete = async (personId) => {
    if (window.confirm('¿Está seguro de que desea eliminar a esta persona?')) {
      try {
        await axios.delete(`${apiUrl}/personas/${personId}`);
        setPersonas(personas.filter(p => p.id !== personId));
        alert('Persona eliminada con éxito.');
      } catch (err) {
        alert('Error al eliminar la persona.');
        console.error(err);
      }
    }
  };

  if (!isBackendOnline && !loading) {
    return <BackendOfflineModal />;
  }
  
  return (
    <div className="list-container">
      <h2>Listado de Personas</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar (mín. 3 letras)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={trabajoFilter} onChange={(e) => setTrabajoFilter(e.target.value)}>
          <option value="todos">Todos los trabajos</option>
          <option value="abc">abc</option>
          <option value="caja">caja</option>
          <option value="salud">salud</option>
        </select>
      </div>

      {loading ? <p>Cargando datos...</p> : (
        <table>
            <thead>
            <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Trabajo</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {personas.length > 0 ? personas.map((persona) => (
                <tr key={persona.id}>
                <td>{persona.dni}</td>
                <td>{persona.nombre}</td>
                <td>{persona.apellido}</td>
                <td>{persona.trabajo}</td>
                <td>
                    <button className="action-button copy" onClick={() => navigator.clipboard.writeText(`${persona.trabajo} ${persona.dni}`)}>
                    Copiar
                    </button>
                    <button className="action-button delete" onClick={() => handleDelete(persona.id)}>
                    Eliminar
                    </button>
                </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="5">No se encontraron resultados.</td>
                </tr>
            )}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default PersonList;