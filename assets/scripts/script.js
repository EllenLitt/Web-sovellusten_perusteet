function triggeri() {
    generoiSVG();                    //kutsutaan generoiSVG() -funktiota
}

function generoiSVG() {
    const SIVUMITTA = 20; // ruudun sivumitta pikseleina
    const sarakkeet_lkm = document.getElementById('sarake').value; //käyttäjän syöttämä sarakkeiden määrä
    const rivit_lkm = document.getElementById('rivi').value; //käyttäjän syöttämä rivien määrä
    const svg_kuva = document.getElementById('svg_kuva'); // svg elementti
    const taustaVari = document.getElementById('taustavari').value; //käyttäjän syöttämä taustaväri

    // Nollataan kuva, jos kuva on ollut olemassa
    svg_kuva.innerHTML = '';

    // Kuvan koko
    svg_kuva.setAttribute('width', sarakkeet_lkm * SIVUMITTA);
    svg_kuva.setAttribute('height', rivit_lkm * SIVUMITTA);

    // Luodaan ruudukko SVG-kuvaan käyttäjän antamien sarakkeiden ja rivien perusteella.
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

    // Vasemman napin toiminta: vaihtaa ruudun värin käyttäjän antamaan silmukan väriin.
    if (event.button === 0) {
        event.target.setAttribute('fill', silmukkaVari);
        console.log(`${kahvaId} muutettu silmukanväriseksi`);
    }

    // Oikean napin toiminta: vaihtaa ruudun värin taustaväriksi.
    if (event.button === 2) {
        event.target.setAttribute('fill', taustaVari);
        console.log(`${kahvaId} muutettu taustaväriseksi`);
    }
}
function instantiateSVGs() {
    // Haetaan kontaineri, johon kopioidut SVG-kuvat lisätään.
    const container = document.getElementById('kopioastia');
    container.innerHTML = '';  // poistetaan aikaisemmat kuvat

    // Luodaan kolme kopiota alkuperäisestä SVG-kuvasta ja lisätään ne kontaineriin.
    for (let i = 0; i < 3; i++) {
        const clonedSVG = document.getElementById('svg_kuva').cloneNode(true);
        const rects = clonedSVG.querySelectorAll('rect');
        /*rects.forEach(rect => { // poistetaan ruudukon viivat kopioista
            rect.removeAttribute('stroke');
            rect.removeAttribute('stroke-width');
            rect.setAttribute('stroke-width', '0.0');
            rect.setAttribute('stroke-opacity', '0.0');
        });*/
        container.appendChild(clonedSVG); // Lisätään kopio kontaineriin.
    }
}

instantiateSVGs();

// Detektori huomaamaan jos alkuperäinen kuva muuttuu, tekee uudelleen kopiokuvat
const observer = new MutationObserver(() => {
    instantiateSVGs();  // Re-instantiate SVGs when original changes
});

// Seuraa alkuperäisen SVG-kuvan muutoksia.
observer.observe(document.getElementById('svg_kuva'), {
    attributes: true,
    childList: true,
    subtree: true
});

//lataa SVG-kuvan tiedostoksi.
function downloadSVG(svgElementId, filename) {
    var svgElement = document.getElementById(svgElementId);
    // Lisätään namespace attribuutteja SVG elementtiin, 
    // jotta browserit pystyy näyttämään svg tiedoston suoraan latauksen jälkeen
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    var svgContent = svgElement.outerHTML;
    // Lisätään SVG tiedoston standarditiedot svg kuvan alkuun
    var svgHeader = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" \n' +
        '  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
    var koko_svg = svgHeader + svgContent;

    var blob = new Blob([koko_svg], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);

    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename || "image.svg";

    document.body.appendChild(downloadLink); // This is required for Firefox
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
}

// Lisätään kuuntelija nappiin, joka lataa SVG-kuvan.
document.getElementById('downloadButton').addEventListener('click', function () {
    downloadSVG("svg_kuva", "neule.svg");
});

document.addEventListener('DOMContentLoaded', () => {
    // feedback form logic goes here
    const form = document.querySelector('form');
    const message = document.querySelector('#message');
    const feedbackError = document.querySelector('#feedbackError');
    const feedbackCounter = document.querySelector('#feedbackCounter');
    const feedbackTextarea = document.querySelector('#feedback');

    feedbackTextarea.addEventListener('input', () => {
        const count = feedbackTextarea.value.length;
        feedbackCounter.textContent = `${count}/100`;
    });

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const feedbackTextarea = document.getElementById('feedback');
    const feedbackError = document.getElementById('feedbackError');
    const message = document.getElementById('message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (feedbackTextarea.value.trim() === '') {
            feedbackError.textContent = 'Please enter your feedback';
            feedbackError.style.display = 'block';
            return;
        }

        if (feedbackTextarea.value.length > 100) {
            feedbackError.textContent = 'Feedback cannot exceed 100 characters';
            feedbackError.style.display = 'block';
            return;
        }

        feedbackError.style.display = 'none';
        message.textContent = 'Thank you for your feedback';
        message.style.display = 'block';

        setTimeout(() => {
            message.style.display = 'none';
        }, 5000); // hide after 5 seconds
    });
});
});