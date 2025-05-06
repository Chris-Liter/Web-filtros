//import React from "react";

import "./Principal.css";

import { useNavigate } from "react-router-dom";

function Principal() {

    const navigate = useNavigate();
    const navegar = () => {
        navigate("/inicio");
    }
    return (
        <>
            <div className="contenedor-principals">
                <div className="card">
                    <h1>Filtros con PYCUDA!</h1>
                    <div className="contenedor-imagenes">
                        <img src="nvidia.png" className="imagen-d"></img>
                        <h1>+</h1>
                        <img src="selfie.png" className="imagen-c"></img>
                    </div>
                    <h3>Esta Web te permitira crear asombrosos Filtros usando una tarjeta Grafica con CUDA!</h3>
                    <h3>Con nuestra Web podras aplicar filtros a tus fotos con estilos bien BACANES</h3>
                    <button onClick={navegar} className="boton-empezar">Empezar</button>
                </div>

                <div className="contenedor-filtros">
                    {/* Gabor */}
                    <div className="bloque-filtro">
                        <h3>Texturas</h3>
                        <div className="imagenes-filtro">
                        <img src="gausori.jpg" alt="Gabor original" className="mini-imagen" />
                        <img src="gabresul.jpg" alt="Gabor procesada" className="mini-imagen" />
                        </div>
                    </div>

                    {/* Laplaciano */}
                    <div className="bloque-filtro">
                        <h3>Grises</h3>
                        <div className="imagenes-filtro">
                        <img src="gausori.jpg" alt="Laplaciano original" className="mini-imagen" />
                        <img src="laplaresul.jpg" alt="Laplaciano procesada" className="mini-imagen" />
                        </div>
                    </div>

                    {/* Gaussian */}
                    <div className="bloque-filtro">
                        <h3>Borrosito</h3>
                        <div className="imagenes-filtro">
                        <img src="gausori.jpg" alt="Gaussian original" className="mini-imagen" />
                        <img src="gausresul.jpg" alt="Gaussian procesada" className="mini-imagen" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Principal;