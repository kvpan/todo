import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import "../src/index.css";
import "../src/App.css";

// Initialize MSW
initialize();

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: "dark",
            values: [
                { name: "dark", value: "#242424" },
                { name: "light", value: "#ffffff" },
            ],
        },
    },
    loaders: [mswLoader],
};

export default preview;
