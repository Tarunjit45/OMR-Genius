# OMR Genius

**OMR Genius** is an AI-powered Optical Mark Recognition (OMR) application designed to instantly grade student answer sheets against a correct answer key. 

Powered by **Google Gemini 3 Pro Vision**, it analyzes handwritten or printed OMR sheets, compares them with the key, and calculates scores with support for negative marking.

![App Screenshot](https://via.placeholder.com/800x400?text=OMR+Genius+App+Preview)

## 🚀 Features

- **AI-Powered Analysis**: Uses advanced computer vision (Gemini 3 Pro) to accurately detect marked bubbles.
- **Instant Grading**: Upload a student sheet and an answer key to get results in seconds.
- **Automated Scoring Logic**: 
  - ✅ **Correct Answer**: +1 Mark
  - ❌ **Wrong Answer**: -0.25 Marks (Negative Marking)
  - ⚪ **Unattempted**: 0 Marks
- **Detailed Analytics**: 
  - Interactive Pie Charts for performance overview.
  - Question-wise breakdown table.
  - Summary cards for total score, correct, wrong, and unattempted counts.
- **Mobile Responsive**: Fully optimized layout for desktops, tablets, and mobile phones.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI/ML**: Google GenAI SDK (`gemini-3-pro-preview`)
- **Visualization**: Recharts
- **Icons**: Lucide React

## 📋 Usage

1. **Upload Student Sheet**: Select or drag & drop the image of the student's filled OMR sheet.
2. **Upload Answer Key**: Select or drag & drop the image of the correct answer key.
3. **Analyze**: Click "Calculate Marks".
4. **View Results**: Review the score, graphical analysis, and question-by-question breakdown.

## 👤 Author

**Tarunjit Biswas**  
Email: [tarunjitbiswas24@gmail.com](mailto:tarunjitbiswas24@gmail.com)

---
*Built with ❤️ using Google Gemini API*