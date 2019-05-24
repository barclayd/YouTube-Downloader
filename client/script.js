const convertButton = document.querySelector('.button-convert');
const inputURL = document.querySelector('.input-url');

const serverURL = 'http://localhost:8000';

convertButton.addEventListener('click', () => {
   if (inputURL.value.trim().length > 0) {
       sendButton(inputURL.value);
   }
});

const sendButton = (videoURL) => {
    window.location.href = `${serverURL}/download?URL=${videoURL}`;
};
