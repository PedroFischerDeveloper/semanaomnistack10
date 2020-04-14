import React, {useState, useEffect} from 'react';

import './styles.css';

export default function DevForm({onSubmit}) {

  const [github_username, setGithubUsername] = useState("");
  const [techs, setTechs] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);

      },
      (err) => {
        console.log(err);
      }, 
      {
        timeout: 3000,
      }
    );
  }, [])
  

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      github_username,
      techs,
      latitude,
      longitude
    });
    
    setGithubUsername('');
    setTechs('');

  }


    return (
        <form onSubmit={handleSubmit}>
          
          <div className="input-block">
            <label htmlFor="github_username">Usuário do github</label>
            <input 
              type="text" 
              name="github_ursername" 
              id="github_username" 
              onChange={e => setGithubUsername(e.target.value)}
              value={github_username}
              required/>
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input 
              type="text" 
              name="techs" 
              id="techs" 
              onChange={e => setTechs(e.target.value)}
              value={techs}
              required/>
          </div>

          <div className="input-group">
            
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input 
                type="number" 
                name="latitude" 
                id="latitude" 
                onChange={(e => setLatitude(e.target.value))}
                value={latitude} 
                required/>
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input 
                type="number" 
                name="longitude" 
                id="longitude"
                onChange={e => setLongitude(e.target.value)} 
                value={longitude} 
                required/> 
            </div>

          </div>

          <button type="submit">Salvar</button>
        </form>
    )
}