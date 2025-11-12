// Voice features removed - ElevenLabs dependency eliminated
// This file is kept as a placeholder to avoid import errors

export async function generateSpeech(text: string, voiceId?: string): Promise<Buffer> {
  throw new Error("Voice generation has been disabled");
}

export async function getAvailableVoices() {
  return [];
}

export const AGENT_VOICES = {};
