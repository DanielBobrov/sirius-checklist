$(document).ready(function () {
    function toggleCheckbox(checkbox) {
        checkbox.prop('checked', !checkbox.prop('checked'));
        saveCheckboxState(checkbox);
    }

    function saveCheckboxState(checkbox) {
        var checkboxId = checkbox.attr('id');
        var isChecked = checkbox.prop('checked');

        $.ajax({
            url: '/save_state',
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
            url: '/save_all_states',
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