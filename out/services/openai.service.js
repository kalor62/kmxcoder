"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpenAI = require("openai");
const vscode = require("vscode");
class OpenaiService {
    constructor() {
        this.extensionName = 'kmxcoder';
        const config = vscode.workspace.getConfiguration(this.extensionName);
        const apiKey = config.get('openaiApiKey');
        const openaiEngineModel = config.get('openaiEngineModel');
        this.openaiEngineModel = typeof (openaiEngineModel) === 'string' ? openaiEngineModel : '';
        const configuration = new OpenAI.Configuration({
            apiKey: apiKey
        });
        this.openai = new OpenAI.OpenAIApi(configuration);
    }
    async createChatCompletion(text) {
        try {
            const response = await this.openai.createChatCompletion({
                model: this.openaiEngineModel,
                messages: [{ role: "user", content: text }]
            });
            const suggestions = response?.data?.choices[0]?.message?.content;
            return suggestions;
        }
        catch (error) {
            vscode.window.showErrorMessage('Error: ' + error.message);
        }
    }
    ;
}
exports.default = OpenaiService;
//# sourceMappingURL=openai.service.js.map