import { z } from "zod";
import dayjs from "dayjs";

/**
 * Validates if a value is a valid Dayjs object.
 * @param {any} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is a valid Dayjs object, otherwise false.
 */
export const isValidDayjs = (value: any) => {
  return dayjs.isDayjs(value) && value.isValid();
};

/**
 * Validates if a value is not null, undefined, or an empty string.
 * @param {any} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is not null, undefined, or an empty string.
 */
export const isNotEmpty = (value: any) => {
  return value !== null && value !== undefined && value !== "";
};

/**
 * Checks if the date is in the future (after today).
 * @param {any} value - The date to be checked.
 * @returns {boolean} - Returns true if the date is in the future, otherwise false.
 */
export const isFutureDate = (value: any) => {
  return value && value.isAfter(dayjs().subtract(1, "day"));
};

/**
 * Transforms a date field to ensure it is either a valid Dayjs object or null.
 * @param {any} value - The value to transform.
 * @returns {Dayjs|null} - Returns a valid Dayjs object if possible, otherwise null.
 */
export const transformDate = (value: any) => {
  if (!value || value === "") return null;
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate : null;
};

// Removed: dateAfterField, dateBeforeField, requireIf –
// for cross-field validations please use object-level .superRefine

/**
 * Creates a Zod schema that validates a date is in the future.
 * @param {string} message - Error message to display.
 * @returns {z.ZodEffects} - A Zod refinement that validates the date is in the future.
 */
export const futureDateSchema = (message: string) => {
  return z.preprocess(
    transformDate,
    z.any().refine((value) => !value || isFutureDate(value), { message })
  );
};

/**
 * Creates a Zod schema that checks if a value is in a list of options.
 * @param {Array<Object>} options - The list of valid options.
 * @param {string} message - The error message to display if the value is invalid.
 * @returns {z.ZodString} - A Zod schema that validates the field against the options.
 */
export const oneOfOptions = (options: any[], message: string) => {
  return z
    .string({
      required_error: message,
      invalid_type_error: message,
    })
    .refine((value) => options.map((option) => option.value).includes(value), { message });
};
