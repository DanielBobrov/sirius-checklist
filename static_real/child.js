function _0x1hl439() {
    $.ajax({
        url: '/get_update',
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            let cont = document.querySelector(".checkbox-container")
            cont.innerHTML = response;
        },
        error: function (xhr, status, error) {
            console.error('Error saving state:', error);
        }
    });
}

let interval = setInterval(_0x1hl439, 3000);