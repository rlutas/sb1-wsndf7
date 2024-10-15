<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Tesseract from 'tesseract.js';
import Papa from 'papaparse';

const video = ref<HTMLVideoElement | null>(null);
const csvData = ref<any[]>([]);
const processingStatus = ref('Idle');
const csvFile = ref<File | null>(null);
const isProcessing = ref(false);
const scanInterval = ref<number | null>(null);
const idDetected = ref(false);
const scanTimer = ref<number>(0);
const guidanceMessage = ref('');
const isFrontCamera = ref(true);
const manualCNP = ref('');
const showManualEntry = ref(false);
const lastUpdateDate = ref('');

onMounted(() => {
  startCamera();
});

onUnmounted(() => {
  stopCamera();
  stopContinuousCapture();
});

async function startCamera(switchCamera = false) {
  stopCamera();
  try {
    if (switchCamera) {
      isFrontCamera.value = !isFrontCamera.value;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: isFrontCamera.value ? 'user' : 'environment'
      } 
    });
    if (video.value) {
      video.value.srcObject = stream;
      video.value.play();
    }
  } catch (error) {
    console.error("Camera access denied", error);
    processingStatus.value = "Accesul la cameră a fost refuzat. Vă rugăm să verificați permisiunile.";
  }
}

function stopCamera() {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.value.srcObject = null;
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    csvFile.value = target.files[0];
    loadCSV();
  }
}

function loadCSV() {
  if (!csvFile.value) return;

  Papa.parse(csvFile.value, {
    complete: (result) => {
      csvData.value = result.data;
      console.log("Datele CSV au fost încărcate:", csvData.value);
      
      // Extrage ultima dată de actualizare din a doua linie, prima coloană
      if (csvData.value.length > 1 && csvData.value[1][0]) {
        lastUpdateDate.value = csvData.value[1][0];
      }
      
      processingStatus.value = "Fișierul CSV a fost încărcat. Gata pentru scanarea ID-ului.";
      startContinuousCapture();
    },
    header: false // Modifică aceasta la false pentru a obține datele brute din array
  });
}

function startContinuousCapture() {
  stopContinuousCapture();
  scanInterval.value = setInterval(() => {
    if (!isProcessing.value && !idDetected.value && scanTimer.value >= 3) {
      captureImage();
      scanTimer.value = 0;
    } else {
      scanTimer.value++;
    }
  }, 1000);
}

function stopContinuousCapture() {
  if (scanInterval.value !== null) {
    clearInterval(scanInterval.value);
    scanInterval.value = null;
  }
}

async function captureImage() {
  if (!video.value || isProcessing.value) return;

  isProcessing.value = true;
  processingStatus.value = "Se scanează ID-ul...";

  const canvas = document.createElement('canvas');
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;
  canvas.getContext('2d')?.drawImage(video.value, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL();

  try {
    const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng', { 
      logger: m => console.log(m),
      tessedit_char_whitelist: '0123456789'
    });
    extractID(text);
  } catch (error) {
    console.error("OCR failed", error);
    processingStatus.value = "Procesarea OCR a eșuat. Vă rugăm să încercați din nou.";
  } finally {
    isProcessing.value = false;
  }
}

function extractID(text: string) {
  const idRegex = /\b[1-9]\d{12}\b/;
  const foundID = text.match(idRegex);
  if (foundID) {
    console.log("ID găsit:", foundID[0]);
    const cnpInfo = parseCNP(foundID[0]);
    checkAgainstCSV(foundID[0], cnpInfo);
  } else {
    console.log("ID-ul nu a fost găsit în text");
    processingStatus.value = "Nu a fost detectat un ID valid. Vă rugăm să încercați din nou.";
    updateGuidance(text);
  }
}

function parseCNP(cnp: string) {
  const sex = parseInt(cnp[0]);
  const year = parseInt(cnp.substr(1, 2));
  const month = parseInt(cnp.substr(3, 2));
  const day = parseInt(cnp.substr(5, 2));
  const county = cnp.substr(7, 2);

  let fullYear = year;
  if (sex === 1 || sex === 2) fullYear += 1900;
  else if (sex === 3 || sex === 4) fullYear += 1800;
  else if (sex === 5 || sex === 6) fullYear += 2000;

  const birthDate = new Date(fullYear, month - 1, day);
  const age = calculateAge(birthDate);

  return {
    sex: sex % 2 === 1 ? 'Masculin' : 'Feminin',
    birthDate: formatDate(birthDate),
    age: age,
    county: getCountyName(county)
  };
}

function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getCountyName(code: string) {
  const counties: {[key: string]: string} = {
    '01': 'Alba', '02': 'Arad', '03': 'Argeș', '04': 'Bacău', '05': 'Bihor',
    '06': 'Bistrița-Năsăud', '07': 'Botoșani', '08': 'Brașov', '09': 'Brăila',
    '10': 'Buzău', '11': 'Caraș-Severin', '12': 'Cluj', '13': 'Constanța',
    '14': 'Covasna', '15': 'Dâmbovița', '16': 'Dolj', '17': 'Galați', '18': 'Gorj',
    '19': 'Harghita', '20': 'Hunedoara', '21': 'Ialomița', '22': 'Iași', '23': 'Ilfov',
    '24': 'Maramureș', '25': 'Mehedinți', '26': 'Mureș', '27': 'Neamț', '28': 'Olt',
    '29': 'Prahova', '30': 'Satu Mare', '31': 'Sălaj', '32': 'Sibiu', '33': 'Suceava',
    '34': 'Teleorman', '35': 'Timiș', '36': 'Tulcea', '37': 'Vaslui', '38': 'Vâlcea',
    '39': 'Vrancea', '40': 'București', '41': 'București - Sector 1',
    '42': 'București - Sector 2', '43': 'București - Sector 3',
    '44': 'București - Sector 4', '45': 'București - Sector 5',
    '46': 'București - Sector 6', '51': 'Călărași', '52': 'Giurgiu'
  };
  return counties[code] || 'Necunoscut';
}

