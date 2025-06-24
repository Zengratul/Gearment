import { isValidUUID, validateUUID } from './uuid-validation.util';
import { BadRequestException } from '@nestjs/common';

describe('UUID Validation Utility', () => {
  describe('isValidUUID', () => {
    it('should return true for valid UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
        '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should return false for invalid UUIDs', () => {
      const invalidUUIDs = [
        '1', // Simple number
        '123', // Short number
        'not-a-uuid', // Random string
        '123e4567-e89b-12d3-a456-42661417400', // Too short
        '123e4567-e89b-12d3-a456-4266141740000', // Too long
        '123e4567-e89b-12d3-a456-42661417400g', // Invalid character
        '123e4567-e89b-12d3-a456-42661417400G', // Invalid character
        '', // Empty string
        '123e4567-e89b-12d3-a456-42661417400', // Missing character
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });

    it('should be case insensitive', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const upperUUID = uuid.toUpperCase();
      
      expect(isValidUUID(uuid)).toBe(true);
      expect(isValidUUID(upperUUID)).toBe(true);
    });
  });

  describe('validateUUID', () => {
    it('should not throw for valid UUIDs', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      expect(() => validateUUID(validUUID)).not.toThrow();
      expect(() => validateUUID(validUUID, 'test ID')).not.toThrow();
    });

    it('should throw BadRequestException for invalid UUIDs', () => {
      const invalidUUIDs = ['1', 'not-a-uuid', '123e4567-e89b-12d3-a456-42661417400g'];
      
      invalidUUIDs.forEach(uuid => {
        expect(() => validateUUID(uuid)).toThrow(BadRequestException);
        expect(() => validateUUID(uuid, 'test ID')).toThrow(BadRequestException);
      });
    });

    it('should include custom field name in error message', () => {
      const invalidUUID = '1';
      
      expect(() => validateUUID(invalidUUID, 'user ID')).toThrow('Invalid UUID format for user ID');
      expect(() => validateUUID(invalidUUID, 'leave request ID')).toThrow('Invalid UUID format for leave request ID');
    });

    it('should use default field name when not provided', () => {
      const invalidUUID = '1';
      
      expect(() => validateUUID(invalidUUID)).toThrow('Invalid UUID format for ID');
    });
  });
}); 