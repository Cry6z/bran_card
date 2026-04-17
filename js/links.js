const socialLinks = [
    {
        title: "Catalog",
        url: "http://strxdale-catalog.vercel.app/",
        preview: "preview/catalog.png",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
    },
    {
        title: "GitHub",
        url: "https://github.com/Cry6z",
        preview: "preview/github.png",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`
    },
    {
        title: "Instagram",
        url: "https://www.instagram.com/verlorenbran",
        preview: "preview/ig.png",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`
    },
    {
        title: "Steam",
        url: "https://steamcommunity.com/profiles/76561199165908964/",
        preview: "preview/steam.png",
        icon: `<img src="icons/steam.png" alt="Steam" style="width: 22px; height: 22px; filter: brightness(0) invert(1);">`
    },
    {
        title: "Spotify",
        url: "https://open.spotify.com/user/31t4pdanvx27zaiw35tu2bmu5kqa",
        preview: "preview/spotify.png",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.372 12-12S18.627 0 12 0zm5.502 17.31c-.218.358-.684.47-1.042.252-2.875-1.758-6.495-2.156-10.757-1.18-.41.093-.82-.16-.914-.572-.093-.41.16-.82.572-.914 4.656-1.066 8.653-.615 11.89 1.363.358.218.47.684.25 1.05zm1.468-3.26c-.274.444-.858.583-1.302.308-3.29-2.023-8.303-2.61-12.185-1.433-.497.15-1.025-.13-1.176-.628-.15-.497.13-1.025.628-1.176 4.436-1.347 9.965-.694 13.725 1.62.443.273.582.853.31 1.31zm.128-3.395c-3.947-2.344-10.463-2.56-14.253-1.408-.606.184-1.25-.164-1.434-.77-.184-.606.164-1.25.77-1.434 4.34-1.318 11.536-1.062 16.082 1.637.544.323.724 1.03.4 1.575-.323.544-1.03.723-1.565.4z" /></svg>`
    },
    {
        title: "Roblox",
        url: "https://www.roblox.com/users/634367340/profile",
        preview: "preview/roblox.png",
        icon: `<img src="icons/roblox.png" alt="Roblox" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">`
    }
];

function renderLinks() {
    const container = document.querySelector('.links-container');
    if (!container) return;

    // Keep the games link (special case)
    const gamesLink = container.querySelector('.games-link-card');
    
    // Clear current contents
    container.innerHTML = '';

    socialLinks.forEach(link => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.className = 'link-card';
        linkEl.target = '_blank';
        linkEl.setAttribute('data-preview', link.preview);
        
        linkEl.innerHTML = `
            <div class="link-icon">${link.icon}</div>
            <span class="link-text">${link.title}</span>
            <div class="link-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
        `;
        container.appendChild(linkEl);
    });

    // Re-append the games link
    if (gamesLink) {
        container.appendChild(gamesLink);
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', renderLinks);
