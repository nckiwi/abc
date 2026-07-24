import React from 'react';

function PublishPage({ publishData, categories: allCategories, onChange, onMediaChange, onPublish, onClose }) {
  return (
    <main className="publish-page">
      <div className="publish-hero">
        <div>
          <h2>Publica tu objeto en AporB</h2>
          <p>Crea un anuncio atractivo con fotos, detalles y qué buscas a cambio.</p>
        </div>
        <button className="btn btn-secondary" onClick={onClose}>
          Volver al feed
        </button>
      </div>

      <section className="publish-grid">
        <div className="publish-form-card">
          <h3>Detalles del anuncio</h3>

          <label>
            Título del artículo
            <input
              type="text"
              value={publishData.title}
              onChange={(event) => onChange('title', event.target.value)}
              placeholder="Ej. Bicicleta urbana, lote de libros"
            />
          </label>

          <div className="publish-row">
            <label>
              Categoría
              <select value={publishData.category} onChange={(event) => onChange('category', event.target.value)}>
                {allCategories.filter((item) => item !== 'all').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Estado
              <select value={publishData.condition} onChange={(event) => onChange('condition', event.target.value)}>
                <option value="nuevo">Nuevo</option>
                <option value="bueno">Buen estado</option>
                <option value="usado">Usado</option>
              </select>
            </label>
          </div>

          <label>
            Ubicación
            <input
              type="text"
              value={publishData.location}
              onChange={(event) => onChange('location', event.target.value)}
              placeholder="Ciudad, barrio o zona"
            />
          </label>

          <label>
            Descripción breve
            <textarea
              value={publishData.description}
              onChange={(event) => onChange('description', event.target.value)}
              rows={3}
              placeholder="Describe tu artículo en pocas palabras"
            />
          </label>

          <label>
            Qué buscas a cambio
            <textarea
              value={publishData.details}
              onChange={(event) => onChange('details', event.target.value)}
              rows={3}
              placeholder="Ej. cambio por libros, ropa, herramientas"
            />
          </label>

          <label>
            Fotos o video del artículo
            <input type="file" accept="image/*,video/*" multiple onChange={(event) => onMediaChange(event.target.files)} />
          </label>

          <div className="publish-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={onPublish}>
              Publicar anuncio
            </button>
          </div>
        </div>

        <aside className="publish-preview-card">
          <div className="preview-header">
            <h4>Vista previa rápida</h4>
            <span>Si subes más de una imagen, la galería se adapta al tamaño.</span>
          </div>
          <div className="preview-panel">
            <strong>{publishData.title || 'Título del artículo'}</strong>
            <span>{publishData.category ? publishData.category.charAt(0).toUpperCase() + publishData.category.slice(1) : 'Categoría'}</span>
            <p>{publishData.description || 'La descripción aparecerá aquí cuando escribas algo sobre tu artículo.'}</p>
            <div className="preview-meta">
              <span>{publishData.condition ? `Estado: ${publishData.condition}` : 'Estado'}</span>
              <span>{publishData.location || 'Ubicación'}</span>
            </div>

            {publishData.media?.length > 0 ? (
              <div className="publish-media-grid">
                {publishData.media.map((item, index) =>
                  item.type.startsWith('video/') ? (
                    <video key={index} src={item.src} controls className="publish-media-item" />
                  ) : (
                    <img key={index} src={item.src} alt={item.name} className="publish-media-item" />
                  ),
                )}
              </div>
            ) : (
              <div className="publish-media-placeholder">
                <p>Sube imágenes o video para destacar tu publicación.</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PublishPage;
