const token = "IdvoyGScQ6CTyj2ZBKzRQLACvikqJKrq";
const spinner = `<span class="centered loader"></span>`

fetchArtists()
fetchGuitars()
fetchBlog();


async function fetchGuitars() {
    guitars.innerHTML = spinner;
    const url = "https://api.baserow.io/api/database/rows/table/548154/?user_field_names=true";
    let request = axios({
        method: "GET",
        url: url,
        headers: {
            Authorization: `Token ${token}`
        }
    }).then((results) => renderGuitars(results.data.results))
}

function parseRtf(rtfText) {
    let html = rtfText;

    // Headings
    html = html.replace(/^###\s+(.*)/gm, '<h3 class="p-3">$1</h3>');
    html = html.replace(/^##\s+(.*)/gm, '<h2 class="p-3">$1</h2>');
    html = html.replace(/^#\s+(.*)/gm, '<h1 class="p-3">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Underlined (custom, as it's not standard Markdown)
    // We'll assume "Underlined" specifically, or you might need a custom syntax for it.
    // For this example, we'll replace the literal word "Underlined" if it stands alone.
    // A more robust solution might require a specific custom syntax like __Underlined__
    // For now, let's just target the literal string for simplicity based on your example.
    html = html.replace(/^(Underlined)$/gm, '<u>$1</u>');


    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Code Block (multiline)
    html = html.replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');

    // Numbered List
    // This is a bit trickier with regex for multi-line. We'll handle it line by line.
    // First, convert specific list items, then wrap them in <ol> and <ul>
    const lines = html.split('\n');
    let inOrderedList = false;
    let inUnorderedList = false;
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Numbered List Items
        if (/^\d+\.\s+(.*)/.test(line)) {
            if (!inOrderedList) {
                processedLines.push('<ol>');
                inOrderedList = true;
                inUnorderedList = false; // Close UL if we were in one
            }
            processedLines.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`);
        }
        // Unordered List Items
        else if (/^-+\s+(.*)/.test(line)) {
            if (!inUnorderedList) {
                processedLines.push('<ul>');
                inUnorderedList = true;
                inOrderedList = false; // Close OL if we were in one
            }
            processedLines.push(`<li>${line.replace(/^-+\s+/, '')}</li>`);
        } else {
            // If not a list item, close any open lists
            if (inOrderedList) {
                processedLines.push('</ol>');
                inOrderedList = false;
            }
            if (inUnorderedList) {
                processedLines.push('</ul>');
                inUnorderedList = false;
            }
            // Add the line itself. If it's not a heading or code block already processed,
            // it should likely be a paragraph.
            // We need to ensure we don't double-wrap if it's already an HTML tag.
            if (line.trim() !== '' &&
                !line.startsWith('<h') &&
                !line.startsWith('<strong') &&
                !line.startsWith('<em') &&
                !line.startsWith('<u') &&
                !line.startsWith('<s') &&
                !line.startsWith('<a') &&
                !line.startsWith('<pre')) {
                processedLines.push(`<p>${line}</p>`);
            } else if (line.trim() !== '') { // For already processed tags
                processedLines.push(line);
            }
        }
    }

    // Close any open lists at the end of the text
    if (inOrderedList) {
        processedLines.push('</ol>');
    }
    if (inUnorderedList) {
        processedLines.push('</ul>');
    }

    // Join the processed lines
    html = processedLines.join('\n');

    // Clean up empty paragraphs that might be introduced by split/join
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/\n\s*\n/g, '\n'); // Remove extra newlines

    return html.trim(); // Trim any leading/trailing whitespace

}


function clearRtf(rtfText) {
    let html = rtfText;

    // Headings
    html = html.replace(/^###\s+(.*)/gm, '<p class="p-1">$1</p>');
    html = html.replace(/^##\s+(.*)/gm, '<p class="p-1">$1</p>');
    html = html.replace(/^#\s+(.*)/gm, '<p class="p-1"><strong>$1</strong></p>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Underlined (custom, as it's not standard Markdown)
    // We'll assume "Underlined" specifically, or you might need a custom syntax for it.
    // For this example, we'll replace the literal word "Underlined" if it stands alone.
    // A more robust solution might require a specific custom syntax like __Underlined__
    // For now, let's just target the literal string for simplicity based on your example.
    html = html.replace(/^(Underlined)$/gm, '<u>$1</u>');


    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Code Block (multiline)
    html = html.replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');

    // Numbered List
    // This is a bit trickier with regex for multi-line. We'll handle it line by line.
    // First, convert specific list items, then wrap them in <ol> and <ul>
    const lines = html.split('\n');
    let inOrderedList = false;
    let inUnorderedList = false;
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Numbered List Items
        if (/^\d+\.\s+(.*)/.test(line)) {
            if (!inOrderedList) {
                processedLines.push('<ol>');
                inOrderedList = true;
                inUnorderedList = false; // Close UL if we were in one
            }
            processedLines.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`);
        }
        // Unordered List Items
        else if (/^-+\s+(.*)/.test(line)) {
            if (!inUnorderedList) {
                processedLines.push('<ul>');
                inUnorderedList = true;
                inOrderedList = false; // Close OL if we were in one
            }
            processedLines.push(`<li>${line.replace(/^-+\s+/, '')}</li>`);
        } else {
            // If not a list item, close any open lists
            if (inOrderedList) {
                processedLines.push('</ol>');
                inOrderedList = false;
            }
            if (inUnorderedList) {
                processedLines.push('</ul>');
                inUnorderedList = false;
            }
            // Add the line itself. If it's not a heading or code block already processed,
            // it should likely be a paragraph.
            // We need to ensure we don't double-wrap if it's already an HTML tag.
            if (line.trim() !== '' &&
                !line.startsWith('<h') &&
                !line.startsWith('<strong') &&
                !line.startsWith('<em') &&
                !line.startsWith('<u') &&
                !line.startsWith('<s') &&
                !line.startsWith('<a') &&
                !line.startsWith('<pre')) {
                processedLines.push(`<p>${line}</p>`);
            } else if (line.trim() !== '') { // For already processed tags
                processedLines.push(line);
            }
        }
    }

    // Close any open lists at the end of the text
    if (inOrderedList) {
        processedLines.push('</ol>');
    }
    if (inUnorderedList) {
        processedLines.push('</ul>');
    }

    // Join the processed lines
    html = processedLines.join('\n');

    // Clean up empty paragraphs that might be introduced by split/join
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/\n\s*\n/g, '\n'); // Remove extra newlines

    return html.trim(); // Trim any leading/trailing whitespace

}


