function getTeamName() {
    // Получаем полный URL
    const fullURL = document.URL;

    // Разбиваем URL на части по символу "/"
    const parts = fullURL.split('/');

    // Возвращаем последний элемент массива
    return parts[parts.length - 1];
}

function addCurator() {
    $.ajax({
        url: '/add_curator',
        method: 'GET',
        success: function (response) {
            navigator.clipboard.writeText(window.location.origin + "/" + response);
        },
        error: function (xhr, status, error) {
            alert("Ошибка :(");
        }
    });
}

function addChild(team_name) {
    $.ajax({
        url: '/add_child/' + team_name,
        method: 'GET',
        success: function (response) {
            navigator.clipboard.writeText(window.location.origin+"/"+response);
        },
        error: function (xhr, status, error) {
            alert("Ошибка :(");
        }
    });
}

function delete_team(team_name) {
    if (confirm('Точно хотите удалить команду ' + team_name + '?')) {
        $.ajax({
            url: '/delete_team/' + team_name,
            method: 'GET',
            success: function (response) {
                location.href = "/";
            },
            error: function (xhr, status, error) {
                alert("Ошибка :(");
            }
        });
    } else {
        // Do nothing!
        console.log('Thing was not saved to the database.');
    }
}

$(document).ready(function () {
    function toggleCheckbox(checkbox) {
        checkbox.prop('checked', !checkbox.prop('checked'));
        saveCheckboxState(checkbox);
    }

    let team_name = getTeamName();

    function saveCheckboxState(checkbox) {
        var checkboxId = checkbox.attr('id');
        var isChecked = checkbox.prop('checked');

        $.ajax({
            url: '/save_state/' + team_name,
            method: 'POST',
            data: JSON.stringify({
                id: checkboxId,
                state: isChecked
            }),
            contentType: 'application/json',
            success: function (response) {
                console.log('State saved successfully');
            },
            error: function (xhr, status, error) {
                console.error('Error saving state:', error);
            }
        });
    }

    // Обработчик изменения состояния чекбокса
    $('input[type="checkbox"]').change(function () {
        saveCheckboxState($(this));
    });

    // Обработчик клика по метке чекбокса
    $('.checkbox-item').click(function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение клика по метке
        var checkbox = $('#' + $(this.children[1]).attr('for'));
        toggleCheckbox(checkbox);
    });

    function updateAllCheckboxes(state) {
        $('input[type="checkbox"]').prop('checked', state);

        var checkboxStates = {};
        $('input[type="checkbox"]').each(function () {
            checkboxStates[$(this).attr('id')] = state;
        });

        $.ajax({
            url: '/save_all_states/' + team_name,
            method: 'POST',
            data: JSON.stringify(checkboxStates),
            contentType: 'application/json',
            success: function (response) {
                console.log('All states saved successfully');
            },
            error: function (xhr, status, error) {
                console.error('Error saving states:', error);
            }
        });
    }

    $('#checkAll').click(function () {
        updateAllCheckboxes(true);
    });

    $('#uncheckAll').click(function () {
        updateAllCheckboxes(false);
    });
});