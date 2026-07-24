import React from 'react';
import { categories } from '../services/storage.js';

function PublishModal({ publishData, onChange, onMediaChange, onClose, onPublish }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>Publicar un objeto</h3>
          <button className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <label>
          Título
          <input
            type="text"
            value={publishData.title}
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Ej. Bicicleta, libro, juego"
          />
        </label>

        <label>
          Categoría
          <select value={publishData.category} onChange={(event) => onChange('category', event.target.value)}>
            {categories.filter((item) => item !== 'all').map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Descripción breve
          <textarea
            value={publishData.description}
            onChange={(event) => onChange('description', event.target.value)}
            rows={3}
          />
        </label>

        <label>
          Qué buscas a cambio
          <textarea
            value={publishData.details}
            onChange={(event) => onChange('details', event.target.value)}
            rows={3}
          />
        </label>

        <label>
          Subir multimedia
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(event) => onMediaChange(event.target.files)}
          />
        </label>

        {publishData.media?.length > 0 && (
          <div className="media-preview-grid">
            {publishData.media.map((item, index) =>
              item.type.startsWith('video/') ? (
                <video key={index} src={item.src} controls className="media-preview" />
              ) : (
                <img key={index} src={item.src} alt={item.name} className="media-preview" />
              ),
            )}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onPublish}>
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishModal;
