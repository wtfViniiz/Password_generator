/**
 * @author Vinicios Tavares
 * @version 1.0
 */

// Elements
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordConfirmationInput = document.getElementById("password-confirmation");
const generatePasswordBtn = document.getElementById("generate-password");
const generatedPasswordContainer = document.getElementById("generated-password");
const generatedPasswordText = document.getElementById("password-output");
const generatedPasswordLabel = generatedPasswordContainer?.querySelector("p");
const copyPasswordBtn = document.getElementById("copy-password-btn");
const copySuccessMessage = document.getElementById("copy-success-message");
const card = document.getElementById("register-container");
const submitBtn = document.getElementById("submit-btn");

// Options
const passwordOptions = document.getElementById("password-options");
const passwordLengthSlider = document.getElementById("password-length");
const lengthValue = document.getElementById("length-value");
const includeUppercase = document.getElementById("include-uppercase");
const includeLowercase = document.getElementById("include-lowercase");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");

// Strength
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");
const passwordStrengthInfo = document.getElementById("password-strength-info");

// Error
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const passwordConfirmationError = document.getElementById("password-confirmation-error");

if (card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  });
}

// Functions to generate characters
const getLetterLowerCase = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
};

const getLetterUpperCase = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};

const getNumber = () => {
  return Math.floor(Math.random() * 10).toString();
};

const getSymbol = () => {
  const symbols = "(){}[]=<>/!@#$%&*,.;:~^-+?";
  return symbols[Math.floor(Math.random() * symbols.length)];
};

// Function to generate password
const generatePassword = () => {
  const passwordLength = parseInt(passwordLengthSlider?.value || 10);


  if (!includeUppercase?.checked && !includeLowercase?.checked &&
    !includeNumbers?.checked && !includeSymbols?.checked) {
    showError(passwordError, "Selecione pelo menos um tipo de caractere");
    return;
  }

  const generators = [];
  if (includeUppercase?.checked) generators.push(getLetterUpperCase);
  if (includeLowercase?.checked) generators.push(getLetterLowerCase);
  if (includeNumbers?.checked) generators.push(getNumber);
  if (includeSymbols?.checked) generators.push(getSymbol);

  let password = "";


  if (includeUppercase?.checked) password += getLetterUpperCase();
  if (includeLowercase?.checked) password += getLetterLowerCase();
  if (includeNumbers?.checked) password += getNumber();
  if (includeSymbols?.checked) password += getSymbol();


  for (let i = password.length; i < passwordLength; i++) {
    const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
    password += randomGenerator();
  }

  password = password.split('').sort(() => Math.random() - 0.5).join('');

  if (generatedPasswordText) {
    generatedPasswordText.textContent = password;
  }

  if (generatedPasswordContainer) {
    generatedPasswordContainer.style.display = "block";
  }

  if (generatedPasswordLabel) {
    generatedPasswordLabel.style.display = "block";
  }

  if (copyPasswordBtn) {
    copyPasswordBtn.style.display = "flex";
  }

  updatePasswordStrength(password);

  if (passwordInput) {
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));
  }
};

// Password strength indicator
const calculatePasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];

  if (password.length >= 8) strength += 1;
  else feedback.push("Use pelo menos 8 caracteres");

  if (password.length >= 12) strength += 1;

  if (/[a-z]/.test(password)) strength += 1;
  else feedback.push("Adicione letras minúsculas");

  if (/[A-Z]/.test(password)) strength += 1;
  else feedback.push("Adicione letras maiúsculas");

  if (/[0-9]/.test(password)) strength += 1;
  else feedback.push("Adicione números");

  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  else feedback.push("Adicione símbolos");

  return { strength, feedback };
};

const updatePasswordStrength = (password) => {
  if (!strengthFill || !strengthText) return;

  const { strength, feedback } = calculatePasswordStrength(password);

  strengthFill.className = "strength-fill";
  strengthText.textContent = "Força da senha";

  if (strength <= 2) {
    strengthFill.classList.add("weak");
    strengthText.textContent = "Senha Fraca";
    strengthText.style.color = "#ff4444";
  } else if (strength <= 4) {
    strengthFill.classList.add("medium");
    strengthText.textContent = "Senha Média";
    strengthText.style.color = "#ffaa00";
  } else {
    strengthFill.classList.add("strong");
    strengthText.textContent = "Senha Forte";
    strengthText.style.color = "#00ff37";
  }
};

// Form validation
const showError = (errorElement, message) => {
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.classList.add("show");
};

const hideError = (errorElement) => {
  if (!errorElement) return;
  errorElement.textContent = "";
  errorElement.classList.remove("show");
};

