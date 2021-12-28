import * as core from '@actions/core';

export function logGroup(name: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      try {
        core.startGroup(name);

        return originalMethod.apply(this, args);
      } finally {
        core.endGroup();
      }
    };
  };
}
