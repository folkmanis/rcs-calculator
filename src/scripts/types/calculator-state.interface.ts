import { resetButton } from '../utilities/token-utilities';
import { InputToken, MathToken, TOKEN_TYPES } from './token.interface';
import Joi from "joi";


export interface CalculatorState {
    numberInput: string,
    previousButton: InputToken,
    tokenStack: MathToken[],
    errorState?: Error,
    result?: number,
}

export const tokenSchema = Joi.object({
    type: Joi.allow(...TOKEN_TYPES).required(),
    html: Joi.string().required(),
    keycodes: Joi.array().items(Joi.string()).optional(),
    styles: Joi.array().items(Joi.string()).optional(),
}).unknown(true);

export const calculatorSchema = Joi.object({
    numberInput: Joi.string().required(),
    previousButton: tokenSchema,
    tokenStack: Joi.array().items(tokenSchema),
    errorState: Joi.any().optional(),
    result: Joi.number().optional(),
});

export const calculatorStackSchema = Joi.array<CalculatorState[]>().items(calculatorSchema);

export const INITIAL_STATE: CalculatorState = {
    numberInput: "0",
    previousButton: resetButton,
    tokenStack: []
};