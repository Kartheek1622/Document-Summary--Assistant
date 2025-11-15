
# Document Summary Assistant

Document Summary Assistant is a web application that extracts text from *PDFs and images, performs **OCR, and generates clean, concise **AI summaries*.
Its purpose is to help users quickly understand long documents with minimal effort.

This project includes a fully responsive frontend, fast text extraction pipeline, and reliable AI-powered summarization. Deployment on Vercel ensures a smooth production-level user experience.

*Live Project:*
[https://document-summary-assistant-livid.vercel.app/]
# Home Page
<img width="500" height="400" alt="image" src="https://github.com/user-attachments/assets/9f1be304-ee1d-4e0d-a53f-d2ef1017ca7f" />

<img width="500" height="400" alt="image" src="https://github.com/user-attachments/assets/ba6396f6-3b65-4091-b8e0-a0aed980a3bb" />

## Features

* Upload *PDF* or *Image* files
* OCR support for scanned documents
* Extracted text preview
* AI summary generation (Short / Medium / Long)
* Clean UI with responsive design
* Download and copy summary
* Error handling for invalid/unsupported file types

## Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* Vercel (Hosting)

### Backend / Processing

* PDF.js / pdf-parse (Text extraction)
* Tesseract.js (OCR for images)
* OpenAI / HuggingFace Summarization API


## Installation & Setup

bash
# Clone the repository
git clone https://github.com/Kartheek1622/Document-Summary--Assistant

# Navigate into the project folder
cd Document-Summary--Assistant

# Install dependencies
npm install

# Run the development server
npm run dev


The application will start on a local dev URL (Vite default).


## Building for Production

bash
# Create production build
npm run build

# Preview production build
npm run preview


## How It Works

1. User uploads a PDF or image
2. System extracts text using:

   * PDF parsing for digital PDFs
   * OCR for scanned images
3. Extracted text is sent to the AI summarizer
4. Summary is generated in three formats:

   * Short
   * Medium
   * Long
5. User can download or copy the summary


## Project Structure


src/
  components/      -> UI Elements
  pages/           -> Core Screens
  utils/           -> Helper Functions
  services/        -> API, OCR, Summarizer Logic
public/
  assets/          -> Static Assets



## 200-Word Project Overview (Academic-Ready)

Document Summary Assistant is a web-based application designed to extract and summarize textual content from PDF documents and scanned images. The system supports both digital and image-based documents through integrated text parsing and Optical Character Recognition (OCR). Using PDF parsing libraries for structured documents and Tesseract OCR for images, the application reliably retrieves readable text even from scanned sources. Once extracted, the text is processed by an AI summarization model that produces three structured summary types—short, medium, and long—allowing users to obtain information at the level of detail they prefer.

The user interface is clean, responsive, and intuitive, offering drag-and-drop uploads, visual status indicators, and a clear text preview before generating summaries. Error validation ensures smooth handling of unsupported formats and upload issues. The backend is optimized for quick processing, while deployment on Vercel enables stable and scalable production performance. The project includes modular code, clear documentation, and reusable components.

Overall, Document Summary Assistant provides a practical, efficient, and user-friendly solution for digesting long documents, making it useful for students, researchers, professionals, and organizations handling large amounts of text. (200 words)


## License

MIT License — free to use for personal and commercial projects.

## Contributing

Pull requests, improvements, and suggestions are welcome.


## Contact

*Author:* -Kartheek Kasani
*Email:* [kartheekkasani2@gmail.com]-
