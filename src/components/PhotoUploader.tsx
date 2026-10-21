import React, { useRef } from 'react';
import { BadgeData } from '../types';

interface PhotoUploaderProps {
  badge: BadgeData;
  onChange: (updated: Partial<BadgeData>) => void;
}

const SAMPLE_PORTRAITS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ badge, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange({
        photoUrl: result,
        photoScale: 1.0,
        photoOffsetX: 0,
        photoOffsetY: 0
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUseSample = (url: string) => {
    onChange({
      photoUrl: url,
      photoScale: 1.0,
      photoOffsetX: 0,
      photoOffsetY: 0
    });
  };

  const handleClear = () => {
    onChange({
      photoUrl: null,
      photoScale: 1.0,
      photoOffsetX: 0,
      photoOffsetY: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="photo-uploader-component">
      <div className="photo-uploader-header">
        <label className="section-subheading">Participant Photograph</label>
        <span className="photo-crop-badge">Auto-Cropped into Vector Frame</span>
      </div>

      <div className="photo-action-buttons">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-upload-photo"
        >
          Upload Photo
        </button>

        {badge.photoUrl ? (
          <button type="button" onClick={handleClear} className="btn-clear-photo">
            Remove Photo (Use Initials)
          </button>
        ) : (
          <div className="sample-avatars-row">
            <span className="sample-text">Try demo portrait:</span>
            {SAMPLE_PORTRAITS.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Sample ${i + 1}`}
                className="sample-avatar-thumb"
                onClick={() => handleUseSample(url)}
                title="Click to use sample portrait"
              />
            ))}
          </div>
        )}
      </div>

      {/* Crop / Zoom / Position sliders if a photo is loaded */}
      {badge.photoUrl && (
        <div className="photo-controls-panel">
          <div className="photo-slider-row">
            <div className="slider-label-group">
              <span>Zoom Scale</span>
              <span className="slider-val">{badge.photoScale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={badge.photoScale}
              onChange={(e) => onChange({ photoScale: parseFloat(e.target.value) })}
              className="studio-slider"
            />
          </div>

          <div className="photo-sliders-2col">
            <div className="slider-col">
              <div className="slider-label-group">
                <span>Pan X</span>
                <span className="slider-val">{badge.photoOffsetX}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={badge.photoOffsetX}
                onChange={(e) => onChange({ photoOffsetX: parseInt(e.target.value) })}
                className="studio-slider"
              />
            </div>

            <div className="slider-col">
              <div className="slider-label-group">
                <span>Pan Y</span>
                <span className="slider-val">{badge.photoOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={badge.photoOffsetY}
                onChange={(e) => onChange({ photoOffsetY: parseInt(e.target.value) })}
                className="studio-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
