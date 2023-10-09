function triggeri() {
    generoiSVG();
}

function generoiSVG() {
    const SIVUMITTA = 20; // ruudun sivumitta pikseleina
    const sarakkeet_lkm = document.getElementById('sarake').value;
    const rivit_lkm = document.getElementById('rivi').value;
    const svg_kuva = document.getElementById('svg_kuva');
    const taustaVari = document.getElementById('taustavari').value;

    // Nollataan kuva, jos kuva on ollut olemassa
    svg_kuva.innerHTML = '';

    // Kuvan koko
    svg_kuva.setAttribute('width', sarakkeet_lkm * SIVUMITTA);
    svg_kuva.setAttribute('height', rivit_lkm * SIVUMITTA);

    for (let i = 0; i < rivit_lkm; i++) {
        for (let j = 0; j < sarakkeet_lkm; j++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            valintaKahva = "pala_" + j.toString() + i.toString();
            rect.setAttribute('id', valintaKahva);
            rect.setAttribute('x', j * SIVUMITTA);
            rect.setAttribute('y', i * SIVUMITTA);
            rect.setAttribute('width', SIVUMITTA);
            rect.setAttribute('height', SIVUMITTA);
            rect.setAttribute('fill', taustaVari);
            rect.setAttribute('stroke', 'black');
            rect.setAttribute('stroke-width', '0.2');
            rect.setAttribute('stroke-opacity', '0.2');
            rect.addEventListener('mousedown', ruutuaKlikattu);
            rect.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            }); // Estetään browser oikean napin menun pomppaaminen

            svg_kuva.appendChild(rect);
        }
    }
}
function ruutuaKlikattu(event) {
    const taustaVari = document.getElementById("taustavari").value;
    const silmukkaVari = document.getElementById("silmukkavari").value;
    const kahvaId = event.target.id;

    if (event.button === 0) { // Oikean napin toiminta
        event.target.setAttribute('fill', silmukkaVari);
        console.log(`${kahvaId} muutettu silmukanväriseksi`);
    }

    if (event.button === 2) { // Vasemman napin toiminta
        event.target.setAttribute('fill', taustaVari);
        console.log(`${kahvaId} muutettu taustaväriseksi`);
    }
}
function instantiateSVGs() {
    const container = document.getElementById('kopioastia');
    container.innerHTML = '';  // poistetaan aikaisemmat kuvat

    for (let i = 0; i < 3; i++) {
        const clonedSVG = document.getElementById('svg_kuva').cloneNode(true);
        const rects = clonedSVG.querySelectorAll('rect');
        rects.forEach(rect => { // poistetaan ruudukko taustalta
            rect.removeAttribute('stroke');
            rect.removeAttribute('stroke-width');
            rect.setAttribute('stroke-width', '0.0');
            rect.setAttribute('stroke-opacity', '0.0');
        });
        container.appendChild(clonedSVG);
    }
}

instantiateSVGs();

// Detektori huomaamaan jos alkuperäinen kuva muuttuu, tekee uudelleen kopiokuvat
const observer = new MutationObserver(() => {
    instantiateSVGs();  // Re-instantiate SVGs when original changes
});

observer.observe(document.getElementById('svg_kuva'), {
    attributes: true,
    childList: true,
    subtree: true
});

// Tallennus pdf-muodossa
function downloadPDFFromSVG(svgElementId, filename) {
    var svgElement = document.getElementById(svgElementId);
    var svgContent = svgElement.outerHTML;

    var canvas = document.createElement('canvas');
    canvg(canvas, svgContent);

    var imgData = canvas.toDataURL('image/png');
    var pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save(filename || 'image.pdf');
}

// Tapahtuman käsittelijä tallennusnapille
var downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', function () {
    downloadPDFFromSVG('svg_kuva', 'knitstudio.pdf');
});


