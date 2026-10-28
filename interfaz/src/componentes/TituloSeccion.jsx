import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Encabezado reutilizable para las secciones del panel, con título y acción opcional.
export default function SectionTitle({ icon: Icon, title, subtitle, action, onAction }) {
  return <div className="section-title">
    <div className="section-heading">
      <span className="section-icon"><Icon size={19} /></span>
      <div><h2>{title}</h2><p>{subtitle}</p></div>
    </div>
    {action && <button className="text-action" onClick={onAction}>{action}<ArrowUpRight size={15} /></button>}
  </div>;
}
