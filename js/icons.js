/* 图鉴图标：内联 SVG，与安卓 Canvas 纹样一一对应 */
function iconSvg(key, color){
  var c = color || '#fff';
  var X = 'stroke="'+c+'" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  var F = 'fill="'+c+'"';
  switch(key){
    case 'silver':
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="26" r="12" '+X+'/><path d="M20 38v12M32 38v14M44 38v12" '+X+'/><circle cx="20" cy="52" r="2.6" '+F+'/><circle cx="32" cy="54" r="2.6" '+F+'/><circle cx="44" cy="52" r="2.6" '+F+'/></svg>';
    case 'thangka':
      return '<svg viewBox="0 0 64 64"><rect x="12" y="16" width="40" height="36" rx="4" '+X+'/><path d="M18 28h28M18 38h28" '+X+'/><rect x="9" y="10" width="46" height="5" rx="2.5" '+F+'/></svg>';
    case 'stripes':
      return '<svg viewBox="0 0 64 64"><path d="M14 12l10 40M25 12l10 40M36 12l10 40M47 12l6 24" '+X+'/></svg>';
    case 'fiddle':
      return '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="44" rx="17" ry="12" '+F+'/><ellipse cx="32" cy="34" rx="13" ry="8" '+F+'/><rect x="29" y="10" width="6" height="18" '+F+'/><rect x="25" y="5" width="14" height="6" rx="2" '+F+'/><circle cx="23" cy="8" r="2" '+F+'/><circle cx="41" cy="8" r="2" '+F+'/></svg>';
    case 'flame':
      return '<svg viewBox="0 0 64 64"><path d="M32 6c0 14-16 18-16 32 0 10 7 18 16 18s16-8 16-18C48 24 32 20 32 6z" '+F+'/><path d="M32 28c0 8-7 10-7 17 0 5 3 9 7 9s7-4 7-9c0-7-7-9-7-17z" fill="#FFD9A0"/></svg>';
    case 'ball':
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" '+F+'/><path d="M32 12v40M12 32h40M18 18l28 28M46 18L18 46" stroke="#E8402F" stroke-width="2.2" opacity=".5"/><circle cx="32" cy="32" r="4.5" fill="#FFD9A0"/></svg>';
    case 'feather':
      return '<svg viewBox="0 0 64 64"><path d="M14 52C26 40 36 26 52 14" '+X+'/><circle cx="48" cy="16" r="7" '+F+'/><circle cx="48" cy="16" r="3" fill="#FFD9A0"/><path d="M24 42c6-2 10-6 12-11" '+X+'/></svg>';
    case 'flower':
      return '<svg viewBox="0 0 64 64"><g '+F+'><ellipse cx="32" cy="20" rx="7" ry="9"/><ellipse cx="44" cy="28" rx="9" ry="7"/><ellipse cx="40" cy="42" rx="7" ry="9"/><ellipse cx="24" cy="42" rx="7" ry="9"/><ellipse cx="20" cy="28" rx="9" ry="7"/></g><circle cx="32" cy="32" r="5" fill="#FFD9A0"/></svg>';
    case 'dress':
      return '<svg viewBox="0 0 64 64"><path d="M26 10h12l10 44H16z" '+F+'/><ellipse cx="32" cy="12" rx="4" ry="3.4" fill="#FFD9A0"/></svg>';
    case 'rings':
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="7" '+X+'/><circle cx="32" cy="32" r="14" '+X+'/><circle cx="32" cy="32" r="21" '+X+'/><circle cx="17" cy="46" r="3" '+F+'/><circle cx="48" cy="19" r="2.4" '+F+'/></svg>';
    case 'axis':
      return '<svg viewBox="0 0 64 64"><path d="M32 8v44" '+X+'/><circle cx="32" cy="8" r="4.5" '+F+'/><circle cx="32" cy="22" r="2.8" '+F+'/><circle cx="32" cy="34" r="2.8" '+F+'/><circle cx="32" cy="46" r="2.8" '+F+'/><path d="M16 52h32" '+X+'/></svg>';
    case 'wall':
      return '<svg viewBox="0 0 64 64"><rect x="14" y="26" width="36" height="26" rx="3" '+F+'/><rect x="14" y="17" width="7" height="9" '+F+'/><rect x="27" y="17" width="7" height="9" '+F+'/><rect x="40" y="17" width="7" height="9" '+F+'/></svg>';
    case 'ribbon':
      return '<svg viewBox="0 0 64 64"><path d="M10 50C20 14 34 24 44 32c6 5 10 10 10 16" '+X+'/><path d="M18 52C28 26 40 32 48 44" '+X+'/></svg>';
    case 'waves':
      return '<svg viewBox="0 0 64 64"><path d="M10 40q7-7 14 0t14 0 14 0" '+X+'/><path d="M10 50q7-7 14 0t14 0 14 0" '+X+'/><path d="M32 30V12l12 8-12 4z" '+F+'/></svg>';
    case 'lake':
      return '<svg viewBox="0 0 64 64"><path d="M12 40a20 14 0 0140 0" '+X+'/><path d="M10 46h44M10 53h44" '+X+'/></svg>';
    case 'pavilion':
      return '<svg viewBox="0 0 64 64"><path d="M8 28L32 10l24 18z" '+F+'/><path d="M8 28c-2 4 2 6 4 2M56 28c2 4-2 6-4 2" '+X+'/><rect x="18" y="28" width="6" height="22" '+F+'/><rect x="40" y="28" width="6" height="22" '+F+'/><rect x="12" y="50" width="40" height="5" rx="2" '+F+'/></svg>';
    case 'seeds':
      return '<svg viewBox="0 0 64 64"><g '+F+'><ellipse cx="32" cy="14" rx="6.4" ry="5"/><ellipse cx="18" cy="26" rx="6.4" ry="5"/><ellipse cx="46" cy="26" rx="6.4" ry="5"/><ellipse cx="24" cy="40" rx="6.4" ry="5"/><ellipse cx="40" cy="40" rx="6.4" ry="5"/><ellipse cx="32" cy="52" rx="6.4" ry="5"/></g></svg>';
    case 'blossom':
      return '<svg viewBox="0 0 64 64"><g '+F+'><ellipse cx="32" cy="18" rx="6.6" ry="8.6"/><ellipse cx="45" cy="27" rx="8.6" ry="6.6"/><ellipse cx="40" cy="42" rx="6.6" ry="8.6"/><ellipse cx="24" cy="42" rx="6.6" ry="8.6"/><ellipse cx="19" cy="27" rx="8.6" ry="6.6"/></g><path d="M32 26l2.2 4.4 4.8.6-3.6 3.3.9 4.7-4.3-2.4-4.3 2.4.9-4.7-3.6-3.3 4.8-.6z" fill="#FFD9A0"/></svg>';
    case 'choir':
      return '<svg viewBox="0 0 64 64"><path d="M14 22a20 20 0 010 20M22 18a28 28 0 010 28M30 14a36 36 0 010 36" '+X+'/><circle cx="12" cy="32" r="3" '+F+'/><circle cx="50" cy="18" r="2.6" '+F+'/><circle cx="52" cy="46" r="2.2" '+F+'/></svg>';
    case 'drum':
      return '<svg viewBox="0 0 64 64"><path d="M32 8v48" '+X+'/><ellipse cx="32" cy="20" rx="15" ry="7" '+F+'/><ellipse cx="32" cy="44" rx="12" ry="6" '+F+'/><rect x="28" y="24" width="8" height="16" '+F+'/></svg>';
    case 'dutar':
      return '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="46" rx="12" ry="10" '+F+'/><ellipse cx="32" cy="32" rx="7" ry="8" '+F+'/><rect x="29" y="8" width="6" height="22" '+F+'/><rect x="26" y="4" width="12" height="5" rx="2" '+F+'/><path d="M30 6v38M34 6v38" stroke="#FFD9A0" stroke-width="1.2"/></svg>';
    case 'brocade':
      return '<svg viewBox="0 0 64 64"><path d="M12 22h40M12 32h40M12 42h40M22 14v36M32 12v40M42 14v36" '+X+'/><path d="M32 24l7 8-7 8-7-8z" '+F+'/></svg>';
    case 'loom':
      return '<svg viewBox="0 0 64 64"><path d="M20 14v36M28 14v36M36 14v36M44 14v36" '+X+'/><rect x="10" y="8" width="44" height="6" rx="2" '+F+'/><rect x="10" y="50" width="44" height="6" rx="2" '+F+'/><rect x="29" y="24" width="6" height="16" rx="2" '+F+'/></svg>';
    case 'festival':
      return '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="14" rx="6" ry="8" '+F+'/><ellipse cx="32" cy="50" rx="6" ry="8" '+F+'/><rect x="27" y="20" width="10" height="24" '+F+'/><circle cx="32" cy="32" r="8" '+X+'/><path d="M8 24l10 6M56 40l-10-6" '+X+'/></svg>';
    case 'script':
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="16" r="7" '+X+'/><path d="M12 48l10-16 10 16M34 32l8 16 10-16" '+X+'/><path d="M38 46q5-6 10 0" '+X+'/></svg>';
    case 'tower':
      return '<svg viewBox="0 0 64 64"><path d="M22 54L26 10h12l4 44z" '+F+'/><rect x="18" y="4" width="28" height="6" rx="2" '+F+'/><rect x="29" y="22" width="6" height="9" fill="#000" opacity=".25"/><rect x="29" y="38" width="6" height="9" fill="#000" opacity=".25"/></svg>';
    case 'oldtown':
      return '<svg viewBox="0 0 64 64"><rect x="14" y="20" width="36" height="32" rx="4" '+X+'/><path d="M14 36h36M32 20v32" '+X+'/><path d="M22 20V12M32 20V9M42 20V12" '+X+'/></svg>';
    case 'watertown':
      return '<svg viewBox="0 0 64 64"><path d="M10 30L32 12l22 18z" '+F+'/><rect x="18" y="30" width="28" height="14" '+F+'/><path d="M12 48q6-5 12 0t12 0 12 0" '+X+'/><path d="M12 55q6-5 12 0t12 0 12 0" '+X+'/></svg>';
    case 'island':
      return '<svg viewBox="0 0 64 64"><path d="M10 40q10-20 20-6 6-9 14-2 6-4 10 8z" '+F+'/><path d="M10 48q7-5 14 0t14 0 14 0" '+X+'/><path d="M26 34v-8M32 34v-10M38 34v-8" '+X+'/></svg>';
    case 'jade':
      return '<svg viewBox="0 0 64 64"><rect x="16" y="12" width="32" height="40" '+X+'/><circle cx="32" cy="32" r="7" '+X+'/><path d="M16 22h32M16 42h32" '+X+'/></svg>';
    case 'mask':
      return '<svg viewBox="0 0 64 64"><rect x="20" y="14" width="24" height="38" rx="10" '+F+'/><rect x="8" y="20" width="10" height="24" rx="3" '+F+'/><rect x="46" y="20" width="10" height="24" rx="3" '+F+'/><rect x="22" y="26" width="8" height="5" rx="2" fill="#000" opacity=".3"/><rect x="34" y="26" width="8" height="5" rx="2" fill="#000" opacity=".3"/><rect x="26" y="42" width="12" height="4" rx="2" fill="#000" opacity=".3"/></svg>';
    case 'canal':
      return '<svg viewBox="0 0 64 64"><path d="M10 26q22-10 44 0" '+X+'/><path d="M10 50q22-10 44 0" '+X+'/><path d="M26 40V18l10 6-10 4z" '+F+'/><rect x="20" y="40" width="22" height="6" rx="2" '+F+'/></svg>';
    case 'fruit':
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="38" r="17" '+F+'/><path d="M26 22l-3-12 6 5 3-8 3 8 6-5-3 12z" '+F+'/><circle cx="26" cy="34" r="2.6" fill="#FFD9A0"/><circle cx="38" cy="42" r="2.6" fill="#FFD9A0"/></svg>';
    case 'circle':
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="9" '+X+'/><circle cx="32" cy="32" r="17" '+X+'/><circle cx="32" cy="32" r="24" '+X+'/><circle cx="32" cy="8" r="2.6" '+F+'/><circle cx="53" cy="20" r="2.6" '+F+'/><circle cx="53" cy="44" r="2.6" '+F+'/><circle cx="32" cy="56" r="2.6" '+F+'/><circle cx="11" cy="44" r="2.6" '+F+'/><circle cx="11" cy="20" r="2.6" '+F+'/></svg>';
    default:
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="16" '+F+'/></svg>';
  }
}