function renderGuitars(results) {
    let guitars = document.getElementById('guitars')
    let innerContent = ``;

    for (let i = 0; i < results.length; i++) {
        let guitar = results[i];
        innerContent += `
            <div class="container mb-4" style="width:100%;">
                <div class="box card bg-transparent text-light" style="height: 100%;">
                  <div class="card-header">${guitar.title}</div>

                    <img class="card-img-top centered" src="${guitar.photos[0].url}" width=25% alt="Card image cap">
                    <div class="card-body">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal${i}" class="card-link text-light">View</a>
                    </div>
                </div>
            </div>
            
            <!-- Modal -->
            <div class="modal fade bg-dark bd-example-modal-lg" id="exampleModal${i}" tabindex="-1" aria-labelledby="exampleModalLabel${i}" aria-hidden="true">
                <div class="box modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content bg-transparent border-0">
                        <div class="modal-header text-light">
                            <h5 class="modal-title" id="exampleModalLabel${i}">${guitar.title}</h5>
                            <button type="button" class="btn-close btn-outline-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-light">
                            <div class='container'>
                                <div class="centered">
                                    <div id="carouselModal-${i}" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-inner">
                                            ${guitar.photos.map((photo, index) => `
                                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                    <img src="${photo.url}" class="d-block w-100" alt="Guitar Image" width=25%>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselModal-${i}" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon"></span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#carouselModal-${i}" data-bs-slide="next">
                                            <span class="carousel-control-next-icon"></span>
                                        </button>
                                    </div>
                                </div>
                                <hr>
                                ${parseRtf(guitar.details)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    guitars.innerHTML = innerContent;
}


async function fetchArtists() {
    artists.innerHTML = spinner;
    const url = "https://api.baserow.io/api/database/rows/table/548156/?user_field_names=true";
    let request = axios({
        method: "GET",
        url: url,
        headers: {
            Authorization: `Token ${token}`
        }
    }).then((results) => renderArtists(results.data.results))

}


function renderArtists(results) {
    let artists = document.getElementById("artists");
    let innerContent = "";
    for (let i = 0; i < results.length; i++) {
        const artist = results[i];
        sessionStorage.setItem(artist.name, JSON.stringify(artist.guitars))
        innerContent += `
        <div class="container p-3 box mb-5">
            <h3 class="mb-3">${artist.name}</h3>
            <hr>
                    <div class="d-lg-flex d-block">
                <img width="100%" src="${artist.photos[0].url}" alt="">
                <div class="p-3">
                    <p class="text-light">
                        ${artist.about}
                    </p>
                    <a class="btn btn-sm btn-dark" onclick="showSignatures('${artist.name}')">View Guitars</a>
                </div>
            </div>
        </div>
        `;

    }

    artists.innerHTML = innerContent;
}


async function showSignatures(target) {
    let div = document.getElementById('signatures');
    let guitarIDs = JSON.parse(sessionStorage.getItem(target));

    let htmlContent = '';
    for (let i = 0; i < guitarIDs.length; i++) {
        let id = guitarIDs[i].id;
        let request = await axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/548154/${id}/?user_field_names=true`,
            headers: {
                Authorization: `Token ${token}`
            }
        })
        let guitar = request.data;
        console.log(guitar);
        htmlContent += `
        <div class="card container box mb-5 text-light">
            <h3 class="mb-3">${guitar.title}</h3>
            <div class="container">
                <div id="carousel-${id}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        ${guitar.photos.map((_, index) =>
            `<button type="button" data-bs-target="#carousel-${id}" data-bs-slide-to="${index}" class="carousel-indicator${index === 0 ? ' active' : ''}"></button>`
        ).join('')}
                    </div>
                    <div class="carousel-inner">
                        ${guitar.photos.map((photo, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${photo.url}" class="d-block w-100 img-fluid" height=350px alt="Guitar Photo" />
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${id}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${id}" data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                    </button>
                </div>
            </div>
            <div class="container text-start">
                ${clearRtf(guitar.details)}
            </div>
        </div>
    `;
    }


    modalHTML =
        `
            <div class="modal fade bg-dark" id="guitarModal" tabindex="-1" role="dialog" aria-labelledby="guitarModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-md">
                    <div class="modal-content bg-transparent border-0">
                        ${htmlContent}
                    </div>
                </div>
            </div>
        `;

    div.innerHTML = modalHTML;
    var myModal = new bootstrap.Modal(document.getElementById('guitarModal'));
    myModal.show();


}



async function fetchBlog() {
    artists.innerHTML = spinner;
    const url = "https://api.baserow.io/api/database/rows/table/548155/?user_field_names=true";
    let request = axios({
        method: "GET",
        url: url,
        headers: {
            Authorization: `Token ${token}`
        }
    }).then((results) => renderBlog(results.data.results))

}


function renderBlog(results) {
    let blog = document.getElementById("blog");
    let innerContent = "";
    for (let i = 0; i < results.length; i++) {
        const post = results[i];
        innerContent += `
        <div class="container p-3 box mb-5">
            <h3 class="mb-3">${post.title}</h3>
            <hr>
                    <div class="d-lg-flex d-block">
                <div class="p-3">
                    <p class="text-light">
                        ${post.text}
                    </p>
                </div>
            </div>
            <hr>
            ${new Date(post.posted).toLocaleString()}
        </div>
        `;

    }

    blog.innerHTML = innerContent;
}

