const convertButton = document.querySelector('.button-convert');
const inputURL = document.querySelector('.input-url');
const format = document.getElementById('format');
const quality = document.getElementById('quality');

const serverURL = 'http://localhost:8000';

convertButton.addEventListener('click', () => {
  const selectedFormat = format[format.selectedIndex].value;
  const selectedQuality = quality[quality.selectedIndex].value;
  if (inputURL.value.trim().length > 0) {
    sendButton(inputURL.value, selectedFormat, selectedQuality);
  }
});

const sendButton = (videoURL, format, quality) => {
  fetch(`${serverURL}/check-download?URL=${videoURL}`)
      .then(response => {
        return response.json();
      })
      .then(resData => {
        const data = JSON.parse(JSON.stringify(resData));
        if (data.status === true) {
          document.getElementById("downloading").innerHTML = `Starting the download of ${data.title} by ${data.author}...`;
          window.location.href = `${serverURL}/download?URL=${videoURL}&downloadFormat=${format}&quality=${quality}&title=${data.title}`;
        }
      });
};
