import React, { useEffect } from 'react';

export default function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
  schema 
}) {
  useEffect(() => {
    // 1. Title
    const siteTitle = 'Nurseha Audio';
    document.title = title ? `${title} | ${siteTitle}` : 'Nurseha Audio - Pusat Sound System Terlengkap Indoor & Outdoor';

    // 2. Meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

    // 3. Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: title || siteTitle },
      { property: 'og:description', content: description || 'Toko online sound system dan speaker profesional bergaransi resmi di TM Harco Glodok Jakarta.' },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonical || window.location.href },
      { property: 'og:type', content: 'website' }
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // 4. Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || window.location.href);

    // 5. JSON-LD Schema
    let scriptTag = document.querySelector('script[data-seo-schema="true"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.setAttribute('data-seo-schema', 'true');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonical, ogImage, schema]);

  return null;
}
