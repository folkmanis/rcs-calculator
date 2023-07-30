import { InputToken } from './token.interface';

export const buttons: InputToken[] = [
    {
        type: 'undo',
        html: '&#x232b;'
    },
    {
        type: 'function',
        html: 'sin',
        callback: a => Math.sin(a),
    },
    {
        type: 'function',
        html: 'cos',
        callback: a => Math.cos(a),
    },
    {
        type: 'function',
        html: 'tan',
        callback: a => Math.tan(a),
    },
    {
        type: "reset",
        html: 'C',
        keycodes: ['C', 'c', 'Escape'],
    },
    {
        type: "(",
        html: '(',
        keycodes: ['('],
    },
    {
        type: ")",
        html: ')',
        keycodes: [')'],
    },
    {
        type: "operator",
        html: '&div;',
        keycodes: ['/'],
        precedence: 12,
        associativity: 0,
        callback: (a, b) => a / b,
    },
    {
        type: "digit",
        html: '7',
        value: "7",
        keycodes: ['7'],
    },
    {
        type: "digit",
        html: '8',
        value: "8",
        keycodes: ['8'],
    },
    {
        type: "digit",
        html: '9',
        value: "9",
        keycodes: ['9'],
    },
    {
        type: "operator",
        html: '&times;',
        keycodes: ['*'],
        precedence: 12,
        associativity: 0,
        callback: (a, b) => a * b,
    },
    {
        type: "digit",
        html: '4',
        value: "4",
        keycodes: ['4'],
    },
    {
        type: "digit",
        html: '5',
        value: "5",
        keycodes: ['5'],
    },
    {
        type: "digit",
        html: '6',
        keycodes: ['6'],
        value: "6",
    },
    {
        type: "operator",
        html: '&minus;',
        keycodes: ['-'],
        precedence: 11,
        associativity: 0,
        callback: (a, b) => a - b,
    },
    {
        type: "digit",
        html: '1',
        value: "1",
        keycodes: ["1"],
    },
    {
        type: "digit",
        html: '2',
        value: "2",
        keycodes: ["2"],
    },
    {
        type: "digit",
        html: '3',
        keycodes: ['3'],
        value: "3",
    },
    {
        type: "operator",
        html: '&plus;',
        keycodes: ['+'],
        precedence: 11,
        associativity: 0,
        callback: (a, b) => a + b,
    },
    {
        type: "digit",
        html: '&pm;',
        value: "-",
    },
    {
        type: "digit",
        html: '0',
        value: "0",
        keycodes: ['0'],
    },
    {
        type: "digit",
        html: ',',
        value: ".",
        keycodes: ['.', ','],
    },
    {
        type: "exec",
        html: '&equals;',
        keycodes: ['=', 'Enter'],
        // styles: ['row-span-2'],
    },
];