const validateName = () => {
  const name = nameInput?.value.trim();
  if (!name) {
    showError(nameError, "Nome é obrigatório");
    return false;
  }
  if (name.length < 3) {
    showError(nameError, "Nome deve ter pelo menos 3 caracteres");
    return false;
  }
  hideError(nameError);
  return true;
};

const validateEmail = () => {
  const email = emailInput?.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    showError(emailError, "E-mail é obrigatório");
    return false;
  }
  if (!emailRegex.test(email)) {
    showError(emailError, "E-mail inválido");
    return false;
  }
  hideError(emailError);
  return true;
};

const validatePassword = () => {
  const password = passwordInput?.value;

  if (!password) {
    showError(passwordError, "Senha é obrigatória");
    if (passwordStrengthInfo) passwordStrengthInfo.textContent = "";
    return false;
  }

  if (password.length < 8) {
    showError(passwordError, "Senha deve ter pelo menos 8 caracteres");
    return false;
  }

  const { strength, feedback } = calculatePasswordStrength(password);
  updatePasswordStrength(password);

  if (passwordStrengthInfo) {
    if (strength <= 2) {
      passwordStrengthInfo.textContent = feedback.join(", ");
      passwordStrengthInfo.style.color = "#ff4444";
    } else if (strength <= 4) {
      passwordStrengthInfo.textContent = "Senha aceitável, mas pode ser melhorada";
      passwordStrengthInfo.style.color = "#ffaa00";
    } else {
      passwordStrengthInfo.textContent = "Senha forte!";
      passwordStrengthInfo.style.color = "#00ff37";
    }
  }

  hideError(passwordError);
  return true;
};

const validatePasswordConfirmation = () => {
  const password = passwordInput?.value;
  const confirmation = passwordConfirmationInput?.value;

  if (!confirmation) {
    showError(passwordConfirmationError, "Confirmação de senha é obrigatória");
    return false;
  }

  if (password !== confirmation) {
    showError(passwordConfirmationError, "As senhas não coincidem");
    return false;
  }

  hideError(passwordConfirmationError);
  return true;
};

const validateForm = () => {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmationValid = validatePasswordConfirmation();

  return isNameValid && isEmailValid && isPasswordValid && isConfirmationValid;
};

// Copy password to clipboard
const copyPasswordToClipboard = async () => {
  const password = generatedPasswordText?.textContent || passwordInput?.value;

  if (!password) return;

  try {
    await navigator.clipboard.writeText(password);
    showCopySuccessMessage();
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = password;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showCopySuccessMessage();
  }
};

const showCopySuccessMessage = () => {
  if (!copySuccessMessage) return;
  copySuccessMessage.classList.add("show");
  setTimeout(() => {
    copySuccessMessage.classList.remove("show");
  }, 2000);
};

// EVENT LISTENERS

// Generate password
if (generatePasswordBtn) {
  generatePasswordBtn.addEventListener("click", () => {
    if (passwordOptions) passwordOptions.style.display = "block";
    generatePassword();
  });

  // Suporte para teclado (acessibilidade)
  generatePasswordBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (passwordOptions) passwordOptions.style.display = "block";
      generatePassword();
    }
  });
}

// Update password length
if (passwordLengthSlider && lengthValue) {
  passwordLengthSlider.addEventListener("input", (e) => {
    lengthValue.textContent = e.target.value;
  });
}

// Regenerate password when options change
[includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
  if (checkbox) {
    checkbox.addEventListener("change", () => {
      if (generatedPasswordContainer?.style.display === "block") {
        generatePassword();
      }
    });
  }
});

if (copyPasswordBtn) {
  copyPasswordBtn.addEventListener("click", copyPasswordToClipboard);
}

if (nameInput) {
  nameInput.addEventListener("blur", validateName);
  nameInput.addEventListener("input", () => hideError(nameError));
}

if (emailInput) {
  emailInput.addEventListener("blur", validateEmail);
  emailInput.addEventListener("input", () => hideError(emailError));
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    validatePassword();
    if (passwordConfirmationInput?.value) {
      validatePasswordConfirmation();
    }
  });
  passwordInput.addEventListener("blur", validatePassword);
}

if (passwordConfirmationInput) {
  passwordConfirmationInput.addEventListener("input", () => {
    if (passwordInput?.value) {
      validatePasswordConfirmation();
    }
  });
  passwordConfirmationInput.addEventListener("blur", validatePasswordConfirmation);
}

// Form submission
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (validateForm()) {
      submitBtn.textContent = "Processando...";
      submitBtn.disabled = true;

      setTimeout(() => {
        alert("Conta criada com sucesso! \n\n(Esta é uma demonstração. nenhum dado foi enviado)");
        submitBtn.textContent = "Criar Conta";
        submitBtn.disabled = false;
      }, 1500);
    } else {
      const firstError = document.querySelector(".error-message.show");
      if (firstError) {
        firstError.closest(".form-control")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}
