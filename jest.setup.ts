import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });