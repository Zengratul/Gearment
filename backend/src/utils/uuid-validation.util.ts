import { BadRequestException } from '@nestjs/common';

/**
 * Utility functions for UUID validation
 */

/**
 * Validates if a string is a valid UUID format
 * @param uuid - The string to validate
 * @returns true if the string is a valid UUID, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates UUID and throws BadRequestException if invalid
 * @param uuid - The string to validate
 * @param fieldName - The name of the field for error message
 * @throws BadRequestException if UUID is invalid
 */
export function validateUUID(uuid: string, fieldName: string = 'ID'): void {
  if (!isValidUUID(uuid)) {
    throw new BadRequestException(`Invalid UUID format for ${fieldName}`);
  }
} 