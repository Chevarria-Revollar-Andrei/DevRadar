import React from 'react';
// Indicador visual reutilizable mientras una API está respondiendo.
export default function Loading({ text = 'Consultando APIs...' }) {
  return <div className="loading"><span className="spinner" />{text}</div>;
}
