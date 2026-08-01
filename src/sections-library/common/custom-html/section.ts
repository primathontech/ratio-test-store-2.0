import { WIDGET_TYPES } from "@/widgets/.generated/types";
import { SECTION_TYPES, SECTION_LAYOUT_OPTIONS } from "@shopkit/builder";

export default {
  id: "custom-html-section",
  name: "Custom HTML",
  type: SECTION_TYPES.CONTENT_SECTION,
  isCommon: false,

  settings: {
    layout: SECTION_LAYOUT_OPTIONS.FULL,
    responsive: {
      mobile: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      tablet: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      desktop: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
    },
  },

  widgets: [
    {
      id: "custom-html-widget",
      name: "Custom HTML Block",
      type: WIDGET_TYPES.CustomHtml,
      settings: {
        html: `
          <style>
            .custom-html {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 4rem 2rem;
              text-align: center;
            }
            .custom-html button {
              background: white;
              color: #667eea;
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              margin-top: 1rem;
            }
            .custom-html button:hover {
              transform: scale(1.05);
              transition: transform 0.2s;
            }
            
          </style>
          <div class="custom-html">
            <h2>Custom HTML</h2>
            <p>This is your custom HTML block. Start editing it to your liking.</p>
            <button type="button" class="custom-html" id="demo-btn">Click Me!</button>
          </div>
          <script>
            document.getElementById('demo-btn').addEventListener('click', function() {
              this.textContent = 'Clicked!';
            });
          </script>
        `,
      },
    },
  ],
};
