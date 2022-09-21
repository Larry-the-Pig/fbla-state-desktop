const deleteButton = document.querySelector('input.delete');

deleteButton.onclick = async function(e) {
    await fetch(document.URL, {
        method: 'delete',
    })

    //window.location.replace('/')
}