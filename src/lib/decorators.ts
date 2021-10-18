import * as core from '@actions/core';

export function logGroup(name: string) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      try {
        core.startGroup(name);

        return originalMethod.apply(this, args);
      } catch (e) {
        throw e;
      } finally {
        core.endGroup();
      }
    };
  };
}
