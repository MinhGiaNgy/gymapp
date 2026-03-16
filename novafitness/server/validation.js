const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-[0-3]\d$/;

export const normalizeEmail = (value) => value.trim().toLowerCase();

export const isValidEmail = (value) => emailRegex.test(value);
export const isValidMonth = (value) => monthRegex.test(value);
export const isValidDate = (value) => dateRegex.test(value);

export const toPositiveInt = (value, fallback = 0) => {
  const numeric = Number.parseInt(String(value), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return fallback;
  }
  return numeric;
};

export const toPositiveFloat = (value, fallback = 0) => {
  const numeric = Number.parseFloat(String(value));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return fallback;
  }
  return numeric;
};

export const cleanText = (value, maxLength = 500) => String(value ?? '').trim().slice(0, maxLength);
