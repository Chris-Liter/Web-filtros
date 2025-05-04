import { ChangeEvent, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import axios from 'axios'


function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("gabor");
  const [kernelSize, setKernelSize] = useState<number>(5);
  const [sigma, setSigma] = useState<number>(1);
  const [blockX, setBlockX] = useState<number>(32);
  const [blockY, setBlockY] = useState<number>(32);

  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [returnedMask, setReturnedMask] = useState<number | null>(null);
  const [returnedSigma, setReturnedSigma] = useState<number | null>(null);
  const [returnedBlockX, setReturnedBlockX] = useState<number | null>(null);
  const [returnedBlockY, setReturnedBlockY] = useState<number | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
    
    const file = e.target.files?.[0];

    if (file) {
      // Crear un objeto URL para la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file); // Lee la imagen como URL
    }
  };

  

  const applyFilter = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("mask", kernelSize.toString());
    formData.append("filter_type", filterType);
    formData.append("block_x", blockX.toString());
    formData.append("block_y", blockY.toString());

    //Enviar sigma solo si el filtro es gaussiano
    if (filterType === "gaussian") {
      formData.append("sigma", sigma.toString());
    }

    //const response = await axios.post("http://localhost:5000/gabor", formData)

    //Determinar el endpoint según el filtro
    let endpoint = "http://localhost:5000/";
    if (filterType === "gabor") {
      endpoint += "gabor";
    } else if (filterType === "laplaciano") {
      endpoint += "sobel";
    } else if (filterType === "gaussian") {
      endpoint += "gaussiano"; 
    }

    try {
      const response = await axios.post(endpoint, formData);
      const base64Image = response.data.imagen;
      setFilteredImage(`data:image/jpeg;base64,${base64Image}`);

      setExecutionTime(response.data.tiempo_ejecucion);
      setReturnedMask(response.data.mask);
      setReturnedSigma(response.data.sigma ?? null); // solo si viene sigma
      setReturnedBlockX(response.data.block_x);
      setReturnedBlockY(response.data.block_y);

    } catch (error) {
      console.error("Error al aplicar filtro:", error);
    }

  };



  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Image Filter App</h1>
      {imagePreview && (
        <div>
          <img src={imagePreview} alt='Imagen' className="imagen"></img>
        </div>
      )}

      <div>
        <label htmlFor="imageInput">Selecciona una imagen:</label>
        <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="mt-1 w-full" />
      </div>

      <div>
        <label htmlFor="filterSelect">Filtro a aplicar:</label>
        <select
          id="filterSelect"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="gabor">Gabor</option>
          <option value="sobel">Sobel</option>
          <option value="gaussian">Gaussian</option>
        </select>
      </div>


      <div>
        <label htmlFor="kernelSize">Tamaño de la máscara (kernel):</label>
        <input
          id="kernelSize"
          type="number"
          value={kernelSize}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setKernelSize(isNaN(value) ? 0 : value);
          }}
        />
      </div>

      {filterType === "gaussian" && (
        <div className="mb-4">
          <label htmlFor="sigmaInput">Sigma (solo para Gaussian):</label>
          <input
            id="sigmaInput"
            type="number"
            value={sigma}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setSigma(isNaN(value) ? 0 : value);
            }}
            placeholder="Sigma"
            min={0.1}
            step={0.1}
          />
        </div>
      )}

      <div>
        <label htmlFor="blockX">Block X (hilos en X):</label>
        <input
          id="blockX"
          type="number"
          value={blockX}
          onChange={(e) => setBlockX(parseInt(e.target.value))}
          min={1}
          max={32}
        />
      </div>

      <div>
        <label htmlFor="blockY">Block Y (hilos en Y):</label>
        <input
          id="blockY"
          type="number"
          value={blockY}
          onChange={(e) => setBlockY(parseInt(e.target.value))}
          min={1}
          max={32}
        />
      </div>


      <button onClick={applyFilter}> Aplicar Filtro </button>

      {filteredImage && (
        <div className="mt-6">
          <h2>Resultado del procesamiento</h2>
          <img src={filteredImage} alt="Filtered" className="imagen" />
          <div className="resultado-info">
            {executionTime !== null && <p> Tiempo de ejecución: <strong>{executionTime} ms</strong></p>}
            {returnedMask !== null && <p> Tamaño de máscara: <strong>{returnedMask} x {returnedMask} </strong></p>}
            {filterType === "gaussian" && returnedSigma !== null && (
              <p>Sigma aplicado: <strong>{returnedSigma}</strong></p>
            )}
            {returnedBlockX !== null && <p>Block X: <strong>{returnedBlockX}</strong></p>}
            {returnedBlockY !== null && <p>Block Y: <strong>{returnedBlockY}</strong></p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App
