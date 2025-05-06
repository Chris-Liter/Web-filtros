import { ChangeEvent, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

import axios from 'axios'


function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const backupImage = "pregunta.jpg";
  const loadingImage = "pregunta.jpg";
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

  const [totalThreads, setTotalThreads] = useState<number | null>(null);
  const [totalBlocks, setTotalBlocks] = useState<number | null>(null);
  
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

    setIsProcessing(true); // comenzar procesamiento

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
      endpoint += "laplaciano";
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
      setTotalThreads(response.data.threads_total ?? null);
      setTotalBlocks(response.data.blocks_total ?? null);

    } catch (error) {
      console.error("Error al aplicar filtro:", error);
    } finally {
      setIsProcessing(false); // finalizar procesamiento
    }

  };



  return (
    <div>
    <h1 className="title">Image Filter App</h1>

   

    <div className="contenedor-principal">
      {/* Columna izquierda - Imagen original */}
      <div className="columna-izquierda">
        <h2>Original</h2>
        <img
          src={imagePreview || backupImage}
          alt='Imagen original'
          className="imagen"
        />
      </div>

      {/* Columna central - Inputs */}
      <div className="columna-centro">
        <div>
          <label htmlFor="imageInput">Selecciona una imagen:</label>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <label htmlFor="filterSelect">Filtro a aplicar:</label>
          <select
            id="filterSelect"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}>
            <option value="gabor">Gabor</option>
            <option value="laplaciano">Laplaciano</option>
            <option value="gaussian">Gaussian</option>
          </select>
        </div>

        <div>
          <label htmlFor="kernelSize">Tamaño de la máscara (kernel):</label>
          <input
            id="kernelSize"
            type="number"
            value={kernelSize}
            onChange={(e) => setKernelSize(parseInt(e.target.value))}
          />
        </div>

        {filterType === "gaussian" && (
          <div>
            <label htmlFor="sigmaInput">Sigma (solo para Gaussian):</label>
            <input
              id="sigmaInput"
              type="number"
              value={sigma}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
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

        <button onClick={applyFilter}>Aplicar Filtro</button>
      </div>

      {/* Columna derecha - Resultados */}
      <div className="columna-derecha">
        <h2>Resultado</h2>
        <img
          src={
            isProcessing
              ? loadingImage
              : filteredImage
              ? filteredImage
              : backupImage
          }
          alt="Resultado"
          className="imagen"
        />

      </div>
    </div>

    {!isProcessing && filteredImage && (
          <div className="resultados-globales">
            {executionTime !== null && (
              <p>Tiempo de ejecución: <strong>{executionTime} ms</strong></p>
            )}
            {returnedMask !== null && (
              <p>Tamaño de máscara: <strong>{returnedMask} x {returnedMask}</strong></p>
            )}
            {filterType === "gaussian" && returnedSigma !== null && (
              <p>Sigma aplicado: <strong>{returnedSigma}</strong></p>
            )}
            {returnedBlockX !== null && (
              <p>Block X: <strong>{returnedBlockX}</strong></p>
            )}
            {returnedBlockY !== null && (
              <p>Block Y: <strong>{returnedBlockY}</strong></p>
            )}
            {totalThreads !== null && (
              <p>Hilos totales: <strong>{totalThreads}</strong></p>
            )}
            {totalBlocks !== null && (
              <p>Bloques totales: <strong>{totalBlocks}</strong></p>
            )}
          </div>
        )}

  </div>
  );
}

export default App
