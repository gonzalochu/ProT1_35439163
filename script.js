document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const registerFormDiv = document.getElementById('registerForm');
    const loginFormDiv = document.getElementById('loginForm');
    const welcomeSectionDiv = document.getElementById('welcomeSection');
    const welcomeUsernameSpan = document.getElementById('welcomeUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const guestBtn = document.getElementById('guestBtn');

    // Referencias a formularios y botones
    const registerForm = registerFormDiv.querySelector('form');
    const regUsernameInput = document.getElementById('regUsername');
    const regPasswordInput = document.getElementById('regPassword');
    const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
    const registerMessage = document.getElementById('registerMessage');

    const loginForm = loginFormDiv.querySelector('form');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage');

    // --- Funciones de utilidad ---

    // Función para mostrar un mensaje
    function showMessage(element, msg, type) {
        element.textContent = msg;
        element.className = 'message ' + type;
        element.style.display = 'block'; // Asegura que el mensaje sea visible
    }

    // Función para ocultar un mensaje
    function hideMessage(element) {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none';
    }

    // Función para ocultar todos los formularios y secciones
    function hideAllSections() {
        registerFormDiv.classList.add('hidden');
        loginFormDiv.classList.add('hidden');
        welcomeSectionDiv.classList.add('hidden');
    }

    // --- Lógica de Registro ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío por defecto del formulario

        hideMessage(registerMessage); // Oculta mensajes previos

        const username = regUsernameInput.value.trim();
        const password = regPasswordInput.value.trim();
        const confirmPassword = regConfirmPasswordInput.value.trim();

        if (username === '' || password === '' || confirmPassword === '') {
            showMessage(registerMessage, 'Todos los campos son obligatorios.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage(registerMessage, 'Las contraseñas no coinciden.', 'error');
            return;
        }

        // Simulación: Verificar si el usuario ya existe en localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username]) {
            showMessage(registerMessage, 'El nombre de usuario ya existe. Intenta con otro.', 'error');
            return;
        }

        // Guardar el nuevo usuario en localStorage
        users[username] = { password: password }; // En una app real, la contraseña se hashearía
        localStorage.setItem('users', JSON.stringify(users));

        showMessage(registerMessage, '¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
        
        // Opcional: limpiar los campos del formulario
        regUsernameInput.value = '';
        regPasswordInput.value = '';
        regConfirmPasswordInput.value = '';

        // Después de un registro exitoso, puede que quieras mostrar directamente el formulario de login
        setTimeout(() => {
            hideAllSections();
            loginFormDiv.classList.remove('hidden');
            hideMessage(registerMessage); // Oculta el mensaje de éxito del registro
        }, 2000); // Oculta el mensaje después de 2 segundos y cambia al login
    });

    // --- Lógica de Login ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío por defecto del formulario

        hideMessage(loginMessage); // Oculta mensajes previos

        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (username === '' || password === '') {
            showMessage(loginMessage, 'Ambos campos son obligatorios.', 'error');
            return;
        }

        // Simulación: Obtener usuarios de localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (!users[username] || users[username].password !== password) {
            showMessage(loginMessage, 'Usuario o contraseña incorrectos.', 'error');
            return;
        }

        // Login exitoso
        localStorage.setItem('currentUser', username); // Guarda el usuario actual en sesión
        window.location.href = 'principal.html';

        
        hideAllSections();
        welcomeSectionDiv.classList.remove('hidden');

        // Opcional: limpiar los campos del formulario
        loginUsernameInput.value = '';
        loginPasswordInput.value = '';
    });

    // --- Lógica de Cerrar Sesión ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser'); // Elimina el usuario de la sesión
        hideAllSections();
        loginFormDiv.classList.remove('hidden'); // Vuelve al formulario de login
        hideMessage(loginMessage); // Por si había un mensaje de login antes
    });

    guestBtn.addEventListener('click', () => {
        window.location.href = 'principal.html';
      });

    // --- Lógica para cambiar entre formularios ---
    showRegisterBtn.addEventListener('click', () => {
        hideAllSections();
        registerFormDiv.classList.remove('hidden');
        hideMessage(registerMessage);
        hideMessage(loginMessage);
    });

    showLoginBtn.addEventListener('click', () => {
        hideAllSections();
        loginFormDiv.classList.remove('hidden');
        hideMessage(registerMessage);
        hideMessage(loginMessage);
    });

    // --- Verificar sesión al cargar la página ---
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        welcomeUsernameSpan.textContent = currentUser;
        hideAllSections();
        welcomeSectionDiv.classList.remove('hidden');
    } else {
        // Por defecto, muestra el formulario de login al cargar la página
        hideAllSections();
        loginFormDiv.classList.remove('hidden');
    }
});