const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../generated/prisma');
const { HamsterSession, RotationLogEntry } = require('../generated/prisma');

const prisma = new PrismaClient();
const LOG_FILE = './src/scripts/log_plain.txt';

// Define a type that includes the rotationLog relation
type HamsterSessionWithRotationLog = typeof HamsterSession & {
  rotationLog: (typeof RotationLogEntry)[];
};

function parseJsonFromPythonDict(jsonStr: string): HamsterSessionWithRotationLog {
  // Handle Python-style dictionary format step by step
  let cleanedJson = jsonStr;

  // Step 1: Remove backslashes before braces and quotes
  cleanedJson = cleanedJson.replace(/\\{/g, '{');
  cleanedJson = cleanedJson.replace(/\\}/g, '}');
  cleanedJson = cleanedJson.replace(/\\'/g, "'");

  // Step 2: Replace single quotes with double quotes
  cleanedJson = cleanedJson.replace(/'/g, '"');

  return JSON.parse(cleanedJson);
}

async function saveFailedSession(sessionData: HamsterSessionWithRotationLog) {
  try {
    const hamsterSession = await prisma.hamsterSession.create({
      data: {
        images: sessionData.images || [],
        rotationLog: {
          create: sessionData.rotationLog.map((entry: typeof RotationLogEntry) => ({
            timestamp: entry.timestamp,
            temperature: entry.temperature,
            humidity: entry.humidity,
          })),
        },
      },
    });

    console.log('Inserted HamsterSession with ID:', hamsterSession.id);
  } catch (err) {
    console.error('Error inserting session:', err);
  }
}

async function parseLog() {
  const log = fs.readFileSync(LOG_FILE, 'utf-8');
  const lines = log.split('\n');

  console.log(`Processing ${lines.length} lines from ${LOG_FILE}`);

  let lastSessionData = null;

  for (const line of lines) {
    if (line.startsWith('Session data:')) {
      let jsonStr = line.replace('Session data:', '').trim();
      // Extract only the JSON part (up to the last closing brace)
      const jsonEnd = Math.max(jsonStr.lastIndexOf('}'), jsonStr.lastIndexOf(']'));
      if (jsonEnd !== -1) {
        jsonStr = jsonStr.substring(0, jsonEnd + 1);
      }
      console.log('JSON string:', jsonStr.substring(0, 100) + '...');
      try {
        lastSessionData = parseJsonFromPythonDict(jsonStr);
        console.log('Successfully parsed JSON');
      } catch (err) {
        const error = err as Error;
        console.error('Failed to parse session JSON:', jsonStr.substring(0, 100) + '...');
        console.error('Error:', error.message);
        lastSessionData = null;
      }
    }

    if (line.includes('status: 401') && lastSessionData) {
      console.log('Found 401 error, saving session...');
      await saveFailedSession(lastSessionData);
      lastSessionData = null;
    }
  }
}

parseLog()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
