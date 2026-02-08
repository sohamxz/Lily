import { 
    LanguageModelV2, 
    LanguageModelV2CallOptions, 
    LanguageModelV2StreamPart 
} from '@ai-sdk/provider';

// Define a concrete class that implements the V2 interface
export class MockLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = 'v2';
  readonly provider = 'mock-provider';
  readonly modelId = 'mock-model';
  readonly defaultObjectGenerationMode = 'json';
  
  // Supported URLs is required in V2
  readonly supportedUrls = {};

  async doGenerate(options: LanguageModelV2CallOptions) {
    return {
      content: [{ type: 'text' as const, text: 'Mock response' }],
      finishReason: 'stop' as const,
      usage: { promptTokens: 0, completionTokens: 0 },
      rawCall: { rawPrompt: null, rawSettings: {} }
    };
  }

  async doStream(options: LanguageModelV2CallOptions) {
    const stream = new ReadableStream<LanguageModelV2StreamPart>({
      start(controller) {
        // Enqueue V2 stream parts
        // Based on grep, the correct shape is:
        // { type: 'text-delta', id: string, delta: string }
        
        controller.enqueue({
            type: 'text-delta',
            id: 'mock-id',
            delta: 'Mock response from FlowState AI.'
        });

        controller.enqueue({ 
            type: 'finish', 
            finishReason: 'stop', 
            usage: { promptTokens: 0, completionTokens: 0 } 
        });
        
        controller.close();
      }
    });

    return {
      stream,
      rawCall: { rawPrompt: null, rawSettings: {} }
    }
  }
}
