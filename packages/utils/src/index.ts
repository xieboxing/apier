export function kindOf(value: any): ApierKind {
  if (value === null) {
    return ApierKind.NULL;
  }
  if (value === undefined) {
    return ApierKind.NULL;
  }
  switch (typeof value) {
    case 'boolean':
      return ApierKind.BOOLEAN;
    case 'number':
      if (Number.isInteger(value)) {
        return ApierKind.INTEGER;
      }
      return ApierKind.NUMBER;
    case 'string':
      return ApierKind.STRING;
    default:
      if (Array.isArray(value)) {
        return ApierKind.ARRAY;
      }
      return ApierKind.OBJECT;
  }
}

export enum ApierKind {
  NUMBER = 'number',
  INTEGER = 'integer',
  STRING = 'string',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  NULL = 'null',
}

// 路径 `/model/:id` => `/model/{id}`
export function colonToCurlybrace(url: string): string {
  return url.replace(/\/:([A-Za-z0-9_]+)/g, '/{$1}');
}