function updateGuidance(text: string) {
  const numbers = text.match(/\d+/g);
  if (!numbers) {
    guidanceMessage.value = "Apropiați cartea de identitate de cameră";
  } else if (numbers.some(num => num.length > 13)) {
    guidanceMessage.value = "Îndepărtați cartea de identitate de cameră";
  } else if (numbers.every(num => num.length < 13)) {
    guidanceMessage.value = "Aliniați cartea de identitate în interiorul marginii verzi";
  } else {
    guidanceMessage.value = "Mișcați încet cartea de identitate în sus, jos, stânga sau dreapta";
  }
}

function checkAgainstCSV(idNumber: string, cnpInfo: any) {
  processingStatus.value = "Se verifică în lista de excludere...";
  console.log("Se verifică ID-ul:", idNumber);
  
  const found = csvData.value.some(row => row.includes(idNumber));

  if (found) {
    console.log("ID-ul a fost găsit în lista de excludere");
    showResult(false, cnpInfo, "Auto-exclus de la jocurile de noroc", idNumber);
  } else if (cnpInfo.age < 18) {
    showResult(false, cnpInfo, "Sub 18 ani", idNumber);
  } else {
    console.log("ID-ul nu a fost găsit în lista de excludere");
    showResult(true, cnpInfo, "", idNumber);
  }
}

function showResult(isAllowed: boolean, cnpInfo: any, reason: string = "", cnp: string = "") {
  idDetected.value = true;
  stopContinuousCapture();
  let resultMessage = '';

  if (isAllowed) {
    resultMessage = `✔ Permis să joace`;
  } else {
    resultMessage = `✖ Nu este permis să joace\nMotiv: ${reason}`;
  }

  resultMessage += `\n\nInformații ID:
CNP: ${cnp}
Sex: ${cnpInfo.sex}
Vârstă: ${cnpInfo.age}
Data nașterii: ${cnpInfo.birthDate}
Județ: ${cnpInfo.county}

Ultima actualizare: ${lastUpdateDate.value}`;

  processingStatus.value = resultMessage;
}

function resetCheck() {
  processingStatus.value = 'Inactiv';
  idDetected.value = false;
  guidanceMessage.value = '';
  startContinuousCapture();
}

function switchCamera() {
  startCamera(true);
}

function toggleManualEntry() {
  showManualEntry.value = !showManualEntry.value;
}

function submitManualCNP() {
  if (manualCNP.value.length === 13) {
    const cnpInfo = parseCNP(manualCNP.value);
    checkAgainstCSV(manualCNP.value, cnpInfo);
    showManualEntry.value = false;
    manualCNP.value = '';
  } else {
    processingStatus.value = "CNP invalid. Vă rugăm să introduceți un număr de 13 cifre.";
  }
}
</script>

<template>
  <div class="camera-container">
    <video ref="video" class="video-feed"></video>
    <div class="overlay">
      <div class="green-border"></div>
    </div>
    <div class="controls">
      <input v-if="!csvFile" type="file" accept=".csv" @change="handleFileUpload" class="file-input" />
      <button v-if="csvFile" class="button-secondary" @click="resetCheck">Resetare</button>
      <button class="button-secondary" @click="switchCamera">Schimbă Camera</button>
      <button class="button-secondary" @click="toggleManualEntry">Introducere Manuală</button>
    </div>
    <div v-if="showManualEntry" class="manual-entry">
      <input v-model="manualCNP" type="text" placeholder="Introduceți CNP-ul de 13 cifre" maxlength="13" />
      <button @click="submitManualCNP">Trimite</button>
    </div>
    <div class="status" :class="{ 'status-allowed': processingStatus.includes('✔ Permis să joace'), 'status-not-allowed': processingStatus.includes('✖ Nu este permis') }">
      <pre>{{ processingStatus }}</pre>
    </div>
    <div class="guidance" v-if="guidanceMessage">
      {{ guidanceMessage }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.camera-container {
  position: relative;
  width: 100%;
  height: 70vh;
  margin-bottom: 1rem;
  background-color: $background-color;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.green-border {
  border: 4px solid $success-color;
  width: 95%;
  height: 70%;
  position: absolute;
  top: 15%;
  border-radius: 8px;
  box-shadow: 0 0 0 4px rgba($success-color, 0.3);
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.file-input {
  background-color: $secondary-color;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darken($secondary-color, 10%);
  }
}

.status {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.2rem;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
  text-align: left;
  max-width: 80%;
  overflow-y: auto;
  max-height: 60%;
}

.guidance {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-allowed {
  color: $success-color;
}

.status-not-allowed {
  color: $error-color;
}

.button-secondary {
  background-color: $secondary-color;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    background-color: darken($secondary-color, 10%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.manual-entry {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;

  input {
    padding: 10px;
    border: 1px solid $secondary-color;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    @extend .button-secondary;
  }
}

@media (max-width: 600px) {
  .status {
    font-size: 1rem;
  }

  .green-border {
    width: 90%;
    height: 60%;
  }

  .button-secondary {
    font-size: 0.8rem;
    padding: 8px 16px;
  }

  .manual-entry {
    flex-direction: column;
    align-items: center;
    bottom: 100px;

    input, button {
      width: 100%;
    }
  }
}
</style>