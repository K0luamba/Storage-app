import { StorageConstants } from './constants.helper';

export class Validator {
    static requiredField(value: string): string | null {
      if (!value || value.length === 0) {
        return 'Это обязательное поле';
      }
      return null;
    }

    static checkCountOfProducts(value: string): string | null {
        if (this.requiredField(value)) {
            return this.requiredField(value);
        }
        if (Number(value) < StorageConstants.MIN_COUNT_OF_PRODUCTS || Number(value) > StorageConstants.MAX_COUNT_OF_PRODUCTS) {
            return `Введите число между ${StorageConstants.MIN_COUNT_OF_PRODUCTS} и ${StorageConstants.MAX_COUNT_OF_PRODUCTS}`;
        }
        return null;
    }

    static checkCountOfStores(value: string): string | null {
        if (this.requiredField(value)) {
            return this.requiredField(value);
        }
        if (Number(value) < StorageConstants.MIN_COUNT_OF_STORES || Number(value) > StorageConstants.MAX_COUNT_OF_STORES) {
            return `Введите число между ${StorageConstants.MIN_COUNT_OF_STORES} и ${StorageConstants.MAX_COUNT_OF_STORES}`;
        }
        return null;
    }

    static checkCountOfDays(value: string): string | null {
        if (this.requiredField(value)) {
            return this.requiredField(value);
        }
        if (Number(value) < StorageConstants.MIN_COUNT_OF_DAYS || Number(value) > StorageConstants.MAX_COUNT_OF_DAYS) {
            return `Введите число между ${StorageConstants.MIN_COUNT_OF_DAYS} и ${StorageConstants.MAX_COUNT_OF_DAYS}`;
        }
        return null;
    }
}
