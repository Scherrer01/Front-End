document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');

    // Validação em tempo real
    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    function validateForm() {
        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (usernameValue !== '' && passwordValue !== '') {
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
        } else {
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';
        }
    }

    // Inicialmente desabilitado
    loginBtn.disabled = true;
    loginBtn.style.opacity = '0.7';

    // Mostrar/ocultar senha
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Mudar ícone (opcional)
            const eyeIcon = this.querySelector('.eye-icon');
            if (type === 'text') {
                eyeIcon.textContent = '👁️‍🗨️';
            } else {
                eyeIcon.textContent = '👁️';
            }
        });
    }

    // Simulação de campos preenchidos (apenas para demonstração)
    // usernameInput.value = 'usuario_teste';
    // passwordInput.value = 'senha123';
    // validateForm();

    // Login animation e validação
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validação básica
        if (username.length < 3) {
            showError('Usuário deve ter pelo menos 3 caracteres');
            return;
        }

        if (password.length < 6) {
            showError('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Simular envio
        loginBtn.textContent = 'Entrando...';
        loginBtn.disabled = true;

        // Simular resposta do servidor
        setTimeout(() => {
            if (username === 'usuario_teste' && password === 'senha123') {
                showSuccess('Login realizado com sucesso! Redirecionando...');
                
                // Aqui você normalmente redirecionaria para a página principal
                setTimeout(() => {
                    alert('Bem-vindo ao Instagram! (Demonstração)');
                    loginBtn.textContent = 'Entrar';
                    loginBtn.disabled = false;
                    validateForm();
                }, 2000);
            } else {
                showError('Usuário ou senha incorretos');
                loginBtn.textContent = 'Entrar';
                loginBtn.disabled = false;
                validateForm();
            }
        }, 1500);
    });

    // Funções auxiliares para feedback
    function showError(message) {
        // Remover mensagens anteriores
        removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background-color: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
            text-align: center;
            border: 1px solid #ef9a9a;
        `;
        errorDiv.textContent = message;
        
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
        // Auto-remover após 3 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    function showSuccess(message) {
        removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background-color: #e8f5e8;
            color: #2e7d32;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
            text-align: center;
            border: 1px solid #a5d6a7;
        `;
        successDiv.textContent = message;
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }

    function removeMessages() {
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
    }

    // Placeholder animation fix
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Função para o botão "Esqueceu a senha"
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            showError('Funcionalidade de recuperação de senha em desenvolvimento');
        });
    }

    // Botão "Cadastre-se"
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showError('Página de cadastro em desenvolvimento');
        });
    }

    // Botão "Facebook"
    const facebookBtn = document.querySelector('.facebook-login');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showError('Login com Facebook em desenvolvimento');
        });
    }

    // Select de idioma
    const languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            showError(`Idioma alterado para: ${this.options[this.selectedIndex].text}`);
        });
    }

    // Login automático para demonstração (remover em produção)
    console.log('Dica: Use usuário: "usuario_teste" e senha: "senha123" para testar o login');
});