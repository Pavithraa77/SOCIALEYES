import '@testing-library/jest-dom';

// Fix for "TextEncoder is not defined" error
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
