import L from "leaflet";

// Scooter/bike icon for delivery partner's live location marker
const scooterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none">
  <circle cx="12" cy="12" r="12" fill="#f97316"/>
  <g transform="translate(4,5)" fill="white">
    <circle cx="2.5" cy="11.5" r="1.8"/>
    <circle cx="13" cy="11.5" r="1.8"/>
    <path d="M2.5 11.5h0.5L5 6.5h3.2l1 2h2.3a1.8 1.8 0 0 1 1 .3l1 .7" stroke="white" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.5 3.5h2.2l.6 1.5" stroke="white" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <circle cx="6.3" cy="2.2" r="1" fill="white"/>
  </g>
</svg>
`;

// Home/pin icon for the delivery destination marker
const homePinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="26" height="34" fill="none">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#1f2937"/>
  <g transform="translate(5,5)" fill="white">
    <path d="M7 1L1 6v7h4V9h4v4h4V6L7 1z"/>
  </g>
</svg>
`;

const makeDivIcon = (svgString, size, anchor) =>
  L.divIcon({
    html: svgString,
    className: "", // prevent Leaflet's default white box styling
    iconSize: size,
    iconAnchor: anchor,
  });

export const scooterIcon = makeDivIcon(scooterSvg, [26, 26], [13, 13]);
export const homePinIcon = makeDivIcon(homePinSvg, [26, 34], [13, 34]);