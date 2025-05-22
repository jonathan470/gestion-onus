// Función para mostrar alertas personalizadas
function showCustomAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.textContent = message;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 4000); // Duración de la animación
}

// Función principal para enviar la solicitud
async function sendRequest(action) {
    const textarea = document.getElementById('id-input');
    const ids = textarea.value.split('\n').map(id => id.trim()).filter(Boolean);

    if (ids.length === 0 || ids.length > 10) {
        showCustomAlert('Debe ingresar entre 1 y 10 IDs.', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids })
        });

        const result = await response.json();

        let message = '';
        if (action === 'disable') {
            message = `ONUs deshabilitadas correctamente: ${ids.join(', ')}`;
        } else if (action === 'enable') {
            message = `ONUs habilitadas correctamente: ${ids.join(', ')}`;
        } else if (action === 'disableCatv') {
            message = `CATV deshabilitado correctamente para: ${ids.join(', ')}`;
        } else if (action === 'enableCatv') {
            message = `CATV habilitado correctamente para: ${ids.join(', ')}`;
        }

        showCustomAlert(message, 'success');
    } catch (error) {
        showCustomAlert("Ocurrió un error: " + error.message, 'error');
    }
}

// Asignar eventos a los botones
document.getElementById('disable-onu').addEventListener('click', () => sendRequest('disable'));
document.getElementById('enable-onu').addEventListener('click', () => sendRequest('enable'));
document.getElementById('disable-catv').addEventListener('click', () => sendRequest('disableCatv'));
document.getElementById('enable-catv').addEventListener('click', () => sendRequest('enableCatv'));