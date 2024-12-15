/**
 * @name MessageSummaryAI
 * @author Intensifiesx
 * @authorId 188896646870859776
 * @description Adds a button to summarize text with AI
 * @version 1.0.0
 * @donate https://www.paypal.com/paypalme/Intensifiesx
 * @website https://github.com/Intensifiesx/BetterDiscord-MessageSummaryAI
 * @source https://raw.githubusercontent.com/Intensifiesx/BetterDiscord-MessageSummaryAI/refs/heads/main/MessageSummaryAI.plugin.js
 */

module.exports = (() => {
    // Define plugin configuration
    const config = {
        info: {
            name: "MessageSummaryAI",
            authors: [
                {
                    name: "Intensifiesx",
                    discord_id: "188896646870859776",
                    github_username: "Intensifiesx",
                },
            ],
            version: "1.0.0",
            description: "Adds a button to summarize text with AI",
            github: "https://github.com/Intensifiesx/BetterDiscord-MessageSummaryAI",
            github_raw: "https://raw.githubusercontent.com/Intensifiesx/BetterDiscord-MessageScanAI/refs/heads/main/MessageSummaryAI.plugin.js",
        },
        changelog: [
            {
                title: "1.0.0",
                items: ["Initial release"],
            },
        ],
    };

    // Check for ZeresPluginLibrary
    if (!window.ZeresPluginLibrary) {
        return class {
            load = () => {
                BdApi.UI.showConfirmationModal(
                    "Library Missing",
                    `The library plugin needed for ${config.info.name} is missing. \
            Please click Download Now to install it.`,
                    {
                        confirmText: "Download Now",
                        cancelText: "Cancel",
                        onConfirm: () => {
                            require("request").get("https://betterdiscord.app/Download?id=9", async (err, _response, body) => {
                                if (err) {
                                    return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                                }
                                await new Promise((r) =>
                                    require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r)
                                );
                            });
                        },
                    }
                );
            };

            start = () => {};
            stop = () => {};
        };
    }

    // Build plugin
    const [Plugin, Library] = ZeresPluginLibrary.buildPlugin(config);

    // Define plugin class
    return class MessageSummaryAI extends Plugin {
        // Get plugin metadata
        constructor(meta) {
            super();
            this.meta = meta;
        }

        // Initialize the plugin when it is enabled
        start = async () => {
            // Ensure modals are only shown once
            this.modalShown = false;

            if (Library.DiscordModules.UserStore.getCurrentUser()) {
                console.log(`%c[${this.meta.name}] ` + "%cAttempting pre-load...", "color: #3a71c1; font-weight: 700;", "");
                await this.initialize();
            }
            if (!this.modalShown) Library.DiscordModules.Dispatcher.subscribe("POST_CONNECTION_OPEN", this.initialize);
            console.log(
                `%c[${this.meta.name}] ` + `%c(v${this.meta.version}) ` + "%chas started.",
                "color: #3a71c1; font-weight: 700;",
                "color: #666; font-weight: 600;",
                ""
            );
        };

        // Terminate the plugin when it is disabled
        stop = async () => {
            this.terminate();

            console.log(
                `%c[${this.meta.name}] ` + `%c(v${this.meta.version}) ` + "%chas stopped.",
                "color: #3a71c1; font-weight: 700;",
                "color: #666; font-weight: 600;",
                ""
            );
        };

        // Re-initialize plugin on switch
        onSwitch = () => {
            this.initialize();
        };

        // Main plugin code
        initialize = async () => {
            // Make this accessable to arrow functions
            let _this = this;

            // Ensure plugin is ready to load
            if (!document.querySelector(".buttonContainer_f9f2ca")) {
                setTimeout(() => {
                    _this.initialize();
                }, 250);
                return;
            }

            // Clean up old buttons
            this.terminate();

            // Abstract classes
            this.appLayers = "layers_a01fb1";
            this.appWrapper = "app_a01fb1";
            this.injectPoint = "buttonContainer_f9f2ca";
            this.messageContent = "messageContent_f9f2ca";
            this.messageListItem = "messageListItem_d5deea";
            this.observedContainer = document.querySelector(".app_bd26cc");

            // Initialize button icons
            this.iconSummarize = `
        <path fill="currentColor" fill-rule="evenodd" d="M9.9,23c-.4,0-.8-.3-1-.7l-1.7-4.5c0-.2-.2-.3-.4-.4l-4.5-1.7c-.6-.2-.8-.8-.6-1.4,0-.3.3-.5.6-.6l4.5-1.7c.2,0,.4-.2.4-.4l1.7-4.5c.2-.6.8-.8,1.4-.6.3,0,.5.3.6.6l1.7,4.5c0,.2.2.3.4.4l4.4,1.7c.4.2.7.6.7,1s-.3.8-.7,1l-4.4,1.8c-.2.1-.3.2-.4.4l-1.7,4.5c0,.3-.5.6-1,.6ZM12.7,12h0Z" clip-rule="evenodd" class/>
        <path fill="currentColor" fill-rule="evenodd" d="M4.8,8.6c-.3,0-.5-.2-.6-.4l-.7-1.9c0,0,0,0-.2-.2l-1.9-.7c-.3-.2-.5-.5-.4-.8,0-.2.2-.3.4-.4l1.9-.7c0,0,0,0,.2-.2l.7-1.9c0-.2.3-.4.5-.4.3,0,.6.1.7.4l.7,1.9c0,0,0,0,.2.2l1.9.7c.3.1.4.5.3.8,0,.2-.2.3-.3.4l-1.9.7c0,0,0,0-.2.2l-.7,1.9c0,.2-.4.4-.6.4Z" clip-rule="evenodd" class/>
        <path fill="currentColor" fill-rule="evenodd" d="M18.1,12c-.3,0-.5-.2-.6-.4l-1-2.6c0-.1,0-.2-.2-.2l-2.6-1c-.4,0-.5-.5-.4-.9,0-.2.2-.3.4-.4l2.6-1c0,0,.2,0,.2-.2l1-2.5c0-.2.3-.4.6-.5.3,0,.6,0,.7.4l1,2.6c0,0,0,.2.2.2l2.6,1c.4,0,.5.5.4.9,0,.2-.2.3-.4.4l-2.6,1c0,0-.2.1-.2.2l-1,2.6c-.2.2-.4.4-.7.4Z" clip-rule="evenodd" class/>
      `;
            this.iconClear = `
        <path fill="currentColor" fill-rule="evenodd" d="M9.4,12.5c-.9-.9-.9-2.3,0-3.2s1-.7,1.6-.7.3,0,.4,0l-.6-1.6c0-.3-.3-.5-.6-.6-.6-.2-1.2,0-1.4.6l-1.7,4.5c0,.2-.2.4-.4.4l-4.5,1.7c-.3.1-.5.3-.6.6-.2.6,0,1.2.6,1.4l4.5,1.7c.2,0,.3.2.4.4l1.6,4.3c0-.6.2-1.2.7-1.6l3.9-4-3.9-4Z" clip-rule="evenodd" class/>
        <path fill="currentColor" fill-rule="evenodd" d="M4.8,8.6c-.3,0-.5-.2-.6-.4l-.7-1.9c0,0,0,0-.2-.2l-1.9-.7c-.3-.2-.5-.5-.4-.8,0-.2.2-.3.4-.4l1.9-.7c0,0,0,0,.2-.2l.7-1.9c0-.2.3-.4.5-.4.3,0,.6.1.7.4l.7,1.9c0,0,0,0,.2.2l1.9.7c.3.1.4.5.3.8,0,.2-.2.3-.3.4l-1.9.7c0,0,0,0-.2.2l-.7,1.9c0,.2-.4.4-.6.4Z" clip-rule="evenodd" class/>
        <path fill="currentColor" fill-rule="evenodd" d="M23,7.4c-.1.2-.2.3-.4.4l-2.6,1c-.1,0-.2.1-.2.2l-.6,1.7-1.2,1.3c-.2,0-.3-.2-.4-.4l-1-2.6c0-.1,0-.2-.2-.2l-2.6-1c-.4,0-.5-.5-.4-.9,0-.2.2-.3.4-.4l2.6-1c.1,0,.2,0,.2-.2l1-2.5c.1-.2.3-.4.6-.5.3,0,.6,0,.7.4l1,2.6c0,0,0,.2.2.2l2.6,1c.4,0,.5.5.4.9Z" clip-rule="evenodd" class/>
        <path fill="currentColor" fill-rule="evenodd" d="M10.4,10.3c.4-.4.9-.4,1.3,0,0,0,0,0,0,0l4.9,4.9,4.9-4.9c.4-.4.9-.4,1.3,0s.4,1,0,1.3l-4.9,4.9,4.9,4.9c.4.4.4,1,0,1.3s-.9.4-1.3,0l-4.9-4.9-4.9,4.9c-.4.4-.9.4-1.3,0s-.4-1,0-1.3l4.9-4.9-4.9-4.9c-.4-.4-.4-.9,0-1.3,0,0,0,0,0,0" clip-rule="evenodd" class/>
      `;

            // Initialize state variables
            this.tosAccepted = BdApi.getData(this.meta.name, "tosAccepted") === "true";
            this.apiKey = BdApi.getData(this.meta.name, "apiKey");
            this.summarySize = BdApi.getData(this.meta.name, "summarySize") || 60;
            this.model = BdApi.getData(this.meta.name, "model") || "gemini-1.0-pro";

            // Show setup modals
            if (!this.tosAccepted) this.showTosModal();
            else if (!this.apiKey && !this.modalShown) this.showSetupModal();

            // Insert buttons
            for (let node of document.querySelectorAll("." + this.injectPoint)) {
                this.injectButton(node);
            }

            // Add mutation observer to insert new buttons as needed
            this.messageObserver = new MutationObserver((mutationList) => {
                setTimeout(() => {
                    mutationList.forEach((mutationRecord) => {
                        mutationRecord.addedNodes.forEach((node) => {
                            if (node.classList?.contains(_this.injectPoint)) _this.injectButton(node);

                            // BDFDB compatibility
                            if (node.classList?.contains(_this.appLayers) || node.classList?.contains(_this.appWrapper)) _this.initialize();
                        });
                        if (mutationRecord.target.classList?.contains(_this.injectPoint)) {
                            _this.injectButton(mutationRecord.target);
                        }
                    });
                }, 0);
            });

            this.messageObserver.observe(this.observedContainer, {
                childList: true,
                subtree: true,
                attributes: false,
            });
        };

        // Undo UI changes and stop plugin code
        terminate = async () => {
            // Remove all injected elements and styles
            document.querySelectorAll(".msai-element").forEach((elem) => {
                elem.remove();
            });
            document.querySelectorAll(".msai-msg").forEach((elem) => {
                let targetMessage = elem;
                while (!targetMessage.classList.contains(this.messageListItem)) targetMessage = targetMessage.parentElement;
                targetMessage.style.removeProperty("background");
                targetMessage.style.removeProperty("box-shadow");
                elem.remove();
            });

            // Stop mutation observer
            this.messageObserver?.disconnect();

            // Delete plugin fields
            delete this.apiKey;
            delete this.appLayers;
            delete this.appWrapper;
            delete this.iconClear;
            delete this.iconSummarize;
            delete this.summarySize;
            delete this.model;
            delete this.injectPoint;
            delete this.messageContent;
            delete this.messageListItem;
            delete this.messageObserver;
            delete this.observedContainer;
            delete this.tosAccepted;
        };

        getSettingsPanel = () => {
            // Make this accessable to arrow functions
            let _this = this;

            // Create root settings node
            var settingsRoot = new Library.Settings.SettingPanel();

            // Create API key textbox
            var settingApiKey = new Library.Settings.Textbox(
                "Gemini API Key",
                "The API key used to authenticate with the Google Gemini API",
                BdApi.getData(this.meta.name, "apiKey"),
                (text) => {
                    BdApi.setData(this.meta.name, "apiKey", text);
                    _this.apiKey = text;
                },
                { placeholder: "API key (Ex: XXxxXxXX0xX0XXXxXX0XXxXxxxXXx0xxXxx0XXx)" }
            );

            var settingSummarySize = new Library.Settings.Textbox(
                "Summary Size (1-100) (Default: 60)",
                "The maximum number of messages to summarize (This will untoggle the 'Only Summarize Single Messages' setting)",
                BdApi.getData(this.meta.name, "summarySize"),
                (text) => {
                    let value = parseInt(text);
                    if (isNaN(value) || value < 1 || value > 100) {
                        BdApi.showToast("Summary Size must be a number between 1 and 100", { type: "error" });
                        return;
                    }
                    BdApi.setData(this.meta.name, "summarySize", value);
                    _this.summarySize = value;
                },
                { placeholder: "Default: 60" }
            );

            var settingModel = new Library.Settings.Dropdown(
                "Model (Default: gemini-1.0-pro)",
                "The model to use for summarization",
                BdApi.getData(this.meta.name, "model") || "gemini-1.0-pro",
                [
                    { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash-exp" },
                    { label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
                    { label: "Gemini 1.5 Flash-8B", value: "gemini-1.5-flash-8b" },
                    { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
                    { label: "Gemini 1.0 Pro (Will Be Deprecated on 2/15/2025)", value: "gemini-1.0-pro" },
                ],
                (value) => {
                    BdApi.setData(this.meta.name, "model", value);
                    _this.model = value;
                },
                { placeholder: "Select a model" }
            );

            var settingToggle = new Library.Settings.Switch(
                "Only Summarize A Single Message (Default: Off)",
                "(This will change summary size)",
                BdApi.getData(this.meta.name, "summarySize") === 1,
                (checked) => {
                    BdApi.setData(this.meta.name, "summarySize", 1);
                }
            );

            settingsRoot.append(settingApiKey, settingSummarySize, settingModel, settingToggle);
            return settingsRoot.getElement();
        };

        injectButton = (parentNode) => {
            try {
                // Remove button if it already exists
                parentNode.querySelectorAll(".msai-element").forEach((elem) => {
                    elem.remove();
                });

                // Create new button by cloning existing button and insert it before the original
                let discordButton = parentNode.lastElementChild.lastElementChild.lastElementChild;
                let newButton = discordButton.cloneNode(true);
                discordButton.before(newButton);

                // Update new button to look how we want
                newButton.classList.add("msai-element");
                BdApi.UI.createTooltip(newButton, "Summarize Messages");
                newButton.setAttribute("aria-label", "Summarize Messages");
                newButton.removeAttribute("aria-expanded");
                newButton.firstElementChild.innerHTML = this.iconSummarize;

                // Update new button to act how we want
                newButton.addEventListener("click", async (e) => {
                    try {
                        // Get the clicked target message element
                        let targetMessage = e.target;

                        // Find the parent message container
                        while (!targetMessage.classList.contains(this.messageListItem)) {
                            targetMessage = targetMessage.parentElement;
                        }

                        // Collect the target message and 40 previous messages
                        const messages = [];
                        let currentMessage = targetMessage;
                        for (let i = 0; i < this.summarySize; i++) {
                            if (!currentMessage) break; // Stop if no more previous messages
                            messages.unshift(currentMessage); // Add the message to the beginning of the array
                            currentMessage = currentMessage.previousElementSibling;
                        }

                        // Extract the text content and usernames of the messages
                        const messageDetails = messages.map((msg) => {
                            const username = msg.querySelector(".username_f9f2ca")?.textContent;
                            const text = msg.querySelector("." + this.messageContent)?.textContent || "";
                            return `${username === undefined ? " " : username + ": "}${text}`;
                        });

                        // Combine messages into a single string for summarization
                        const combinedMessages = messageDetails.join("\n").replace(/[\n\r]+/g, " ");

                        // Run the combined messages through your summarization AI or logic
                        const summary = await this.askAI(combinedMessages);

                        BdApi.showToast("Summarizing messages...", { type: "info" });

                        // Log the summary and display it in the target message
                        const messageBody = targetMessage.querySelector("." + this.messageContent);
                        messageBody.innerHTML += `<div class="msai-msg" style="color: #7289da; background-color: black; font-size: 100%;">Summary: <br>${summary}</div>`;
                    } catch (error) {
                        console.error("Error processing messages:", error);
                    }
                });
            } catch {}
        };

        // Shows a ToS accept/decline modal
        showTosModal = () => {
            // Make this accessable to arrow functions
            let _this = this;

            this.modalShown = true;
            BdApi.UI.showConfirmationModal(
                "Google Gemini Terms of Service",
                `**MessageSummaryAI** makes use of the Google Gemini API to provide you
                with accurate scam and phishing information. Use of this plugin is
                subject to the [Google Gemini Terms of Service and Privacy Policy](https://ai.google.dev/gemini-api/terms).
                \nBy clicking "Accept", you agree to the aforementioned Terms and
                waive the developer of the MessageSummaryAI plugin of any responsibility
                for your use of the Gemini platform via this plugin.
                \n*This plugin respects your privacy and will not send any data to
                Google unless the "scan" button is clicked. In the event that the
                "scan" button is clicked, only the previous 30 messages will be sent to Google.* ***Be aware that Google may use any messages
                scanned by this plugin to train its AI model.***
                `,
                {
                    danger: true,
                    confirmText: "Accept",
                    cancelText: "Decline",
                    onConfirm: () => {
                        _this.tosAccepted = true;
                        BdApi.setData(this.meta.name, "tosAccepted", "true");
                        this.initialize();
                    },
                    onCancel: () => {
                        _this.tosAccepted = false;
                        BdApi.setData(this.meta.name, "tosAccepted", "false");
                        BdApi.Plugins.disable(this.meta.name);
                    },
                }
            );
        };

        // Shows a setup prompt modal
        showSetupModal = () => {
            this.modalShown = true;
            BdApi.UI.showConfirmationModal(
                "Setup",
                `**MessageSummaryAI** needs a Google Gemini API key in order to work
           properly. Note that per Google's ToS, **you must be 18 in order to
           obtain a key.**
           \nTo continue, please select "Get API Key", create an API key in a
           new project, then head on over to MessageSummaryAI's plugin settings and
           paste it in the appropriate text box.
           \n\n*You may have been rate limited. In this case, wait a few minutes
           and try again.*`,
                {
                    confirmText: "Get API Key",
                    cancelText: "I already have a key",
                    onConfirm: () => {
                        require("electron").shell.openExternal("https://makersuite.google.com/app/apikey");
                        this.initialize();
                    },
                    onCancel: () => {
                        this.initialize();
                    },
                }
            );
        };

        // Calls the Google Gemini API and returns whether a message is a scam or not
        askAI = async (message) => {
            if (!this.apiKey) {
                this.showSetupModal();
                return null;
            }

            const response = await BdApi.Net.fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Provide a summary of the following conversation. 
                                        Identify who is involved in the discussion and the topics they are discussing. 
                                        Ensure that no one is misquoted and that the message reflects the correct speaker. 
                                        Do not say summary in the response.
                                        Respond with a concise summary in five sentences:
                                        \n${message}`,
                                    },
                                ],
                            },
                        ],
                        safetySettings: [
                            {
                                category: "HARM_CATEGORY_HARASSMENT",
                                threshold: "BLOCK_NONE",
                            },
                            {
                                category: "HARM_CATEGORY_HATE_SPEECH",
                                threshold: "BLOCK_NONE",
                            },
                            {
                                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                threshold: "BLOCK_NONE",
                            },
                            {
                                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                threshold: "BLOCK_NONE",
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                this.showSetupModal();
                return null;
            }

            const json = await response.json();
            return json.candidates[0].content.parts[0].text;
        };
    };
})();
