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

    const response = await axios.post("http://localhost:5000/gabor", formData)

    const base64Image = response.data.imagen;
    console.log(base64Image)
    setFilteredImage(`data:image/jpeg;base64,${base64Image}`);

  };



  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Image Filter App</h1>
      {imagePreview && (
        <div>
          <img src={imagePreview} alt='Imagen' className="imagen"></img>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="mb-2">
        <option value="gabor">Gabor</option>
        <option value="sobel">Sobel</option>
        <option value="gaussian">Gaussian</option>
      </select>
      <input
        type="number"
        value={kernelSize}
        onChange={(e) => setKernelSize(parseInt(e.target.value))}
        className="mb-2 w-full"
      />
      <button onClick={applyFilter} className="bg-blue-500 text-white px-4 py-2 rounded">Apply Filter</button>

      {filteredImage && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Imagen con filtro: {filterType}</h2>
          <img src={filteredImage} alt="Filtered" className="imagen" />
        </div>
      )}
    </div>
  );
}

export default App
