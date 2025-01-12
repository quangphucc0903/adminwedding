const fonts = [
  { family: "Montserrat", label: "Montserrat" },
  { family: "DancingScript", label: "Dancing Script" },
  { family: "GreatVibes", label: "Great Vibes" },
  { family: "AlexBrush", label: "Alex Brush" },
  { family: "PlayfairDisplay", label: "Playfair Display" },
  { family: "CormorantGaramond", label: "Cormorant Garamond" },
  { family: "Quicksand", label: "Quicksand" },
  { family: "PinyonScript", label: "Pinyon Script" },
  { family: "Charm", label: "Charm" },
  { family: "JosefinSans", label: "Josefin Sans" },
  { family: "Raleway", label: "Raleway" },
  { family: "Nunito", label: "Nunito" },
  { family: "Roboto", label: "Roboto" },
  { family: "Lora", label: "Lora" },
  { family: "SourceSerifPro", label: "Source Serif Pro" },
  { family: "Bellota", label: "Bellota" },
  { family: "Philosopher", label: "Philosopher" },
  { family: "AmaticSC", label: "Amatic SC" },
  { family: "CormorantInfant", label: "Cormorant Infant" },
  { family: "Bungee", label: "Bungee" },
  { family: "Pacifico", label: "Pacifico" },
];

// export const loadFonts = () => {
//   fonts.forEach((font) => {
//     if (font.url) {
//       // Tạo <link> nếu URL có sẵn và font chưa được tải
//       if (!document.querySelector(`link[href="${font.url}"]`)) {
//         const link = document.createElement("link");
//         link.rel = "stylesheet";
//         link.href = font.url;
//         document.head.appendChild(link);
//       }
//     }
//   });
// };

export default fonts;
