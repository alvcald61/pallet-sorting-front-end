/**
 * Reusable validation rules for Mantine forms
 * 
 * Provides consistent validation logic across all forms
 */

export const validationSchemas = {
  /**
   * Validates that a field is not empty
   */
  requiredField: (fieldName: string) => (value: string | undefined | null) => {
    return !value || value.trim().length === 0 
      ? `${fieldName} es requerido` 
      : null;
  },

  /**
   * Validates email format
   */
  emailField: () => (value: string) => {
    if (!value || value.trim().length === 0) {
      return 'Email es requerido';
    }
    return !value.includes('@') ? 'Email inválido' : null;
  },

  /**
   * Validates phone format (basic validation)
   */
  phoneField: () => (value: string) => {
    if (!value || value.trim().length === 0) {
      return 'Teléfono es requerido';
    }
    return value.trim().length < 7 ? 'Teléfono inválido' : null;
  },

  /**
   * Validates minimum length
   */
  minLength: (min: number, fieldName: string) => (value: string) => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    return value.trim().length < min 
      ? `${fieldName} debe tener al menos ${min} caracteres` 
      : null;
  },

  /**
   * Validates password (min 6 characters)
   */
  passwordField: (isOptional = false) => (value: string) => {
    if (isOptional && (!value || value.trim().length === 0)) {
      return null;
    }
    if (!value || value.trim().length === 0) {
      return 'Contraseña es requerida';
    }
    return value.trim().length < 6 
      ? 'Contraseña debe tener al menos 6 caracteres' 
      : null;
  },

  /**
   * Validates positive number
   */
  positiveNumber: (fieldName: string) => (value: number | undefined) => {
    if (value === undefined || value === null) {
      return `${fieldName} es requerido`;
    }
    return value <= 0 ? `${fieldName} debe ser mayor a 0` : null;
  },

  /**
   * Validates array has at least one item
   */
  requiredArray: (fieldName: string) => (value: unknown[]) => {
    return !value || value.length === 0 
      ? `Selecciona al menos un ${fieldName.toLowerCase()}` 
      : null;
  },

  /**
   * Optional field with min length if provided
   */
  optionalMinLength: (min: number, fieldName: string) => (value: string) => {
    if (!value || value.trim().length === 0) {
      return null; // Optional, so empty is OK
    }
    return value.trim().length < min 
      ? `${fieldName} debe tener al menos ${min} caracteres` 
      : null;
  },
};

export default validationSchemas;
