// @ts-nocheck

const renderTags = (tags) => tags.map( (t) => `<span class="label label-primary">${t.name}</span> `);

const renderDocumentResultSet = (docs, containerId) => {
    console.log(docs);
    const html = docs.map(doc => `<tr id="${doc.id}">
        <td>${doc.id}</td>
        <td>${doc.name}</td>
        <td>${doc.content.originalName}</td>
        <td>${renderTags(doc.tags)}</td>
    </tr>`);
    document.getElementById(containerId).innerHTML = html;
};


const initSearch = () => {

    const inputElement = document.getElementById('tags-search');
    const buttonSearch = document.getElementById('btn-search-by-tags');

    const tagify = new Tagify(
        inputElement,
        {
            "enforceWhitelist": true,
            "delimiter": null,
            "tagTemplate": (v, tagData) => `<tag title='${v}'>
            <x title=''></x>
            <div>
                <span class='tagify__tag-text'>${v}</span>
            </div>
        </tag>`,
            "dropdown": {
                "enabled": 1
            },
            "mapValueToProp": "id",
            "whitelist": [
                { "value": "A", "id": "1" },
                { "value": "B", "id": "2" },
                { "value": "C", "id": "xTdSL7FDRAHWRo4l" }
            ]
        }
    );

    // enable search button when tag selected
    tagify.on('add', (e) => {
        buttonSearch.disabled = false;
    });

    // update search button state : disable when no tag selected
    tagify.on('remove', (e) => {
        buttonSearch.disabled = JSON.parse(inputElement.value).length === 0;
    });

    // user clicks on search button
    buttonSearch.addEventListener('click', (ev) => {
        try {
            const queryTagIds = JSON.parse(inputElement.value)
                .map(tag => tag.id)
                .join(',');

            const url = new URL('http://localhost:3000/api/v1/documents');
            url.search = new URLSearchParams({
                "tags": queryTagIds
            });

            fetch(url)
                .then(resp => resp.json())
                .then(docs => {
                    console.log(docs);
                    renderDocumentResultSet(docs,'result-set');
                });
        } catch (error) {
            console.error(error);
        }
    });
};


const start = () => {
    console.log('starting ...');
    initSearch();
};
