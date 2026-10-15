"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [code, setCode] = useState(
    "<h1>¡Hola Mundo!</h1>\n<style>\n  h1 { color: #3b82f6; font-family: sans-serif; }\n</style>"
  );

  const ejecutarPruebas = async () => {
    try {
      const respuesta = await fetch("http://localhost:8000/api/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: code }),
      });
      
      const resultado = await respuesta.json();
      
      if (resultado.exito) {
        alert(resultado.mensaje); 
      } else {
        alert(resultado.mensaje);
      }
    } catch (error) {
      alert("Error conectando con el servidor. ¿Está encendido FastAPI?");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  return (
    <main className="flex h-screen w-screen flex-col bg-slate-900 text-white font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800 shrink-0">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-400">Learn WebDesign</h1>
          <span className="ml-4 px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">Módulo 1: HTML Básico</span>
        </div>
        <div className="text-sm text-slate-400">Progreso: 0%</div>
      </nav>
      
      {/* Contenedor principal de 3 columnas */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Columna 1: La Lección (25% del ancho) */}
        <section className="w-1/4 border-r border-slate-700 bg-slate-900 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-slate-700 bg-slate-800/50">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Teoría e Instrucciones</h2>
          </div>
          <div className="p-5 flex-1 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Tu primera etiqueta</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                HTML usa etiquetas para estructurar el contenido de una página web. La etiqueta <code>&lt;h1&gt;</code> se utiliza para los títulos principales, haciéndolos grandes y destacados.
              </p>
            </div>
            
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 shadow-inner">
              <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                🎯 Reto de esta lección:
              </h4>
              <p className="text-sm text-slate-300">
                En el editor, cambia el texto "¡Hola Mundo!" que está dentro de las etiquetas <code>&lt;h1&gt;</code> por tu propio nombre.
              </p>
            </div>

            <button 
              onClick={ejecutarPruebas}
              className="w-full mt-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-md transition-all shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]"
            >
              Ejecutar pruebas
            </button>
          </div>
        </section>

        {/* Columna 2: Editor Monaco (50% del ancho) */}
        <section className="w-2/4 border-r border-slate-700 flex flex-col bg-[#1e1e1e]">
          <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
             <div className="flex gap-2">
               <span className="px-3 py-1 text-xs font-mono bg-[#1e1e1e] text-slate-300 rounded-t-md border-t border-l border-r border-slate-600">index.html</span>
             </div>
          </div>
          <div className="flex-1 w-full relative">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                wordWrap: "on",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </section>

        {/* Columna 3: Vista Previa (25% del ancho) */}
        <section className="w-1/4 bg-white flex flex-col">
          <div className="bg-slate-200 p-3 border-b border-slate-300 flex justify-between items-center">
            <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider pl-1">Navegador</h2>
          </div>
          <div className="flex-1 w-full bg-white relative">
            <iframe
              title="preview"
              className="w-full h-full border-none absolute inset-0"
              srcDoc={code}
              sandbox="allow-scripts"
            />
          </div>
        </section>
        
      </div>
    </main>
  );
}