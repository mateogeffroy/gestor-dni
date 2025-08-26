// Ruta: frontend/src/components/SearchBar.js

import React, { useState } from 'react';
import axios from 'axios';

// Este es el componente para el formulario de registro (modal o similar)
const RegistrationForm = ({ dni, apiUrl, onSuccess, onCancel }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [trabajo, setTrabajo] = useState('abc'); // Valor por defecto

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim() || !apellido.trim()) {
            alert('Nombre y apellido son obligatorios.');
            return;
        }

        try {
            const newPerson = { dni, nombre, apellido, trabajo };
            await axios.post(`${apiUrl}/personas`, newPerson);
            alert('¡Persona registrada con éxito!');
            onSuccess(); // Llama a la función para refrescar la lista
        } catch (error) {
            alert(`Error al registrar: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="registration-form">
            <h3>Registrar Nuevo DNI: {dni}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                />
                <select value={trabajo} onChange={(e) => setTrabajo(e.target.value)}>
                    <option value="abc">abc</option>
                    <option value="caja">caja</option>
                    <option value="salud">salud</option>
                </select>
                <div className="form-buttons">
                    <button type="submit">Guardar Registro</button>
                    <button type="button" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};


const SearchBar = ({ apiUrl, onRegistrationSuccess }) => {
    const [dni, setDni] = useState('');
    const [message, setMessage] = useState('');
    const [foundPerson, setFoundPerson] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const handleSearch = async () => {
        if (!dni.trim() || !/^\d+$/.test(dni.trim())) {
            setMessage('Por favor, ingrese un DNI válido (solo números).');
            setFoundPerson(null);
            setShowRegisterForm(false);
            return;
        }

        setMessage('Buscando...');
        setFoundPerson(null);
        setShowRegisterForm(false);

        try {
            const response = await axios.get(`${apiUrl}/personas/dni/${dni}`);
            setFoundPerson(response.data);
            setMessage(`El DNI '${dni}' ya está registrado.`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage(`El DNI '${dni}' no existe. Puede registrarlo.`);
                setShowRegisterForm(true); // Mostrar el formulario de registro
            } else {
                setMessage('Error al conectar con el servidor.');
            }
        }
    };
    
    const handleSuccess = () => {
        setShowRegisterForm(false);
        setDni('');
        setMessage('');
        onRegistrationSuccess(); // Llama a la función del padre para actualizar
    };

    return (
        <div className="search-container">
            <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ingresar DNI"
            />
            <button onClick={handleSearch}>Buscar / Registrar DNI</button>
            
            {message && <p>{message}</p>}
            
            {foundPerson && (
                 <button onClick={() => navigator.clipboard.writeText(`${foundPerson.trabajo} ${foundPerson.dni}`)}>
                  Copiar: {foundPerson.trabajo} {foundPerson.dni}
                </button>
            )}

            {showRegisterForm && (
                <RegistrationForm 
                    dni={dni} 
                    apiUrl={apiUrl}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowRegisterForm(false)}
                />
            )}
        </div>
    );
};

export default SearchBar;