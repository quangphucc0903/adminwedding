const fonts = [
  { label: "Arial", value: "arial", family: "Arial, sans-serif", url: "" },
  {
    label: "Courier New",
    value: "courier-new",
    family: "'Courier New', monospace",
    url: "",
  },
  { label: "Georgia", value: "georgia", family: "Georgia, serif", url: "" },
  {
    label: "Times New Roman",
    value: "times-new-roman",
    family: "'Times New Roman', serif",
    url: "",
  },
  {
    label: "Verdana",
    value: "verdana",
    family: "Verdana, sans-serif",
    url: "",
  },
  // {
  //   label: "Montserrat",
  //   value: "montserrat",
  //   family: "'Montserrat', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Dancing Script",
  //   value: "dancing-script",
  //   family: "'Dancing Script', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap",
  // },
  // {
  //   label: "Great Vibes",
  //   value: "great-vibes",
  //   family: "'Great Vibes', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
  // },
  // {
  //   label: "Alex Brush",
  //   value: "alex-brush",
  //   family: "'Alex Brush', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap",
  // },
  // {
  //   label: "Playfair Display",
  //   value: "playfair-display",
  //   family: "'Playfair Display', serif",
  //   url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  // },
  // {
  //   label: "Cormorant Garamond",
  //   value: "cormorant-garamond",
  //   family: "'Cormorant Garamond', serif",
  //   url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Quicksand",
  //   value: "quicksand",
  //   family: "'Quicksand', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Pinyon Script",
  //   value: "pinyon-script",
  //   family: "'Pinyon Script', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap",
  // },
  // {
  //   label: "Charm",
  //   value: "charm",
  //   family: "'Charm', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap",
  // },
  // {
  //   label: "Josefin Sans",
  //   value: "josefin-sans",
  //   family: "'Josefin Sans', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Raleway",
  //   value: "raleway",
  //   family: "'Raleway', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Nunito",
  //   value: "nunito",
  //   family: "'Nunito', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Roboto",
  //   value: "roboto",
  //   family: "'Roboto', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Lora",
  //   value: "lora",
  //   family: "'Lora', serif",
  //   url: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
  // },
  // {
  //   label: "Source Serif Pro",
  //   value: "source-serif-pro",
  //   family: "'Source Serif Pro', serif",
  //   url: "https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap",
  // },
  // {
  //   label: "Bellota",
  //   value: "bellota",
  //   family: "'Bellota', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Bellota:wght@300;400;700&display=swap",
  // },
  // {
  //   label: "Philosopher",
  //   value: "philosopher",
  //   family: "'Philosopher', sans-serif",
  //   url: "https://fonts.googleapis.com/css2?family=Philosopher:wght@400;700&display=swap",
  // },
  // {
  //   label: "Amatic SC",
  //   value: "amatic-sc",
  //   family: "'Amatic SC', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap",
  // },
  // {
  //   label: "Cormorant Infant",
  //   value: "cormorant-infant",
  //   family: "'Cormorant Infant', serif",
  //   url: "https://fonts.googleapis.com/css2?family=Cormorant+Infant:wght@300;400;500;600;700&display=swap",
  // },
  // {
  //   label: "Bungee",
  //   value: "bungee",
  //   family: "'Bungee', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Bungee&display=swap",
  // },
  // {
  //   label: "Pacifico",
  //   value: "pacifico",
  //   family: "'Pacifico', cursive",
  //   url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
  // },
];

export const loadFonts = () => {
  fonts.forEach((font) => {
    if (font.url) {
      // Tạo <link> nếu URL có sẵn và font chưa được tải
      if (!document.querySelector(`link[href="${font.url}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = font.url;
        document.head.appendChild(link);
      }
    }
  });
};

export default fonts;
