const deleteButton = document.querySelector('input.delete');
const editButton = document.querySelectorAll('input.put');
const submitButton = document.querySelector('input.submit')

deleteButton.onclick = async function(e) {
    await fetch(document.URL, {
        method: 'delete',
    })

    window.location.replace('/students')
}

editButton.forEach(function(editButton) {
    editButton.onclick = edit;
})

function edit(e) {
    document.querySelectorAll('div, form').forEach(function(div) {
        div.classList.toggle('hidden')
    })
    document.querySelector('input').focus()
    //document.createElement('p').classList.
}