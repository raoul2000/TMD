// @ts-nocheck
const NEW_TAG_PREFIX = 'tmd_tagId:';

const renderTags = (tags) => tags.map((t) => `<span class="label label-primary">${t.name}</span>`).join(' ');

const loadTags = () => fetch("/api/v1/tags")
    .then(resp => resp.json())
    .catch(err => console.error('failed to load tags', err));

const renderDocumentResultSet = (docs, containerId) => {
    console.log(docs);
    const html = docs.map(doc => `<tr id="${doc.id}">
        <td>${doc.id}</td>
        <td>${doc.content.originalName}</td>
        <td>${renderTags(doc.tags)}</td>
    </tr>`);
    document.getElementById(containerId).innerHTML = html;
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

const initSearch = (tagList = []) => {
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
        "onChange": (value) => buttonSearch.disabled = $inputTags[0].selectize.items.length === 0,
        "onItemAdd": (value, $item) => $inputTags[0].selectize.close()
    });
    const tagSelectize = $inputTags[0].selectize;
    updateSelectOptions(tagList, 'tags-search');

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
        "hasNewTag" : hasNewTag,
        "tags" : tags 
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

    // because tagify only accepts property 'value' and not 'name'
    const tagsIfied = tagList.map(tag => ({ "value": tag.name, "id": tag.id }));

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
            // process file content (upload) ////////////////////////////////////////

            const files = document.querySelector('[type=file]').files;
            if (files.length === 0) {
                console.warn('no file selected');
                return;
            }

            const formData = new FormData();
            let file = files[0];
            formData.append('content', file);

            // Form tags ///////////////////////////////////////////////////////////
            
            const {hasNewTag, tags: importTagIds} = createTagsToSubmit(inputElement.value);
            formData.append('tags', JSON.stringify(importTagIds));

            // SUbmit 

            fetch("/api/v1/documents", {
                method: 'POST',
                body: formData
            }).then(response => {
                console.log(response);
                document.getElementById('add-document').querySelector('form').reset();   
                tagSelectize.clear();             
                if(hasNewTag) {
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
        .then( (tagList) => {
            initSearch(tagList);
            initImportDocument(tagList);
            initManageTags(tagList);
        });
};
