// @ts-nocheck

const renderTags = (tags) => tags.map((t) => `<span class="label label-primary">${t.name}</span> `);

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

/**
 * Initialize the document search feature
 * 
 * @param {object[]} tagList list of tags retrieved from the server
 */
const initSearch_tagify = (tagList) => {

    const inputElement = document.getElementById('tags-search');
    const buttonSearch = document.getElementById('btn-search-by-tags');

    // because tagify only accepts property 'value' and not 'name'
    const tagsIfied = tagList.map(tag => ({ "value": tag.name, "id": tag.id }));

    // init the Tagify input (see https://yaireo.github.io/tagify/)
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
            "autocomplete" : true,
            "dropdown": {
                "enabled": 3
            },
            "mapValueToProp": "id",
            "whitelist": []
        }
    );

    tagify.on('input', function (e) {
         if(e.detail.length < 2 ) {
             return;
         }
        tagify.settings.whitelist = tagsIfied.filter(tag => tag.value.toLowerCase().indexOf(e.detail.toLowerCase()) >= 0);

        if (tagify.settings.whitelist.length) {
            console.log("showing");
            //e.stopPropagation();
            //e.preventDefault();
            tagify.dropdown.show.call(tagify);
            return false;
        }
    });

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
                    renderDocumentResultSet(docs, 'result-set');
                });
        } catch (error) {
            console.error(error);
        }
    });
};


const initSearch = (tagList) => {
    const inputElement = document.getElementById('tags-search');
    const buttonSearch = document.getElementById('btn-search-by-tags');

    // because tagify only accepts property 'value' and not 'name'
    const tagsIfied = tagList.map(tag => ({ "value": tag.name, "id": tag.id }));

    const $inputTags = $('#tags-search').selectize({
        "create": false,
        "valueField": 'id',
        "labelField": 'name',
        "searchField": 'name',
        "openOnFocus": false,
        "options" : tagList,
        "onChange" :  (value) =>  buttonSearch.disabled = $inputTags[0].selectize.items.length === 0,
        "onItemAdd" : (value, $item) =>  $inputTags[0].selectize.close()
    });
    const tagSelectize = $inputTags[0].selectize;
/*
    $inputTags[0].selectize.load( (cb) => {
        console.log("load");
        cb(tagList);
    });
    */

    // user clicks on search button
    buttonSearch.addEventListener('click', (ev) => {
        try {
            const queryTagIds = inputElement.value.split(',');

            const url = new URL('http://localhost:3000/api/v1/documents');
            url.search = new URLSearchParams({
                "tags": queryTagIds
            });

            fetch(url)
                .then(resp => resp.json())
                .then(docs => {
                    console.log(docs);
                    renderDocumentResultSet(docs, 'result-set');
                });
        } catch (error) {
            console.error(error);
        }
    });   
};

const loadTags = () => fetch("/api/v1/tags").then(resp => resp.json()).catch(err => console.error('failed to load tags', err));

const start = () => {
    console.log('starting ...');

    loadTags()
        .then(initSearch);
};
