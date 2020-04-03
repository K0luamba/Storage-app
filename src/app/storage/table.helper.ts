import { Store, OrderItem } from './types';

// один их дополнительных классов для лучшего визуального представления данных
export class TableHelper {
  public static getStoreName(searchedItem: OrderItem, stores: Array<Store>): string {
    for (const store of stores) {
        if (store.orders[0]) {
            for (const item of store.orders[0].items) {
                if (item.product.name === searchedItem.product.name && item.numberOfPacks === searchedItem.numberOfPacks) {
                    return store.name;
                }
            }
        }
    }
  }
}
