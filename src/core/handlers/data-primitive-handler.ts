import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for data primitive operation node types
 * Provides comprehensive data manipulation operations for:
 * - Numbers: type conversion, validation, formatting, range operations
 * - Strings: type conversion, validation, formatting, encoding/decoding
 * - Arrays: creation, manipulation, filtering, sorting, transformation
 * - Objects: creation, manipulation, property access, merging, cloning
 * - Booleans: type conversion, validation, logical operations
 * - JSON: parsing, stringifying, validation, schema checking
 * - Type checking: typeof, instanceof, isArray, isObject, etc.
 * - Data validation: null/undefined checks, empty checks, type validation
 */
export class DataPrimitiveHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const operation = node.inputs.operation as string;
    
    let result: unknown;
    
    switch (operation?.toLowerCase()) {
      // ================================
      // Number Operations
      // ================================
      case 'number-parse':
        result = this.parseNumber(node, inputs);
        break;
      case 'number-format':
        result = this.formatNumber(node, inputs);
        break;
      case 'number-validate':
        result = this.validateNumber(node, inputs);
        break;
      case 'number-range':
        result = this.numberRange(node, inputs);
        break;
      case 'number-round':
        result = this.roundNumber(node, inputs);
        break;
      case 'number-clamp':
        result = this.clampNumber(node, inputs);
        break;
      
      // ================================
      // String Operations
      // ================================
      case 'string-parse':
        result = this.parseString(node, inputs);
        break;
      case 'string-validate':
        result = this.validateString(node, inputs);
        break;
      case 'string-encode':
        result = this.encodeString(node, inputs);
        break;
      case 'string-decode':
        result = this.decodeString(node, inputs);
        break;
      case 'string-format':
        result = this.formatString(node, inputs);
        break;
      case 'string-sanitize':
        result = this.sanitizeString(node, inputs);
        break;
      
      // ================================
      // Array Operations
      // ================================
      case 'array-create':
        result = this.createArray(node, inputs);
        break;
      case 'array-filter':
        result = this.filterArray(node, inputs);
        break;
      case 'array-map':
        result = this.mapArray(node, inputs);
        break;
      case 'array-reduce':
        result = this.reduceArray(node, inputs);
        break;
      case 'array-sort':
        result = this.sortArray(node, inputs);
        break;
      case 'array-flatten':
        result = this.flattenArray(node, inputs);
        break;
      case 'array-unique':
        result = this.uniqueArray(node, inputs);
        break;
      case 'array-chunk':
        result = this.chunkArray(node, inputs);
        break;
      case 'array-slice':
        result = this.sliceArray(node, inputs);
        break;
      case 'array-join':
        result = this.joinArray(node, inputs);
        break;
      
      // ================================
      // Object Operations
      // ================================
      case 'object-create':
        result = this.createObject(node, inputs);
        break;
      case 'object-get':
        result = this.getObjectProperty(node, inputs);
        break;
      case 'object-set':
        result = this.setObjectProperty(node, inputs);
        break;
      case 'object-merge':
        result = this.mergeObjects(node, inputs);
        break;
      case 'object-clone':
        result = this.cloneObject(node, inputs);
        break;
      case 'object-keys':
        result = this.getObjectKeys(node, inputs);
        break;
      case 'object-values':
        result = this.getObjectValues(node, inputs);
        break;
      case 'object-entries':
        result = this.getObjectEntries(node, inputs);
        break;
      case 'object-pick':
        result = this.pickObjectProperties(node, inputs);
        break;
      case 'object-omit':
        result = this.omitObjectProperties(node, inputs);
        break;
      case 'object-freeze':
        result = this.freezeObject(node, inputs);
        break;
      
      // ================================
      // Boolean Operations
      // ================================
      case 'boolean-parse':
        result = this.parseBoolean(node, inputs);
        break;
      case 'boolean-validate':
        result = this.validateBoolean(node, inputs);
        break;
      
      // ================================
      // JSON Operations
      // ================================
      case 'json-parse':
        result = this.parseJson(node, inputs);
        break;
      case 'json-stringify':
        result = this.stringifyJson(node, inputs);
        break;
      case 'json-validate':
        result = this.validateJson(node, inputs);
        break;
      case 'json-schema-validate':
        result = this.validateJsonSchema(node, inputs);
        break;
      
      // ================================
      // Type Checking Operations
      // ================================
      case 'type-check':
        result = this.checkType(node, inputs);
        break;
      case 'type-convert':
        result = this.convertType(node, inputs);
        break;
      case 'type-validate':
        result = this.validateType(node, inputs);
        break;
      
      // ================================
      // Data Validation Operations
      // ================================
      case 'data-is-null':
        result = this.isNull(node, inputs);
        break;
      case 'data-is-undefined':
        result = this.isUndefined(node, inputs);
        break;
      case 'data-is-empty':
        result = this.isEmpty(node, inputs);
        break;
      case 'data-is-valid':
        result = this.isValid(node, inputs);
        break;
      case 'data-default':
        result = this.getDefaultValue(node, inputs);
        break;
      
      default:
        throw new Error(`Unsupported data primitive operation: ${operation}. Supported operations: number-parse, number-format, number-validate, number-range, number-round, number-clamp, string-parse, string-validate, string-encode, string-decode, string-format, string-sanitize, array-create, array-filter, array-map, array-reduce, array-sort, array-flatten, array-unique, array-chunk, array-slice, array-join, object-create, object-get, object-set, object-merge, object-clone, object-keys, object-values, object-entries, object-pick, object-omit, object-freeze, boolean-parse, boolean-validate, json-parse, json-stringify, json-validate, json-schema-validate, type-check, type-convert, type-validate, data-is-null, data-is-undefined, data-is-empty, data-is-valid, data-default`);
    }
    
    return {
      result,
      operation,
      processedAt: new Date().toISOString(),
      ...inputs
    };
  }

  // ================================
  // Number Operations
  // ================================

  private parseNumber(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const radix = node.inputs.radix as number || 10;
    const fallback = node.inputs.fallback as number;
    
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'string') {
      const parsed = parseInt(value, radix);
      return isNaN(parsed) ? fallback : parsed;
    }
    
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    
    return fallback;
  }

  private formatNumber(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const locale = node.inputs.locale as string || 'en-US';
    const options = node.inputs.options as Intl.NumberFormatOptions || {};
    
    if (typeof value !== 'number') {
      throw new Error('Value must be a number for number formatting');
    }
    
    return new Intl.NumberFormat(locale, options).format(value);
  }

  private validateNumber(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const min = node.inputs.min as number;
    const max = node.inputs.max as number;
    const allowNaN = node.inputs.allowNaN as boolean || false;
    const allowInfinity = node.inputs.allowInfinity as boolean || false;
    
    if (typeof value !== 'number') {
      return { isValid: false, reason: 'Not a number' };
    }
    
    if (!allowNaN && isNaN(value)) {
      return { isValid: false, reason: 'NaN not allowed' };
    }
    
    if (!allowInfinity && !isFinite(value)) {
      return { isValid: false, reason: 'Infinity not allowed' };
    }
    
    if (min !== undefined && value < min) {
      return { isValid: false, reason: `Value ${value} is less than minimum ${min}` };
    }
    
    if (max !== undefined && value > max) {
      return { isValid: false, reason: `Value ${value} is greater than maximum ${max}` };
    }
    
    return { isValid: true, value };
  }

  private numberRange(node: WorkflowNode, _inputs: Record<string, unknown>): unknown {
    const start = node.inputs.start as number || 0;
    const end = node.inputs.end as number;
    const step = node.inputs.step as number || 1;
    
    if (end === undefined) {
      throw new Error('End value is required for number range');
    }
    
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    
    return result;
  }

  private roundNumber(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const method = node.inputs.method as string || 'round';
    const precision = node.inputs.precision as number || 0;
    
    if (typeof value !== 'number') {
      throw new Error('Value must be a number for rounding');
    }
    
    const multiplier = Math.pow(10, precision);
    
    switch (method.toLowerCase()) {
      case 'round':
        return Math.round(value * multiplier) / multiplier;
      case 'floor':
        return Math.floor(value * multiplier) / multiplier;
      case 'ceil':
        return Math.ceil(value * multiplier) / multiplier;
      case 'trunc':
        return Math.trunc(value * multiplier) / multiplier;
      default:
        throw new Error(`Unsupported rounding method: ${method}`);
    }
  }

  private clampNumber(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const min = node.inputs.min as number;
    const max = node.inputs.max as number;
    
    if (typeof value !== 'number') {
      throw new Error('Value must be a number for clamping');
    }
    
    if (min !== undefined && max !== undefined) {
      return Math.min(Math.max(value, min), max);
    } else if (min !== undefined) {
      return Math.max(value, min);
    } else if (max !== undefined) {
      return Math.min(value, max);
    }
    
    return value;
  }

  // ================================
  // String Operations
  // ================================

  private parseString(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'number') {
      return value.toString();
    }
    
    if (typeof value === 'boolean') {
      return value.toString();
    }
    
    if (value === null) {
      return 'null';
    }
    
    if (value === undefined) {
      return 'undefined';
    }
    
    return JSON.stringify(value);
  }

  private validateString(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const minLength = node.inputs.minLength as number;
    const maxLength = node.inputs.maxLength as number;
    const pattern = node.inputs.pattern as string;
    const allowEmpty = node.inputs.allowEmpty as boolean || false;
    
    if (typeof value !== 'string') {
      return { isValid: false, reason: 'Not a string' };
    }
    
    if (!allowEmpty && value.length === 0) {
      return { isValid: false, reason: 'Empty string not allowed' };
    }
    
    if (minLength !== undefined && value.length < minLength) {
      return { isValid: false, reason: `String length ${value.length} is less than minimum ${minLength}` };
    }
    
    if (maxLength !== undefined && value.length > maxLength) {
      return { isValid: false, reason: `String length ${value.length} is greater than maximum ${maxLength}` };
    }
    
    if (pattern && !new RegExp(pattern).test(value)) {
      return { isValid: false, reason: `String does not match pattern ${pattern}` };
    }
    
    return { isValid: true, value };
  }

  private encodeString(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const encoding = node.inputs.encoding as string || 'base64';
    
    if (typeof value !== 'string') {
      throw new Error('Value must be a string for encoding');
    }
    
    switch (encoding.toLowerCase()) {
      case 'base64':
        return btoa(value);
      case 'url':
        return encodeURIComponent(value);
      case 'html':
        return value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      case 'uri':
        return encodeURI(value);
      default:
        throw new Error(`Unsupported encoding: ${encoding}`);
    }
  }

  private decodeString(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const encoding = node.inputs.encoding as string || 'base64';
    
    if (typeof value !== 'string') {
      throw new Error('Value must be a string for decoding');
    }
    
    switch (encoding.toLowerCase()) {
      case 'base64':
        return atob(value);
      case 'url':
        return decodeURIComponent(value);
      case 'html':
        return value
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      case 'uri':
        return decodeURI(value);
      default:
        throw new Error(`Unsupported encoding: ${encoding}`);
    }
  }

  private formatString(node: WorkflowNode, _inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? _inputs.value;
    const template = node.inputs.template as string;
    const args = node.inputs.args as Record<string, unknown> || {};
    
    if (typeof value !== 'string') {
      throw new Error('Value must be a string for formatting');
    }
    
    if (!template) {
      return value;
    }
    
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return args[key]?.toString() || match;
    });
  }

  private sanitizeString(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const removeHtml = node.inputs.removeHtml as boolean || false;
    const removeScripts = node.inputs.removeScripts as boolean || false;
    const normalizeWhitespace = node.inputs.normalizeWhitespace as boolean || false;
    
    if (typeof value !== 'string') {
      throw new Error('Value must be a string for sanitization');
    }
    
    let result = value;
    
    if (removeHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }
    
    if (removeScripts) {
      result = result.replace(/<script[^>]*>.*?<\/script>/gi, '');
    }
    
    if (normalizeWhitespace) {
      result = result.replace(/\s+/g, ' ').trim();
    }
    
    return result;
  }

  // ================================
  // Array Operations
  // ================================

  private createArray(node: WorkflowNode, _inputs: Record<string, unknown>): unknown {
    const items = node.inputs.items as unknown[] || [];
    const length = node.inputs.length as number;
    const fillValue = node.inputs.fillValue;
    
    if (length !== undefined) {
      return new Array(length).fill(fillValue);
    }
    
    return items;
  }

  private filterArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const condition = node.inputs.condition as string;
    const value = node.inputs.value;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for filtering');
    }
    
    switch (condition) {
      case 'truthy':
        return array.filter(item => Boolean(item));
      case 'falsy':
        return array.filter(item => !Boolean(item));
      case 'equals':
        return array.filter(item => item === value);
      case 'not-equals':
        return array.filter(item => item !== value);
      case 'includes':
        return array.filter(item => 
          typeof item === 'string' && item.includes(String(value))
        );
      case 'starts-with':
        return array.filter(item => 
          typeof item === 'string' && item.startsWith(String(value))
        );
      case 'ends-with':
        return array.filter(item => 
          typeof item === 'string' && item.endsWith(String(value))
        );
      default:
        throw new Error(`Unsupported filter condition: ${condition}`);
    }
  }

  private mapArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const operation = node.inputs.operation as string;
    const key = node.inputs.key as string;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for mapping');
    }
    
    switch (operation) {
      case 'toString':
        return array.map(item => String(item));
      case 'toNumber':
        return array.map(item => Number(item));
      case 'toBoolean':
        return array.map(item => Boolean(item));
      case 'getProperty':
        if (!key) throw new Error('Key is required for getProperty operation');
        return array.map(item => 
          typeof item === 'object' && item !== null ? (item as any)[key] : undefined
        );
      case 'uppercase':
        return array.map(item => 
          typeof item === 'string' ? item.toUpperCase() : item
        );
      case 'lowercase':
        return array.map(item => 
          typeof item === 'string' ? item.toLowerCase() : item
        );
      default:
        throw new Error(`Unsupported map operation: ${operation}`);
    }
  }

  private reduceArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const operation = node.inputs.operation as string;
    const initialValue = node.inputs.initialValue;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for reduction');
    }
    
    switch (operation) {
      case 'sum':
        return array.reduce((sum, item) => sum + Number(item), Number(initialValue) || 0);
      case 'product':
        return array.reduce((product, item) => product * Number(item), Number(initialValue) || 1);
      case 'concat':
        return array.reduce((str, item) => str + String(item), String(initialValue) || '');
      case 'join':
        const separator = node.inputs.separator as string || '';
        return array.map(String).join(separator);
      case 'max':
        return array.reduce((max, item) => Math.max(max, Number(item)), Number(initialValue) || -Infinity);
      case 'min':
        return array.reduce((min, item) => Math.min(min, Number(item)), Number(initialValue) || Infinity);
      default:
        throw new Error(`Unsupported reduce operation: ${operation}`);
    }
  }

  private sortArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const direction = node.inputs.direction as string || 'asc';
    const key = node.inputs.key as string;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for sorting');
    }
    
    const sorted = [...array];
    
    if (key) {
      sorted.sort((a, b) => {
        const aVal = typeof a === 'object' && a !== null ? (a as any)[key] : a;
        const bVal = typeof b === 'object' && b !== null ? (b as any)[key] : b;
        
        if (direction === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    } else {
      sorted.sort((a, b) => {
        if (direction === 'desc') {
          return a < b ? 1 : a > b ? -1 : 0;
        }
        return a < b ? -1 : a > b ? 1 : 0;
      });
    }
    
    return sorted;
  }

  private flattenArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const depth = node.inputs.depth as number || 1;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for flattening');
    }
    
    if (depth === 1) {
      return array.flat();
    }
    
    let result = array;
    for (let i = 0; i < depth; i++) {
      result = result.flat();
    }
    
    return result;
  }

  private uniqueArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const key = node.inputs.key as string;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for unique operation');
    }
    
    if (key) {
      const seen = new Set();
      return array.filter(item => {
        const value = typeof item === 'object' && item !== null ? (item as any)[key] : item;
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
    
    return [...new Set(array)];
  }

  private chunkArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const size = node.inputs.size as number;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for chunking');
    }
    
    if (!size || size <= 0) {
      throw new Error('Valid size is required for chunking');
    }
    
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    
    return result;
  }

  private sliceArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const start = node.inputs.start as number || 0;
    const end = node.inputs.end as number;
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for slicing');
    }
    
    return array.slice(start, end);
  }

  private joinArray(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const array = node.inputs.array ?? inputs.array;
    const separator = node.inputs.separator as string || '';
    
    if (!Array.isArray(array)) {
      throw new Error('Array is required for joining');
    }
    
    return array.map(String).join(separator);
  }

  // ================================
  // Object Operations
  // ================================

  private createObject(node: WorkflowNode, _inputs: Record<string, unknown>): unknown {
    const properties = node.inputs.properties as Record<string, unknown> || {};
    const prototype = node.inputs.prototype as object;
    
    if (prototype) {
      return Object.create(prototype, properties as PropertyDescriptorMap);
    }
    
    return { ...properties };
  }

  private getObjectProperty(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    const path = node.inputs.path as string;
    const defaultValue = node.inputs.defaultValue;
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for property access');
    }
    
    if (!path) {
      throw new Error('Path is required for property access');
    }
    
    const keys = path.split('.');
    let result = object;
    
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = (result as any)[key];
    }
    
    return result !== undefined ? result : defaultValue;
  }

  private setObjectProperty(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    const path = node.inputs.path as string;
    const value = node.inputs.value;
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for property setting');
    }
    
    if (!path) {
      throw new Error('Path is required for property setting');
    }
    
    const result: Record<string, any> = { ...object };
    const keys = path.split('.');
    let current: Record<string, any> = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key] as Record<string, any>;
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  }

  private mergeObjects(node: WorkflowNode, _inputs: Record<string, unknown>): unknown {
    const objects = node.inputs.objects as Record<string, unknown>[] || [];
    const deep = node.inputs.deep as boolean || false;
    
    if (objects.length === 0) {
      return {};
    }
    
    if (deep) {
      return objects.reduce((result, obj) => this.deepMerge(result, obj), {});
    }
    
    return Object.assign({}, ...objects);
  }

  private cloneObject(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    const deep = node.inputs.deep as boolean || false;
    
    if (typeof object !== 'object' || object === null) {
      return object;
    }
    
    if (deep) {
      return JSON.parse(JSON.stringify(object));
    }
    
    return { ...object };
  }

  private getObjectKeys(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for getting keys');
    }
    
    return Object.keys(object);
  }

  private getObjectValues(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for getting values');
    }
    
    return Object.values(object);
  }

  private getObjectEntries(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for getting entries');
    }
    
    return Object.entries(object);
  }

  private pickObjectProperties(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    const keys = node.inputs.keys as string[];
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for picking properties');
    }
    
    if (!Array.isArray(keys)) {
      throw new Error('Keys array is required for picking properties');
    }
    
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      if (key in object) {
        result[key] = (object as Record<string, unknown>)[key];
      }
    }
    
    return result;
  }

  private omitObjectProperties(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    const keys = node.inputs.keys as string[];
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for omitting properties');
    }
    
    if (!Array.isArray(keys)) {
      throw new Error('Keys array is required for omitting properties');
    }
    
    const result: Record<string, unknown> = {};
    for (const key in object) {
      if (!keys.includes(key)) {
        result[key] = (object as Record<string, unknown>)[key];
      }
    }
    
    return result;
  }

  private freezeObject(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const object = node.inputs.object ?? inputs.object;
    const deep = node.inputs.deep as boolean || false;
    
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object is required for freezing');
    }
    
    if (deep) {
      return this.deepFreeze(object);
    }
    
    return Object.freeze(object);
  }

  // ================================
  // Boolean Operations
  // ================================

  private parseBoolean(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const fallback = node.inputs.fallback as boolean || false;
    
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1' || lower === 'yes') {
        return true;
      }
      if (lower === 'false' || lower === '0' || lower === 'no') {
        return false;
      }
    }
    
    if (typeof value === 'number') {
      return value !== 0;
    }
    
    return fallback;
  }

  private validateBoolean(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    
    if (typeof value === 'boolean') {
      return { isValid: true, value };
    }
    
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (['true', 'false', '1', '0', 'yes', 'no'].includes(lower)) {
        return { isValid: true, value: this.parseBoolean(node, inputs) };
      }
    }
    
    if (typeof value === 'number') {
      return { isValid: true, value: value !== 0 };
    }
    
    return { isValid: false, reason: 'Value cannot be converted to boolean' };
  }

  // ================================
  // JSON Operations
  // ================================

  private parseJson(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const fallback = node.inputs.fallback;
    
    if (typeof value !== 'string') {
      throw new Error('Value must be a string for JSON parsing');
    }
    
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  private stringifyJson(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const space = node.inputs.space as number || 0;
    
    return JSON.stringify(value, null, space);
  }

  private validateJson(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    
    if (typeof value !== 'string') {
      return { isValid: false, reason: 'Value must be a string for JSON validation' };
    }
    
    try {
      JSON.parse(value);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, reason: `Invalid JSON: ${error}` };
    }
  }

  private validateJsonSchema(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const schema = node.inputs.schema as Record<string, unknown>;
    
    if (!schema) {
      throw new Error('Schema is required for JSON schema validation');
    }
    
    // Basic schema validation - in a real implementation, you'd use a proper JSON schema validator
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return { isValid: true, value: parsed };
    } catch (error) {
      return { isValid: false, reason: `Schema validation failed: ${error}` };
    }
  }

  // ================================
  // Type Checking Operations
  // ================================

  private checkType(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    
    if (value === null) {
      return 'null';
    }
    
    if (value === undefined) {
      return 'undefined';
    }
    
    if (Array.isArray(value)) {
      return 'array';
    }
    
    return typeof value;
  }

  private convertType(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const targetType = node.inputs.targetType as string;
    
    switch (targetType) {
      case 'string':
        return String(value);
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      case 'array':
        return Array.isArray(value) ? value : [value];
      case 'object':
        return typeof value === 'object' && value !== null ? value : {};
      default:
        throw new Error(`Unsupported target type: ${targetType}`);
    }
  }

  private validateType(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const expectedType = node.inputs.expectedType as string;
    const allowNull = node.inputs.allowNull as boolean || false;
    const allowUndefined = node.inputs.allowUndefined as boolean || false;
    
    if (!expectedType) {
      throw new Error('Expected type is required for type validation');
    }
    
    const actualType = typeof value;
    const isNull = value === null;
    const isUndefined = value === undefined;
    
    if (isNull && allowNull) {
      return { isValid: true, type: 'null' };
    }
    
    if (isUndefined && allowUndefined) {
      return { isValid: true, type: 'undefined' };
    }
    
    if (isNull || isUndefined) {
      return { isValid: false, type: actualType, expected: expectedType };
    }
    
    const isValid = actualType === expectedType;
    return { isValid, type: actualType, expected: expectedType };
  }

  // ================================
  // Data Validation Operations
  // ================================

  private isNull(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    return value === null;
  }

  private isUndefined(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    return value === undefined;
  }

  private isEmpty(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === 'string') {
      return value.length === 0;
    }
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    
    return false;
  }

  private isValid(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const criteria = node.inputs.criteria as string;
    
    switch (criteria) {
      case 'not-null':
        return value !== null;
      case 'not-undefined':
        return value !== undefined;
      case 'not-empty':
        return !this.isEmpty(node, inputs);
      case 'truthy':
        return Boolean(value);
      case 'falsy':
        return !Boolean(value);
      default:
        return value !== null && value !== undefined;
    }
  }

  private getDefaultValue(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const value = node.inputs.value ?? inputs.value;
    const defaultValue = node.inputs.defaultValue;
    const fallbackIf = node.inputs.fallbackIf as string || 'null-undefined';
    
    switch (fallbackIf) {
      case 'null-undefined':
        return value === null || value === undefined ? defaultValue : value;
      case 'empty':
        return this.isEmpty(node, inputs) ? defaultValue : value;
      case 'falsy':
        return !Boolean(value) ? defaultValue : value;
      case 'always':
        return defaultValue;
      default:
        return value;
    }
  }

  // ================================
  // Helper Methods
  // ================================

  private deepMerge(target: any, source: any): any {
    const result: Record<string, any> = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  private deepFreeze(obj: any): any {
    Object.freeze(obj);
    
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        this.deepFreeze(obj[key]);
      }
    }
    
    return obj;
  }
} 