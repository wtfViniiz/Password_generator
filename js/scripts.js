// seleção de elementos
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordConfirmationInput = document.getElementById(
  "password-confirmation"
);
const generatePasswordBtn = document.getElementById("generate-password");
const generatedPasswordContainer =
  document.getElementById("generated-password");
const generatedPasswordText = generatedPasswordContainer.querySelector("h4");
const generatedPasswordLabel = generatedPasswordContainer.querySelector("p");
const copyPasswordBtn = document.getElementById("copy-password-btn");
const copySuccessMessage = document.getElementById("copy-success-message");
const card = document.getElementById("register-container");

// funções
card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  card.style.setProperty("--x", `${x}px`);
  card.style.setProperty("--y", `${y}px`);
});

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

const generatePassword = (
  getLetterLowerCase,
  getLetterUpperCase,
  getNumber,
  getSymbol
) => {
  let password = "";
  const passwordLength = 10;
  const generators = [
    getLetterLowerCase,
    getLetterUpperCase,
    getNumber,
    getSymbol,
  ];

  for (let i = 0; i < passwordLength; i++) {
    const randomGenerator =
      generators[Math.floor(Math.random() * generators.length)];
    const randomValue = randomGenerator();
    password += randomValue;
  }
  generatedPasswordText.textContent = password;
  generatedPasswordContainer.style.display = "block";
  generatedPasswordLabel.style.display = "block";
  copyPasswordBtn.style.display = "flex";
};

const copyPasswordToClipboard = async () => {
  const password = generatedPasswordText.textContent;

  if (!password) return;

  try {
    await navigator.clipboard.writeText(password);
    showCopySuccessMessage();
  } catch (err) {
    // Fallback para navegadores mais antigos
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
  copySuccessMessage.classList.add("show");
  setTimeout(() => {
    copySuccessMessage.classList.remove("show");
  }, 2000);
};

// Letras, números e símbolos

// eventos

generatePasswordBtn.addEventListener("click", () => {
  generatePassword(
    getLetterLowerCase,
    getLetterUpperCase,
    getNumber,
    getSymbol
  );
});

copyPasswordBtn.addEventListener("click", copyPasswordToClipboard);
