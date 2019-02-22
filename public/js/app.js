// @ts-nocheck
const NEW_TAG_PREFIX = 'tmd_tagId:';

const renderTags = (tags) => tags.map((t) => `<span class="label label-primary">${t.name}</span>`).join(' ');

const loadTags = () => fetch("/api/v1/tags")
    .then(resp => resp.json())
    .catch(err => console.error('failed to load tags', err));

const renderDocumentResultSet = (docs, containerId) => {
    console.log(docs);
    const html = docs.map(doc => `<tr>
        <td>${doc.id}</td>
        <td>
            <a href="#" data-action="preview-doc" data-doc-id="${doc.id}">${doc.content.originalName}</a>
            <small><a href="/api/v1/documents/${doc.id}/content?download=true">(download)</a></small>
        </td>
        <td>${renderTags(doc.tags)}</td>
    </tr>`);
    document.getElementById(containerId).innerHTML = html.join(' ');
};

const updateSelectOptions = (tagList, elementId) => {
    try {
        const selectize = document.getElementById(elementId).selectize;
        selectize.clear();
        selectize.clearOptions();
        selectize.addOption(tagList);
    } catch (error) {
        console.error(error);
    }
};

const refreshTagList = () => {
    return loadTags()
        .then(tagList => {
            updateSelectOptions(tagList, 'tags-import');
            updateSelectOptions(tagList, 'tags-search');
            initManageTags(tagList);
        });
};

const previewDoc = (docId) => {
    document.getElementById('iframe').src = docId ? `/api/v1/documents/${docId}/content` : "";
};

const initSearch = (tagList = []) => {
    const inputElement = document.getElementById('tags-search');
    const buttonSearch = document.getElementById('btn-search-by-tags');

    const $inputTags = $('#tags-search').selectize({
        "create": false,
        "valueField": 'id',
        "labelField": 'name',
        "searchField": 'name',
        "openOnFocus": false,
        "onChange": (value) => buttonSearch.disabled = $inputTags[0].selectize.items.length === 0,
        "onItemAdd": (value, $item) => $inputTags[0].selectize.close()
    });
    const tagSelectize = $inputTags[0].selectize;
    updateSelectOptions(tagList, 'tags-search');

    // user clicks on search button
    buttonSearch.addEventListener('click', (ev) => {
        try {
            previewDoc();
            const queryTagIds = inputElement.value.split(',');

            const url = new URL('http://localhost:3001/api/v1/documents');
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

    // Handle user click on one item in the result set
    document.getElementById('result-set').addEventListener('click', (ev) => {
        const { action } = ev.target.dataset;        
        switch (action) {
            case "preview-doc":
                ev.preventDefault();
                previewDoc(ev.target.dataset.docId);
                break;
            default:
                console.warn(`unsupported action : ${action}`);
        }
        //debugger;
    });
};
/**
 * Being given a list of value, returns an an array of object
 * representing exisintg tags (Id property) or new tag (name property)
 * 
 * @param {string} tagsInput comma separated list of entries 
 */
const createTagsToSubmit = (tagsInput) => {
    let hasNewTag = false;
    const tags = tagsInput.split(',').map(tagToken => {
        if (tagToken.indexOf(NEW_TAG_PREFIX) === -1) {
            return {
                "id": tagToken
            };
        }
        hasNewTag = true;
        return {
            "name": tagToken.substr(NEW_TAG_PREFIX.length)
        };
    })
    return {
        "hasNewTag": hasNewTag,
        "tags": tags
    }
};
/**
 * init the import document vies
 * 
 * @param {array} tagList list of all tags
 */
const initImportDocument = (tagList = []) => {
    const inputElement = document.getElementById('tags-import');
    const btnImportDoc = document.getElementById('btn-import-doc');

    const $inputTags = $('#tags-import').selectize({
        "create": true,
        "valueField": 'id',
        "labelField": 'name',
        "searchField": 'name',
        "openOnFocus": false,
        "onChange": (value) => btnImportDoc.disabled = $inputTags[0].selectize.items.length === 0,
        "onItemAdd": (value, $item) => {
            console.log(value);
            $inputTags[0].selectize.close();
        },
        //"persist" : false,
        "create": function (input) {
            console.log('creating');
            $inputTags[0].selectize.close();
            return {
                "id": `${NEW_TAG_PREFIX}${input}`,
                "name": input
            }
        }
    });
    const tagSelectize = $inputTags[0].selectize;
    updateSelectOptions(tagList, 'tags-import');

    // user clicks on search button
    btnImportDoc.addEventListener('click', (ev) => {
        try {
            const formData = new FormData();

            // process file content (upload) ////////////////////////////////////////

            const files = document.querySelector('[type=file]').files;
            if (files.length === 0) {
                console.warn('no file selected');
                return;
            }

            for(let i =0; i< files.length; i++) {
                formData.append('content', files[i]);
            }

            // Form tags ///////////////////////////////////////////////////////////

            const { hasNewTag, tags: importTagIds } = createTagsToSubmit(inputElement.value);
            formData.append('tags', JSON.stringify(importTagIds));

            // SUbmit 

            fetch("/api/v1/documents", {
                method: 'POST',
                body: formData
            }).then(response => {
                console.log(response);
                document.getElementById('add-document').querySelector('form').reset();
                tagSelectize.clear();
                if (hasNewTag) {
                    refreshTagList();
                }
            }).catch(error => {
                console.error(error);
                alert('failed to import document');
            });

        } catch (error) {
            console.error(error);
        }
    });
};
/**
 * init the view all tags section
 * 
 * @param {array} tagList list of all tags
 */
const initManageTags = (tagList = []) => {
    const taglistElement = document.getElementById('tag-list');
    taglistElement.innerHTML = renderTags(tagList);
};

const start = () => {
    console.log('starting ...');

    loadTags()
        .then((tagList) => {
            initSearch(tagList);
            initImportDocument(tagList);
            initManageTags(tagList);
        });
};
