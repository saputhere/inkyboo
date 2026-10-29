/* Product catalogue: edit names and items here. Every item shows at once in the grid. */
(function () {
  const WA_NUMBER = '94778375505';
  const FB_URL = 'https://facebook.com/inkyboo.co';

  function waLink(product) {
    const text = `Hi InkyBoo, I'm looking for ${product} or better. Can you help me?`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  const ICON = {
    camera: '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-3.5-5-1s3.5 1 5 1zm0 0c1.5-3 5-3.5 5-1s-3.5 1-5 1z"/>',
    polaroid: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><rect x="7" y="6" width="10" height="9"/><path d="M8 19h8"/>',
    cards: '<rect x="3" y="7" width="13" height="10" rx="1.5"/><path d="M7 4h12v10"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'
  };
  const svg = (paths, cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const WA_ICON = `<svg class="wa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 20.5l1.2-4.1A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.8c0 3.3 2.9 6.2 6.2 6.2l1-1.3-1.9-.9-.8.9c-1-.4-2.1-1.5-2.6-2.5l.9-.8-.8-1.9z"/></svg>`;

  const CATEGORIES = [
    { name: 'Photo Printing', icon: 'camera', desc: 'Standard, matte and gloss finishes in high resolution, from everyday prints to large formats.',
      items: ['Standard photo prints', 'Matte & gloss finish', 'High resolution prints', 'Large photo prints'] },
    { name: 'Personalised Gifts', icon: 'gift', desc: 'Custom gifts for birthdays, celebrations and every special occasion.',
      items: ['Custom mugs', 'Key tags', 'Name gifts', 'Special occasion gifts'] },
    { name: 'Polaroid Products', icon: 'polaroid', desc: 'Retro and vintage-style prints with a classic instant-camera feel.',
      items: ['Polaroid prints', 'Photo strips', 'Retro prints', 'Vintage style prints'] },
    { name: 'Memory Products', icon: 'cards', desc: 'Small keepsakes for events, memories and stories worth sharing.',
      items: ['Lomo cards', 'Photo cards', 'Event cards', 'Bookmarks', 'Mini prints'] },
    { name: 'Business Printing', icon: 'briefcase', desc: 'Professional print for businesses, events and official occasions.',
      items: ['Business cards', 'Flyers', 'Brochures', 'Posters', 'Invitations', 'Certificates'] },
    { name: 'Custom Design', icon: 'layers', desc: 'We design your print before production, from layouts to full brand materials.',
      items: ['Print design', 'Layout design', 'Social media graphics', 'Branding materials'] }
  ];

  const grid = document.getElementById('pgrid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(c => `
    <article class="pcat glass reveal">
      <div class="pcat-head">
        <div class="pcat-ico">${svg(ICON[c.icon], 'ic')}</div>
        <h3>${c.name}</h3>
      </div>
      <p class="pcat-desc">${c.desc}</p>
      <ul class="pitems">
        ${c.items.map(name => `
          <li class="pitem"><a href="${waLink(name)}" target="_blank" rel="noopener">${name}${WA_ICON}</a></li>`).join('')}
      </ul>
      <p class="pcat-foot">Or <a href="${FB_URL}" target="_blank" rel="noopener">message us on Facebook</a></p>
    </article>`).join('');
})();
